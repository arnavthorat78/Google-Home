// Getting references to elements in the DOM
const user = document.querySelector(".user");
const greeting = document.querySelector(".greeting");
// const hours = document.querySelector(".hoursSinceRelease");
const scrollUp = document.querySelector(".scrollUp");
const userLoadSpinner = document.querySelector("#userLoadSpinner");

// Getting a random number for later use
let randNum = Math.ceil(Math.random() * 10);

// Listen for authentication status changes
auth.onAuthStateChanged((userChange) => {
	if (auth.currentUser) {
		let userName = auth.currentUser.displayName;

		userLoadSpinner.classList.add("d-none");
		user.innerHTML = userName;

		// Getting the hours for later use
		const now = new Date().getHours();

		// Random greetings
		if (randNum == 1) {
			greeting.innerHTML = `Welcome back, ${userName}!`;
		} else if (randNum == 2) {
			greeting.innerHTML = `Hello, ${userName}!`;
		} else if (randNum == 3) {
			greeting.innerHTML = `Let's start searching, ${userName}!`;
		} else if (randNum == 4) {
			greeting.innerHTML = `What should we do, ${userName}?`;
		} else if (randNum == 5 || randNum == 6) {
			if (now >= 0 && now < 12) {
				greeting.innerHTML = `Good morning, ${userName}!`;
			} else if (now >= 12 && now < 17) {
				greeting.innerHTML = `Good afternoon, ${userName}!`;
			} else {
				greeting.innerHTML = `Good evening, ${userName}!`;
			}
		} else if (randNum == 7) {
			greeting.innerHTML = `Glad to see you again, ${userName}!`;
		} else if (randNum == 8) {
			greeting.innerHTML = `What to do, ${userName}?`;
		} else if (randNum == 9) {
			greeting.innerHTML = `Welcome, ${userName}!`;
		} else {
			greeting.innerHTML = `Hi, ${userName}!`;
		}
	} else {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = "User";
	}

	console.log(auth.currentUser);
});

// Time since
// TODO Get a better formula
// let updateTime = new Date("August 6, 2021 17:00:00").getHours();
// let now = new Date().getHours();
// hours.innerHTML = `${24 - updateTime + now} hours ago`;

// Making the window scroll to the top when button clicked
scrollUp.addEventListener("click", () => {
	window.scroll({
		top: 0,
		left: 0,
		behavior: "smooth",
	});
});
