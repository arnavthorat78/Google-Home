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
		.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
		.replace(/\s{2,}/g, " ")
		.trim()
		.toLowerCase();

	if (command == "hello") {
		res("Hello!", 5000);
	}
};

toggleSteps.addEventListener("click", toggleRedirectInstructions);

google.addEventListener("submit", (e) => {
	e.preventDefault();

	let userCommand = google.command.value.trim();
	let parameters = google.params.value;

	if (parameters == "Search") {
		open(
			`https://www.google.com/search?q=${encodeURIComponent(
				userCommand
			)}&oq=Google&aqs=chrome..69i57j35i39l2j69i60l5.1335j0j1&sourceid=chrome&ie=UTF-8`,
			"_blank"
		);

		res(`Opened <i>${userCommand}</i>.`, 5000);
	} else if (parameters == "URL") {
		open(userCommand, "_blank");

		res(`Opened <i>${userCommand}</i>.`, 5000);
	} else if (parameters == "Smart") {
		smartNote.innerHTML =
			"Please note that some characters may interfere with the response of the computer.";
		smartReact(userCommand);

		setTimeout(() => {
			smartNote.innerHTML = "";
		}, 5000);
	}
});
