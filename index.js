const user = document.querySelector(".user");
const greeting = document.querySelector(".greeting");
const scrollUp = document.querySelector(".scrollUp");

let randNum = Math.ceil(Math.random() * 10);

let fullNameRaw = localStorage.getItem("user");
if (fullNameRaw == null) {
	user.innerHTML = "User";
} else {
	const splitFullName = fullNameRaw.split(",");
	let firstName = splitFullName[0];
	let fullName = `${splitFullName[0]} ${splitFullName[1]}`;
	user.innerHTML = fullName;

	const now = new Date().getHours();

	if (randNum == 1) {
		greeting.innerHTML = `Welcome back, ${firstName}!`;
	} else if (randNum == 2) {
		greeting.innerHTML = `Hello, ${firstName}!`;
	} else if (randNum == 3) {
		greeting.innerHTML = `Let's start searching, ${firstName}!`;
	} else if (randNum == 4) {
		greeting.innerHTML = `What should we do, ${firstName}?`;
	} else if (randNum == 5 || randNum == 6) {
		if (now >= 0 && now < 12) {
			greeting.innerHTML = `Good morning, ${firstName}!`;
		} else if (now >= 12 && now < 17) {
			greeting.innerHTML = `Good afternoon, ${firstName}!`;
		} else {
			greeting.innerHTML = `Good evening, ${firstName}!`;
		}
	} else if (randNum == 7) {
		greeting.innerHTML = `Glad to see you again, ${firstName}!`;
	} else if (randNum == 8) {
		greeting.innerHTML = `What to do, ${firstName}?`;
	} else if (randNum == 9) {
		greeting.innerHTML = `Welcome, ${firstName}!`;
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
