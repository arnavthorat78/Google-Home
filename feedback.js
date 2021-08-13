const user = document.querySelector(".user");
const feedbackForm = document.querySelector(".feedbackForm");
const submitButton = document.querySelector(".submitFeedback");
const response = document.querySelector(".response");
const feedbackDiv = document.querySelector(".feedback");
const userLoadSpinner = document.querySelector("#userLoadSpinner");
const feedbackLoad = document.querySelector(".feedbackWait");

let allFeedback = [];

const spinner = `
	<div class="spinner-grow spinner-grow-sm" role="status">
		<span class="visually-hidden">Loading...</span>
	</div>
	<span>Posting feedback...</span>
`;
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

const addFeedback = (feedback, id, uid) => {
	let time = feedback.created_at.toDate();
	// let html = `
	// <article data-id="${id}">
	//     <h2>${feedback.title}</h2>
	//     <strong style="font-size: 3vh">Posted by ${feedback.author}</strong>
	//     <p style="font-size: 2.75vh">${feedback.description}</p>
	//     <strong style="font-size: 2.25vh"><img style="height: 25px; width: 25px; cursor: pointer;" class="like" src="./img/Likes.png" alt="Likes" draggable="false" /> ${feedback.thumbs_up}</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	//     <strong style="font-size: 2.25vh"><img style="height: 25px; width: 25px; cursor: pointer;" class="dislike" src="./img/Dislikes.png" alt="Dislikes" draggable="false" /> ${feedback.thumbs_down}</strong><br><br>
	//     <span style="font-size: 1.75vh; color: #555555;">Posted at ${time}</div><br><br>
	// 	   <span style="font-size: 1.5vh;"><img style="height: 20px; width: 20px; cursor: pointer;" class="spam" src="./img/Spam.png" alt="Spam" draggable="false" /> ${feedback.spam_rates}</span>
	// </article>
	// `;

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

	// <ul class="list-group list-group-flush">
	// 	<li class="list-group-item">
	// 		<div class="h4 text-success">
	// 			<i class="bi bi-hand-thumbs-up-fill like" style="cursor: pointer"></i>$
	// 			{feedback.thumbs_up}
	// 		</div>
	// 	</li>
	// 	<li class="list-group-item">
	// 		<div class="h4 text-danger">
	// 			<i class="bi bi-hand-thumbs-down-fill dislike" style="cursor: pointer"></i>$
	// 			{feedback.thumbs_down}
	// 		</div>
	// 	</li>
	// 	<li class="list-group-item">
	// 		<div class="h4 text-warning">
	// 			<i class="bi bi-slash-circle-fill spam" style="cursor: pointer"></i>
	// 		</div>
	// 	</li>
	// </ul>;

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

// db.collection("feedback")
// 	.get()
// 	.then((snapshot) => {
// 		snapshot.docs.forEach((doc) => {
// 			allFeedback.push(doc.data());

// 			addFeedback(doc.data(), doc.id);
// 		});
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

feedbackForm.addEventListener("submit", (e) => {
	e.preventDefault();

	response.innerHTML = spinner;

	let title = feedbackForm.title.value.trim();
	let description = feedbackForm.description.value;

	// let firebaseTitle = title.replace(/[!#$%&*+\\/?@[\]^_`{|}~]/g, "");

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
