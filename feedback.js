const user = document.querySelector(".user");
const feedbackForm = document.querySelector(".feedbackForm");
const submitButton = document.querySelector(".submitFeedback");
const response = document.querySelector(".response");
const feedbackDiv = document.querySelector(".feedback");
const userLoadSpinner = document.querySelector("#userLoadSpinner");
const feedbackLoad = document.querySelector(".feedbackWait");
const editForm = document.querySelector(".editForm");
const editResponse = document.querySelector(".editResponse");

let allFeedback = [];

const spinner = (message) => {
	return `
		<div class="spinner-grow spinner-grow-sm" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
		<span>${message}</span>
	`;
};
let globalUser = {};
let editable = [];

let admin = false;

// Listen for authentication status changes
auth.onAuthStateChanged((userChange) => {
	if (auth.currentUser) {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = auth.currentUser.displayName;

		globalUser = userChange;
		submitButton.disabled = false;

		db.collection("users")
			.doc(userChange.uid)
			.onSnapshot(
				(snapshot) => {
					admin = snapshot.data().admin;
					console.log(admin);
				},
				(err) => {
					console.log(err.message);
				}
			);
	} else {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = "User";

		submitButton.disabled = true;

		admin = false;
	}

	console.log(auth.currentUser);
});

const addFeedback = (feedback, id, uid) => {
	let time = feedback.created_at.toDate();

	if (!feedbackLoad.classList.contains("d-none")) {
		feedbackLoad.classList.add("d-none");
	}

	if (uid == globalUser.uid) {
		console.log(`${id} is editable!`);

		editable.push(id);
	}

	let html = `
		<div class="card shadow mb-5" data-id="${id}" data-uid="${uid}" style="width: 100%">
			<div class="card-body">
				<h2 class="card-title">${feedback.title}</h2>
				<p class="card-subtitle text-muted">${feedback.author}</p>
				<p class="card-text" style="font-size: large">${feedback.description}</p>
			</div>
			<div class="card-footer text-muted">
				<span>${time}</span>
				${
					uid == globalUser.uid
						? `
				<br />
				<div class="btn-group" role="group">
					<button class="btn btn-success btn-sm mt-2" data-bs-toggle="modal" id="edit" data-bs-target="#staticBackdrop" title="Edit update (${feedback.title})"><i class="bi bi-pencil"></i></button>
					<button class="btn btn-danger btn-sm mt-2" id="delete" title="Delete update (${feedback.title})"><i class="bi bi-trash"></i></button>
				</div>
				`
						: ""
				}
			</div>
		</div>
	`;

	feedbackDiv.innerHTML += html;
};

const deleteFeedback = (id) => {
	const feedbacks = document.querySelectorAll(".card");
	feedbacks.forEach((feedback) => {
		if (feedback.getAttribute("data-id") === id) {
			feedback.remove();
		}
	});
};

db.collection("feedback")
	.orderBy("created_at", "desc")
	.onSnapshot((snapshot) => {
		snapshot.docChanges().forEach((change) => {
			const doc = change.doc;

			if (change.type === "added") {
				addFeedback(doc.data(), doc.id, doc.data().uid);
			} else if (change.type === "removed") {
				deleteFeedback(doc.id);
			}
		});
	});

feedbackForm.addEventListener("submit", (e) => {
	e.preventDefault();

	response.innerHTML = spinner("Posting feedback...");

	let title = feedbackForm.title.value.trim();
	let description = feedbackForm.description.value;

	const now = new Date();
	const feedback = {
		title: title,
		description: description,
		author: auth.currentUser.displayName,
		created_at: firebase.firestore.Timestamp.fromDate(now),
		uid: globalUser.uid,
	};

	db.collection("feedback")
		.doc()
		.set(feedback)
		.then(() => {
			console.log("Feedback successfully added!");

			response.innerHTML = "Feedback successfully posted!";
		})
		.catch((error) => {
			console.error(error);
		});
});

editForm.addEventListener("submit", (e) => {
	e.preventDefault();

	editResponse.innerHTML = spinner("Editing feedback...");

	const now = new Date();
	const editObject = {
		uid: editForm.uid.value,
		author: editForm.author.value,
		created_at: firebase.firestore.Timestamp.fromDate(now),
		title: editForm.title.value,
		description: editForm.description.value,
	};

	db.collection("feedback")
		.doc(editForm.firebaseId.value)
		.set(editObject)
		.then(() => {
			editResponse.innerHTML = `Feedback '${editObject.title}' has been successfully edited!`;
		})
		.catch((err) => {
			console.log(err);

			editResponse.innerHTML = `An unknown error occured while editing the feedback. Please try again later.`;
		});
});

feedbackDiv.addEventListener("click", (e) => {
	if (e.target.id === "delete") {
		const id = e.path[3].getAttribute("data-id");

		console.log(id);

		if (
			confirm(
				"Are you sure you want to delete this feedback? This change cannot be reversed."
			)
		) {
			db.collection("feedback")
				.doc(id)
				.delete()
				.then(() => {
					console.log("Feedback deleted!");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	if (e.target.id === "edit") {
		const firebaseId = e.path[3].getAttribute("data-id");
		const uid = globalUser.uid;
		const author = e.path[3].children[0].children[1].innerHTML;
		const date = e.path[3].children[1].children[0].innerHTML;
		const title = e.path[3].children[0].children[0].innerHTML;
		const description = e.path[3].children[0].children[2].innerHTML;

		editForm.firebaseId.value = firebaseId;
		editForm.uid.value = uid;
		editForm.author.value = author;
		editForm.date.value = date;
		editForm.title.value = title;
		editForm.description.value = description;
	}
});
