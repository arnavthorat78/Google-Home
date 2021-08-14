const signUp = document.querySelector(".signUp");
const feedback = document.querySelector(".feedback");
const userLoadSpinner = document.querySelector("#userLoadSpinner");

const user = document.querySelector(".user");

// Listen for authentication status changes
auth.onAuthStateChanged((userChange) => {
	if (auth.currentUser) {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = auth.currentUser.displayName;
	} else {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = "User";
	}

	console.log(auth.currentUser);
});

// let fullNameRaw = localStorage.getItem("user");
// if (fullNameRaw == null) {
// 	user.innerHTML = "User";
// } else {
// 	const splitFullName = fullNameRaw.split(",");
// 	let fullName = `${splitFullName[0]} ${splitFullName[1]}`;
// 	user.innerHTML = fullName;
// }

const togglePassword = () => {
	let password = signUp.password;

	if (password.type === "password") {
		password.type = "text";
	} else {
		password.type = "password";
	}
};

signUp.addEventListener("submit", (e) => {
	e.preventDefault();

	let displayName = signUp.displayName.value.replace(/[,]/g, "").trim();
	let email = signUp.email.value.replace(/[,]/g, "").trim();
	let password = signUp.password.value;

	let credential = {};

	auth.createUserWithEmailAndPassword(email, password)
		.then((cred) => {
			console.log(cred);

			credential = cred;

			feedback.innerHTML = `Hooray! You have been successfully added!`;

			return cred.user.updateProfile({
				displayName: displayName,
			});

			// return db.collection("users").doc(cred.user.uid).set({
			// 	bio: signupForm["signup-bio"].value,
			// });
		})
		.then(() => {
			return db
				.collection("users")
				.doc(credential.user.uid)
				.set({
					email: email,
					settings: {
						general: {
							greeting: true,
							searchEngine: "Google",
						},
						weather: {
							tempUnits: "metric",
						},
					},
				});
		})
		.catch((err) => {
			console.log(err);

			if (err.code == "auth/weak-password") {
				feedback.innerHTML = `Your password is too weak. It must be longer than six characters.`;
			} else if (err.code == "auth/email-already-in-use") {
				feedback.innerHTML = `Sorry, but this email is already in use. Please use another email address.`;
			} else {
				feedback.innerHTML = `An unknown error occured. Please try again later.`;
			}
		});
});
