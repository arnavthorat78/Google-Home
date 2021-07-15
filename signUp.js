const signUp = document.querySelector(".signUp");
const response = document.querySelector(".response");

signUp.addEventListener("submit", (e) => {
	e.preventDefault();

	let firstName = signUp.firstName.value;
	let lastName = signUp.lastName.value;
	let email = signUp.email.value;
	let password = signUp.password.value;
	let confirmPassword = signUp.confirmPassword.value;

	if (!(password == confirmPassword)) {
		response.innerHTML = "Please make sure that both passwords match.";
		setTimeout(() => {
			response.innerHTML = "";
		}, 5000);
	}
});
