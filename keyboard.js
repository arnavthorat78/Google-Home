// const user = document.querySelector(".user");
// const userLoadSpinner = document.querySelector("#userLoadSpinner");

const closeWindow = document.querySelector("#closeWindow");

// const shortcuts = document.querySelector("#shortcuts");
// shortcuts.addEventListener("click", () => {
// 	open("./keyboard.html", "", "width=250px;height=250px");
// });

// Listen for authentication status changes
auth.onAuthStateChanged((userChange) => {
	// if (auth.currentUser) {
	// 	userLoadSpinner.classList.add("d-none");
	// 	user.innerHTML = auth.currentUser.displayName;
	// } else {
	// 	userLoadSpinner.classList.add("d-none");
	// 	user.innerHTML = "User";
	// }

	console.log(auth.currentUser);
});

closeWindow.addEventListener("click", (e) => {
	window.close();
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
	if (e.ctrlKey && e.altKey && e.key == "c") {
		window.close();
	}
};
