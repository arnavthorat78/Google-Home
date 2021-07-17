const signUp = document.querySelector(".signUp");
const feedback = document.querySelector(".feedback");
const temp = document.querySelector(".temp");

const user = document.querySelector(".user");

let users = [];

let fullNameRaw = localStorage.getItem("user");
if (fullNameRaw == null) {
	user.innerHTML = "User";
} else {
	const splitFullName = fullNameRaw.split(",");
	let fullName = `${splitFullName[0]} ${splitFullName[1]}`;
	user.innerHTML = fullName;
}

const passwordPattern = /^[a-zA-Z0-9]{5,}$/;

const togglePassword = () => {
	let password = signUp.password;

	if (password.type === "password") {
		password.type = "text";
	} else {
		password.type = "password";
	}
};

// const addUser = (user) => {
// 	let recent_searches = [];
// 	user.recent_searches.forEach((search) => {
// 		recent_searches.push(search);
// 	});
// 	let html = `
// 	<p>
// 		<div>${user.first_name} ${user.last_name}</div>
// 		<div>${recent_searches.join(", ")}</div>
// 	</p>
// 	`;

// 	temp.innerHTML += html;
// };

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

// db.collection("users")
// 	.get()
// 	.then((snapshot) => {
// 		snapshot.docs.forEach((doc) => {
// 			addUser(doc.data());
// 		});
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

signUp.addEventListener("submit", (e) => {
	e.preventDefault();

	let firstName = signUp.firstName.value.replace(/[,]/g, "").trim();
	let lastName = signUp.lastName.value.replace(/[,]/g, "").trim();
	let username = signUp.username.value.replace(/[,]/g, "").trim();
	let email = signUp.email.value.replace(/[,]/g, "").trim();
	let password = signUp.password.value;

	if (passwordPattern.test(password)) {
		for (let i = 0; i < users.length; i++) {
			if (users[i].username == username) {
				feedback.innerHTML =
					"Sorry, but an account with this username already exists. Please choose another username.";

				return;
			}
		}

		const user = {
			first_name: firstName,
			last_name: lastName,
			username: username,
			email: email,
			password: password,
			recent_searches: ["Testing..."],
		};

		db.collection("users")
			.doc(username)
			.set(user)
			.then(() => {
				console.log("User successfully added!");
			})
			.catch((error) => {
				console.error(error);
			});

		feedback.innerHTML = `Hooray! You have been successfully added! Now sign in from the <a href="signIn.html">Sign In</a> page!`;
	} else {
		feedback.innerHTML =
			"The password must contain letters and numbers only (no symbols), and longer than 5 characters.";
	}
});

signUp.password.addEventListener("keyup", (e) => {
	if (passwordPattern.test(e.target.value)) {
		signUp.password.setAttribute("class", "success");
	} else {
		signUp.password.setAttribute("class", "error");
	}
});
