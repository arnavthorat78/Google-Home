const user = document.querySelector(".user");
// const deleteAccountPassword = document.querySelector("#deleteAccountPassword");
const signOut = document.querySelector(".signOut");
const deleteAccount = document.querySelector(".deleteAccount");
// const submitButton = document.querySelector(".submitButton");
const feedback = document.querySelector(".feedback");
const info = document.querySelector(".info");
const changeName = document.querySelector(".changeName");
const nameFeedback = document.querySelector(".nameFeedback");
const nameSubmit = document.querySelector("#nameSubmit");

const userLoadSpinner = document.querySelector("#userLoadSpinner");

// Listen for authentication status changes
auth.onAuthStateChanged((userChange) => {
	if (auth.currentUser) {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = auth.currentUser.displayName;

		nameSubmit.disabled = false;
		signOut.disabled = false;
		deleteAccount.disabled = false;

		db.collection("users")
			.doc(userChange.uid)
			.onSnapshot(
				(snapshot) => {
					console.log(snapshot.data().settings.general.searchEngine);

					info.innerHTML = `
						<div>You are logged in as <strong>${auth.currentUser.email}</strong> (${
						auth.currentUser.displayName
					}).</div>
						<div>Administrator: <strong>${snapshot.data().admin}</strong></div>
					`;
				},
				(err) => {
					console.log(err.message);
				}
			);
	} else {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = "User";

		info.innerHTML = `
			<div>You are not logged in.</div>
		`;

		nameSubmit.disabled = true;
		signOut.disabled = true;
		deleteAccount.disabled = true;
	}

	console.log(auth.currentUser);
});

const shortcuts = document.querySelector("#shortcuts");
shortcuts.addEventListener("click", () => {
	open("./keyboard.html", "", "width=250px;height=250px");
});

// Adding keyboard shortcut listeners, and reacting to them depending on the stroke.
// For information on the key codes, see https://keycode.info/.
document.onkeydown = (e) => {
	if (e.ctrlKey && e.altKey && e.key == "h") {
		open("./index.html", "_self");
	}
	if (e.ctrlKey && e.altKey && e.key == "s") {
		open("./search/search.html", "_self");
	}
	if (e.ctrlKey && e.altKey && e.key == "w") {
		open("./search/weather.html", "_self");
	}
	if (e.ctrlKey && e.altKey && e.key == "g") {
		open("./settings.html", "_self");
	}
	if (e.ctrlKey && e.altKey && e.key == "f") {
		open("./feedback.html", "_self");
	}

	if (e.ctrlKey && e.altKey && e.key == "t") {
		window.scroll({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
	}
	if (e.ctrlKey && e.altKey && e.key == "b") {
		window.scroll({
			top: window.innerHeight,
			left: 0,
			behavior: "smooth",
		});
	}
	if (e.ctrlKey && e.altKey && e.key == "m") {
		window.scroll({
			top: window.innerHeight / 2,
			left: 0,
			behavior: "smooth",
		});
	}
};

const togglePassword = () => {
	let password = deleteAccountPassword.password;

	if (password.type == "password") {
		password.type = "text";
	} else {
		password.type = "password";
	}
};

changeName.addEventListener("submit", (e) => {
	e.preventDefault();

	const changedName = changeName.changingName.value;

	auth.currentUser
		.updateProfile({
			displayName: changedName,
		})
		.then(() => {
			nameFeedback.innerHTML = "Your name has been successfully changed!";

			user.innerHTML = changedName;
		})
		.catch((error) => {
			console.log(error);
		});
});

deleteAccount.addEventListener("click", () => {
	if (confirm("Are you sure you want to delete your account?")) {
		auth.currentUser
			.delete()
			.then(() => {
				feedback.innerHTML = "Your account has successfully been deleted.";

				user.innerHTML = "User";
			})
			.catch((error) => {
				console.log(error);

				if (error.code == "auth/requires-recent-login") {
					feedback.innerHTML =
						"Sorry, but you have signed in too long ago for this action to be completed. To successfully delete your account, sign in again on the sign-in page.";
				} else {
					feedback.innerHTML =
						"Sorry, but an unknown error occured while deleting your account. Please try again later.";
				}
			});
	}
});

// deleteAccountPassword.password.addEventListener("keyup", (e) => {
// 	let infoArray = fullNameRaw.split(",");

// 	if (e.target.value != infoArray[4]) {
// 		submitButton.disabled = true;
// 	} else {
// 		submitButton.disabled = false;
// 	}
// });

// deleteAccountPassword.addEventListener("submit", (e) => {
// 	e.preventDefault();
// });

signOut.addEventListener("click", () => {
	if (confirm("Are you sure you want to log out?")) {
		auth.signOut()
			.then(() => {
				user.innerHTML = "User";
			})
			.catch((err) => {
				console.log(err);
			});
	}
});
