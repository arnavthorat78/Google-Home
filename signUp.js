const signUp = document.querySelector(".signUp");
const feedback = document.querySelector(".feedback");

const temp = document.querySelector(".temp");

const passwordPattern = /^[a-zA-Z0-9]{5,}$/;

const addUser = (user) => {
	let recent_searches = [];
	user.recent_searches.forEach((search) => {
		recent_searches.push(search);
	});
	let html = `
	<p>
		<div>${user.first_name} ${user.last_name}</div>
		<div>${recent_searches.join(", ")}</div>
	</p>
	`;

	temp.innerHTML += html;
};

db.collection("users")
	.get()
	.then((snapshot) => {
		snapshot.docs.forEach((doc) => {
			addUser(doc.data());
		});
	})
	.catch((err) => {
		console.log(err);
	});

signUp.addEventListener("submit", (e) => {
	e.preventDefault();

	let firstName = signUp.firstName.value;
	let lastName = signUp.lastName.value;
	let username = signUp.username.value;
	let email = signUp.email.value;
	let password = signUp.password.value;

	if (passwordPattern.test(password)) {
		const user = {
			first_name: firstName,
			last_name: lastName,
			username: username,
			email: email,
			password: password,
			recent_searches: [],
		};

		db.collection("users")
			.add(user)
			.then(() => {
				console.log("User successfully added.");
			})
			.catch((err) => {
				console.log(err);
			});
	} else {
		feedback.textContent =
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
