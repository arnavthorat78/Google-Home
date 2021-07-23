const user = document.querySelector(".user");
const greeting = document.querySelector(".greeting");
const scrollUp = document.querySelector(".scrollUp");

let randNum = Math.ceil(Math.random() * 5);

let fullNameRaw = localStorage.getItem("user");
if (fullNameRaw == null) {
	user.innerHTML = "User";
} else {
	const splitFullName = fullNameRaw.split(",");
	let firstName = splitFullName[0];
	let fullName = `${splitFullName[0]} ${splitFullName[1]}`;
	user.innerHTML = fullName;

	if (randNum == 1) {
		greeting.innerHTML = `Welcome back, ${firstName}!`;
	} else if (randNum == 2) {
		greeting.innerHTML = `Hello, ${firstName}!`;
	} else if (randNum == 3) {
		greeting.innerHTML = `Let's start searching, ${firstName}!`;
	} else if (randNum == 4) {
		greeting.innerHTML = `What should we do, ${firstName}?`;
	} else {
		greeting.innerHTML = `Hi, ${firstName}!`;
	}
}

scrollUp.addEventListener("click", () => {
	window.scroll({
		top: 0,
		left: 0,
		behavior: "smooth",
	});
});
