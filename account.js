const user = document.querySelector(".user");
const deleteAccountPassword = document.querySelector(".deleteAccountPassword");
const signOut = document.querySelector(".signOut");
const deleteAccount = document.querySelector(".deleteAccount");
const feedback = document.querySelector(".feedback");

deleteAccountPassword.style.visibility = "hidden";

let users = [];

let fullNameRaw = localStorage.getItem("user");
if (fullNameRaw == null) {
	user.innerHTML = "User";
} else {
	const splitFullName = fullNameRaw.split(",");
	let fullName = `${splitFullName[0]} ${splitFullName[1]}`;
	user.innerHTML = fullName;
}

const togglePassword = () => {
	let password = deleteAccountPassword.password;

	if (password.type == "password") {
		password.type = "text";
	} else {
		password.type = "password";
	}
};

db.collection("users")
	.get()
	.then((snapshot) => {
		snapshot.docs.forEach((doc) => {
			users.push(doc.data());
		});
	})
	.catch((err) => {
		console.log(err);
	});

deleteAccount.addEventListener("click", () => {
	deleteAccountPassword.style.visibility = "visible";

	feedback.innerHTML = "Please enter your password to delete your account.";
});

deleteAccountPassword.addEventListener("submit", (e) => {
	e.preventDefault();

	const password = deleteAccountPassword.password.value;

	let infoArray = fullNameRaw.split(",");

	if (!(password == infoArray[4])) {
		feedback.innerHTML = "Sorry, but your password does not match. Please try again.";

		return;
	} else {
		const sure = confirm(
			"Are you sure you want to delete your account? You will lose all of your data."
		);

		if (sure) {
			localStorage.removeItem("user");
			localStorage.removeItem("userName");
			localStorage.removeItem("userRecentSearches");

			db.collection("users")
				.doc(infoArray[2])
				.delete()
				.then(() => {
					feedback.innerHTML = "Your account has been successfully deleted.";

					user.innerHTML = "User";
				})
				.catch((err) => {
					console.log(error);
				});
		} else {
			return;
		}
	}
});

signOut.addEventListener("click", () => {
	const sure = confirm("Are you sure you want to log out?");

	if (sure) {
		localStorage.removeItem("user");
		localStorage.removeItem("userName");
		localStorage.removeItem("userRecentSearches");

		user.innerHTML = "User";
	} else {
		return;
	}
});
