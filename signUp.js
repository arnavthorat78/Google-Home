const signUp = document.querySelector(".signUp");
const feedback = document.querySelector(".feedback");

const passwordPattern = /^[a-zA-Z0-9]{5,}$/;

signUp.addEventListener("submit", (e) => {
	e.preventDefault();

	let firstName = signUp.firstName.value;
	let lastName = signUp.lastName.value;
	let username = signUp.username.value;
	let email = signUp.email.value;
	let password = signUp.password.value;

	if (passwordPattern.test(password)) {
		feedback.textContent = "Your password is valid!";
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
