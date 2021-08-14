const user = document.querySelector(".user");
const feedbackForm = document.querySelector(".feedbackForm");
const submitButton = document.querySelector(".submitFeedback");
const response = document.querySelector(".response");
const feedbackDiv = document.querySelector(".feedback");
const userLoadSpinner = document.querySelector("#userLoadSpinner");
const feedbackLoad = document.querySelector(".feedbackWait");
// const editForm = document.querySelector(".editForm");
// const editResponse = document.querySelector(".editResponse");

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

// Listen for authentication status changes
auth.onAuthStateChanged((userChange) => {
	if (auth.currentUser) {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = auth.currentUser.displayName;

		globalUser = userChange;
		submitButton.disabled = false;
	} else {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = "User";

		submitButton.disabled = true;
	}

	console.log(auth.currentUser);
});

// const initialiseEdit = (button, id, title, description) => {
// 	console.log(title, id);

// 	button.addEventListener("click", (e) => {
// 		console.log(e);
// 	});
// };

// const copyToClipboard = (ele) => {
// 	const copyText = ele;

// 	copyText.select();
// 	copyText.setSelectionRange(0, 99999);
// 	document.execCommand("copy");

// 	console.log("Copied!");
// };

const addFeedback = (feedback, id, uid) => {
	let time = feedback.created_at.toDate();

	if (!feedbackLoad.classList.contains("d-none")) {
		feedbackLoad.classList.add("d-none");
	}

	// if (uid == globalUser.uid) {
	// 	console.log(`${id} is editable!`);

	// 	editable.push(id);
	// }

	let html = `
		<div class="card shadow mb-5" data-id="${id}" data-uid="${uid}" style="width: 100%">
			<div class="card-body">
				<h2 class="card-title">${feedback.title} ${
		editable.includes(id)
			? `<button type="button" class="btn btn-outline-secondary ms-2" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="bi bi-pencil-fill"></i></button>`
			: ""
	}</h2>
				<p class="card-subtitle text-muted">Posted by ${feedback.author}</p>
				<p class="card-text" style="font-size: large">${feedback.description}</p>
			</div>
			<div class="card-footer text-muted">Posted at ${time}</div>
		</div>
	`;

	feedbackDiv.innerHTML += html;

	// `<button type="button" class="btn btn-outline-secondary ms-2 ${id}" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="bi bi-pencil-fill"></i></button>`

	// if (document.querySelector(`.${id}`) == null) {
	// 	return;
	// } else if (document.querySelector(`.${id}`) != null) {
	// 	initialiseEdit(
	// 		document.querySelector(`.${id}`),
	// 		document.querySelector(`.${id}`).classList[3],
	// 		feedback.title,
	// 		feedback.description
	// 	);

	// 	// document.querySelector(`.${id}`).addEventListener("click", (e) => {
	// 	// 	console.log(e);
	// 	// 	initialiseEdit(document.querySelector(`.${id}`).classList[3]);
	// 	// });
	// }

	// 	${
	// 	editable.includes(id)
	// 		? `<div class="row justify-content-center my-5">
	// 				<div class="col-2">
	// 					<button
	// 						class="btn btn-outline-danger btn-sm"
	// 						type="button"
	// 						data-bs-toggle="collapse"
	// 						data-bs-target="#collapseExample"
	// 						aria-expanded="false"
	// 						aria-controls="collapseExample"
	// 					>Need to edit? You might need this information!</button>
	// 					<div class="m-1 collapse" id="collapseExample">
	// 						<small class="text-muted">ID for editing:
	// 							<input class="form-control mt-1 mb-1 ${id}" style="width: 225px;" type="text" readonly value="${id}" />
	// 							<button type="button" class="btn btn-outline-secondary btn-sm" onclick="() => { copyToClipboard(document.querySelector(".${id}")) }"><i class="bi bi-clipboard-plus"></i></button>
	// 						</small>
	// 					</div>
	// 				</div>
	// 			</div>`
	// 		: ""
	// }
};

const deleteFeedback = (id) => {
	const feedbacks = document.querySelectorAll(".card");
	feedbacks.forEach((feedback) => {
		if (feedback.getAttribute("data-id") === id) {
			feedback.remove();
		}
	});
};

db.collection("feedback").onSnapshot((snapshot) => {
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

// editForm.addEventListener("submit", (e) => {
// 	e.preventDefault();

// 	editResponse.innerHTML = spinner("Editing feedback...");

// 	let title = editForm.title.value.trim();
// 	let description = editForm.description.value;

// 	console.log(e, title, description);
// });

// feedbackDiv.addEventListener("click", (e) => {
// 	if (e.target.className[2] === "spam") {
// 		const id =
// 			e.target.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute(
// 				"data-id"
// 			);

// 		console.log(id);

// 		const sure = confirm(
// 			"Are you sure you want to spam this feedback post? The post will not be visible to anyone."
// 		);

// 		if (!sure) {
// 			return;
// 		} else {
// 			db.collection("feedback")
// 				.doc(id)
// 				.delete()
// 				.then(() => {
// 					console.log("Post deleted!");
// 				})
// 				.catch((err) => {
// 					console.log(err);
// 				});
// 		}
// 	}

// 	if (e.target.className === "like") {
// 		const id = e.target.parentElement.parentElement.getAttribute("data-id");
// 		let likeDocRef = db.collection("feedback").doc(id);

// 		db.runTransaction((transaction) => {
// 			return transaction.get(likeDocRef).then((likeDoc) => {
// 				if (!likeDoc.exists) {
// 					throw "Document does not exist!";
// 				}

// 				let newLikes = likeDoc.data().thumbs_up + 1;
// 				transaction.update(likeDocRef, { thumbs_up: newLikes });
// 			});
// 		})
// 			.then(() => {
// 				console.log("Added like!");
// 			})
// 			.catch((error) => {
// 				console.log(error);
// 			});
// 	}

// 	if (e.target.className === "dislike") {
// 		const id = e.target.parentElement.parentElement.getAttribute("data-id");
// 		let dislikeDocRef = db.collection("feedback").doc(id);

// 		db.runTransaction((transaction) => {
// 			return transaction.get(dislikeDocRef).then((dislikeDoc) => {
// 				if (!dislikeDoc.exists) {
// 					throw "Document does not exist!";
// 				}

// 				let newDislikes = dislikeDoc.data().thumbs_down + 1;
// 				transaction.update(dislikeDocRef, { thumbs_down: newDislikes });
// 			});
// 		})
// 			.then(() => {
// 				console.log("Added dislike!");
// 			})
// 			.catch((error) => {
// 				console.log(error);
// 			});
// 	}
// });
