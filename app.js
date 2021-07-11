const toggleSteps = document.querySelector(".toggleSteps");
const steps = document.querySelector(".steps");

const google = document.querySelector(".google");
const response = document.querySelector(".response");
const smartNote = document.querySelector(".smartNote");

steps.style.visibility = "hidden";
const toggleRedirectInstructions = () => {
	if (steps.style.visibility == "hidden") {
		steps.style.visibility = "visible";
	} else {
		steps.style.visibility = "hidden";
	}
};

const res = (text, ms) => {
	response.innerHTML = text;
	setTimeout(() => {
		response.innerHTML = "";
	}, ms);
};

const smartReact = (command) => {
	command = command
		.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "")
		.replace(/\s{2,}/g, " ")
		.trim()
		.toLowerCase();

	let randNum = Math.random();
	let number;
	if (randNum <= 0.5) {
		number = 0;
	} else {
		number = 1;
	}

	if (command == "hello" || "hi") {
		if (number == 0) {
			res("Hello!", 5000);
		} else {
			res("How you doing?", 5000);
		}
	}
};

toggleSteps.addEventListener("click", toggleRedirectInstructions);

google.addEventListener("submit", (e) => {
	e.preventDefault();

	let userCommand = google.command.value.trim();
	let parameters = google.params.value;

	if (parameters == "Search") {
		open(`https://www.google.com/search?q=${encodeURIComponent(userCommand)}`, "_blank");

		response.innerHTML = `Opened <i>${userCommand}</i>.`;
		setTimeout(() => {
			response.innerHTML = "";
		}, 5000);
	} else if (parameters == "URL") {
		open(userCommand, "_blank");

		response.innerHTML = `Opened <i>${userCommand}</i>.`;
		setTimeout(() => {
			response.innerHTML = "";
		}, 5000);
	} else if (parameters == "Smart") {
		smartNote.innerHTML =
			"Please note that the backslash character (\\) may interfere with the response of the computer.";
		smartReact(userCommand);

		setTimeout(() => {
			smartNote.innerHTML = "";
		}, 2500);
	}
});
