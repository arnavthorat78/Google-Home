// Getting references to elements in the DOM
const user = document.querySelector(".user");
const greeting = document.querySelector(".greeting");
// const hours = document.querySelector(".hoursSinceRelease");
const scrollUp = document.querySelector(".scrollUp");
const userLoadSpinner = document.querySelector("#userLoadSpinner");

const shortcuts = document.querySelector("#shortcuts");
shortcuts.addEventListener("click", () => {
	open("./keyboard.html", "", "width=250px;height=250px");
});

// Getting a random number for later use
let randNum = Math.ceil(Math.random() * 10);

// const newWindow = open("https://arnavthorat78.github.io/Google-Home/", "", "width=250px;height=250px");

const randGreeting = (status) => {
	if (status == "account") {
		// Getting the hours for later use
		const now = new Date().getHours();
		let userName = auth.currentUser.displayName;

		// Random greetings
		if (randNum == 1) {
			greeting.innerHTML = `Welcome back, ${userName}!`;
		} else if (randNum == 2) {
			greeting.innerHTML = `Hello, ${userName}!`;
		} else if (randNum == 3) {
			greeting.innerHTML = `Let's start searching, ${userName}!`;
		} else if (randNum == 4) {
			greeting.innerHTML = `What should we do, ${userName}?`;
		} else if (randNum == 5 || randNum == 6 || randNum == 7) {
			if (now >= 0 && now < 12) {
				greeting.innerHTML = `Good morning, ${userName}!`;
			} else if (now >= 12 && now < 17) {
				greeting.innerHTML = `Good afternoon, ${userName}!`;
			} else {
				greeting.innerHTML = `Good evening, ${userName}!`;
			}
		} else if (randNum == 8) {
			greeting.innerHTML = `Glad to see you again, ${userName}!`;
		} else if (randNum == 9) {
			greeting.innerHTML = `What to do, ${userName}?`;
		} else {
			greeting.innerHTML = `Hi, ${userName}!`;
		}
	} else if (status == "user") {
		greeting.innerHTML = "Welcome!";
	} else {
		greeting.innerHTML = "A great website!";
	}
};

// Listen for authentication status changes
auth.onAuthStateChanged((userChange) => {
	if (auth.currentUser) {
		let userName = auth.currentUser.displayName;

		userLoadSpinner.classList.add("d-none");
		user.innerHTML = userName;

		db.collection("users")
			.doc(userChange.uid)
			.onSnapshot(
				(snapshot) => {
					console.log(snapshot.data().settings.general.greeting);

					if (snapshot.data().settings.general.greeting) {
						randGreeting("account");
					} else {
						randGreeting("");
					}
				},
				(err) => {
					console.log(err.message);
				}
			);
	} else {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = "User";

		randGreeting("user");
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
