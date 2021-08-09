const user = document.querySelector(".user");
// const deleteAccountPassword = document.querySelector("#deleteAccountPassword");
const signOut = document.querySelector(".signOut");
const deleteAccount = document.querySelector(".deleteAccount");
// const submitButton = document.querySelector(".submitButton");
const feedback = document.querySelector(".feedback");
const info = document.querySelector(".info");

const userLoadSpinner = document.querySelector("#userLoadSpinner");

// Listen for authentication status changes
auth.onAuthStateChanged((userChange) => {
	if (auth.currentUser) {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = auth.currentUser.displayName;

		info.innerHTML = `
			<div>You are logged in as <strong>${auth.currentUser.email}</strong> (${auth.currentUser.displayName}).</div>
		`;

		signOut.disabled = false;
		deleteAccount.disabled = false;
	} else {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = "User";

		signOut.disabled = true;
		deleteAccount.disabled = true;
	}

	console.log(auth.currentUser);
});

const togglePassword = () => {
	let password = deleteAccountPassword.password;

	if (password.type == "password") {
		password.type = "text";
	} else {
		password.type = "password";
	}
};

// db.collection("users")
// 	.get()
// 	.then((snapshot) => {
// 		snapshot.docs.forEach((doc) => {
// 			users.push(doc.data());
// 		});
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

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

				feedback.innerHTML =
					"Sorry, but an unknown error occured while deleting your account. Please try again later.";
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
