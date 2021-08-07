// Getting references to elements in the DOM
const user = document.querySelector(".user");
const greeting = document.querySelector(".greeting");
const hours = document.querySelector(".hoursSinceRelease");
const scrollUp = document.querySelector(".scrollUp");

// Getting a random number for later use
let randNum = Math.ceil(Math.random() * 10);

// Getting the user's name from local storage
let fullNameRaw = localStorage.getItem("user");
if (fullNameRaw == null) {
	// If the name is nothing (which means the user doesn't have an account), then set the navbar name to User
	user.innerHTML = "User";
} else {
	// Spliting the name, and appending it to the navbar
	const splitFullName = fullNameRaw.split(",");
	let firstName = splitFullName[0];
	let fullName = `${splitFullName[0]} ${splitFullName[1]}`;
	user.innerHTML = fullName;

	// Getting the hours for later use
	const now = new Date().getHours();

	// Random greetings
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

// Time since
// TODO Get a better formula
let updateTime = new Date("August 6, 2021 17:00:00").getHours();
let now = new Date().getHours();
hours.innerHTML = `${24 - updateTime + now} hours ago`;

// Making the window scroll to the top when button clicked
scrollUp.addEventListener("click", () => {
	window.scroll({
		top: 0,
		left: 0,
		behavior: "smooth",
	});
});
