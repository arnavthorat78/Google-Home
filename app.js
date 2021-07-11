const toggleSteps = document.querySelector(".toggleSteps");
const steps = document.querySelector(".steps");

const google = document.querySelector(".google");
const response = document.querySelector(".response");

steps.style.visibility = "hidden";
const toggleRedirectInstructions = () => {
	if (steps.style.visibility == "hidden") {
		steps.style.visibility = "visible";
	} else {
		steps.style.visibility = "hidden";
	}
};

toggleSteps.addEventListener("click", toggleRedirectInstructions);

google.addEventListener("submit", (e) => {
	e.preventDefault();

	let userCommand = google.command.value;
	let parameters = google.params.value;

	if (parameters == "Search") {
		open(
			`https://www.google.com/search?q=${encodeURIComponent(
				userCommand
			)}&oq=Google&aqs=chrome..69i57j35i39l2j69i60l5.1335j0j1&sourceid=chrome&ie=UTF-8`,
			"_blank"
		);

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
	} else if (userCommand.toLowerCase() == "hello") {
		response.innerHTML = "Hello!";
		setTimeout(() => {
			response.innerHTML = "";
		}, 5000);
	}
});
