const signIn = document.querySelector(".signIn");
const feedback = document.querySelector(".feedback");
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

const togglePassword = () => {
	let password = signIn.password;

	if (password.type === "password") {
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

console.log(users);

signIn.addEventListener("submit", (e) => {
	e.preventDefault();

	let username = signIn.username.value;
	let password = signIn.password.value;

	for (let i = 0; i < users.length; i++) {
		if (users[i].username == username && users[i].password == password) {
			feedback.innerHTML = "You are successfully signed in!";

			localStorage.setItem("user", [
				users[i].first_name,
				users[i].last_name,
				users[i].username,
				users[i].email,
				users[i].password,
			]);
			localStorage.setItem("userRecentSearches", users[i].recent_searches);
			localStorage.setItem("userName", `${users[i].first_name} ${users[i].last_name}`);

			let name = localStorage.getItem("user").split(",");
			let recentSearches = localStorage.getItem("userRecentSearches").split(",");

			console.log(name);
			console.log(recentSearches);

			user.innerHTML = `${name[0]} ${name[1]}`;

			return;
		}
	}

	feedback.innerHTML =
		"Sorry, but your credentials entered in could not be validified. Please try again.";
});
