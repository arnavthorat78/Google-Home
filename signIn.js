const signIn = document.querySelector(".signIn");
const feedback = document.querySelector(".feedback");
const user = document.querySelector(".user");
const userLoadSpinner = document.querySelector("#userLoadSpinner");

const shortcuts = document.querySelector("#shortcuts");
shortcuts.addEventListener("click", () => {
	open("./keyboard.html", "", "width=250px;height=250px");
});

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

// let fullNameRaw = localStorage.getItem("user");
// if (fullNameRaw == null) {
// 	user.innerHTML = "User";
// } else {
// 	const splitFullName = fullNameRaw.split(",");
// 	let fullName = `${splitFullName[0]} ${splitFullName[1]}`;
// 	user.innerHTML = fullName;
// }

const togglePassword = () => {
	let password = signIn.password;

	if (password.type === "password") {
		password.type = "text";
	} else {
		password.type = "password";
	}
};

signIn.addEventListener("submit", (e) => {
	e.preventDefault();

	let email = signIn.email.value;
	let password = signIn.password.value;

	auth.signInWithEmailAndPassword(email, password)
		.then((cred) => {
			console.log(cred);

			user.innerHTML = auth.currentUser.displayName;

			feedback.innerHTML = "Hooray! You have been successfully signed in!";
		})
		.catch((err) => {
			console.log(err);

			if (err.code == "auth/user-not-found") {
				feedback.innerHTML = "Sorry, but this account could not be found.";
			} else if (err.code == "auth/wrong-password") {
				feedback.innerHTML =
					"Sorry, but you have entered the incorrect password for your account.";
			} else {
				feedback.innerHTML = "Sorry, but an unknown error occured.";
			}
		});

	// for (let i = 0; i < users.length; i++) {
	// 	if (users[i].username == username && users[i].password == password) {
	// 		feedback.innerHTML = "You are successfully signed in!";

	// 		localStorage.setItem("user", [
	// 			users[i].first_name,
	// 			users[i].last_name,
	// 			users[i].username,
	// 			users[i].email,
	// 			users[i].password,
	// 		]);
	// 		localStorage.setItem("userRecentSearches", users[i].recent_searches);
	// 		localStorage.setItem("userName", `${users[i].first_name} ${users[i].last_name}`);

	// 		let name = localStorage.getItem("user").split(",");
	// 		let recentSearches = localStorage.getItem("userRecentSearches").split(",");

	// 		user.innerHTML = `${name[0]} ${name[1]}`;

	// 		return;
	// 	}
	// }
});
