const user = document.querySelector(".user");
const feedbackForm = document.querySelector(".feedbackForm");
const submitButton = document.querySelector(".submitFeedback");
const response = document.querySelector(".response");
const feedbackDiv = document.querySelector(".feedback");

let allFeedback = [];

let fullNameRaw = localStorage.getItem("user");
if (fullNameRaw == null) {
	user.innerHTML = "User";

	submitButton.disabled = true;
	response.innerHTML = "Sorry, but you must have an account to submit feedback.";
} else {
	const splitFullName = fullNameRaw.split(",");
	let fullName = `${splitFullName[0]} ${splitFullName[1]}`;
	user.innerHTML = fullName;
}

const addFeedback = (feedback) => {
	let localInfo = fullNameRaw.split(",");

	let time = feedback.created_at.toDate();
	let html = `
	<article>
        <h2>${feedback.title}</h2>
        <strong style="font-size: 3vh">Posted by ${localInfo[0]} ${localInfo[1]}</strong>
        <p>${feedback.description}</p>
        <strong style="font-size: 2vh"><img style="height: 25px; width: 25px;" src="./img/Likes.png" alt="Likes" draggable="false" /> ${feedback.thumbs_up}</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <strong style="font-size: 2vh"><img style="height: 25px; width: 25px;" src="./img/Dislikes.png" alt="Dislikes" draggable="false" /> ${feedback.thumbs_down}</strong><br><br>
        <span style="font-size: 1vh; color: #555555;">Posted at ${time}</span>
    </article>
	`;

	feedbackDiv.innerHTML += html;
};

db.collection("feedback")
	.get()
	.then((snapshot) => {
		snapshot.docs.forEach((doc) => {
			allFeedback.push(doc.data());

			addFeedback(doc.data());
		});
	})
	.catch((err) => {
		console.log(err);
	});

feedbackForm.addEventListener("submit", (e) => {
	e.preventDefault();

	let title = feedbackForm.title.value.trim();
	let description = feedbackForm.description.value;

	let firebaseTitle = title.replace(/[!#$%&*+\\/?@[\]^_`{|}~]/g, "");

	const now = new Date();
	const feedback = {
		title: title,
		description: description,
		thumbs_up: 0,
		thumbs_down: 0,
		created_at: firebase.firestore.Timestamp.fromDate(now),
	};

	db.collection("feedback")
		.doc(firebaseTitle)
		.set(feedback)
		.then(() => {
			console.log("Feedback successfully added!");
		})
		.catch((error) => {
			console.error(error);
		});
});
