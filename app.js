const toggleSteps = document.querySelector(".toggleSteps");
const steps = document.querySelector(".steps");

const google = document.querySelector(".google");
const response = document.querySelector(".response");
const smartNote = document.querySelector(".smartNote");

const music = document.querySelector(".music");
const removeMusic = document.querySelector(".removeMusic");
const time = document.querySelector(".time");

const instructions = `
    <span> To do this, preform the following steps depending on your browser: </span>
    <br /><br />

    <strong>For Google Chrome:</strong>
    <ul>
        <span>1. Navigate to the button next to the URL (site information).</span>
        <br />
        <span>2. On the bottom, click <i>Site Settings</i>.</span>
        <br />
        <span>3. Scroll to <i>Pop-ups and redirects</i> and click <i>Allow</i>.</span>
    </ul>

    <strong>For Microsoft Edge:</strong>
    <ul>
        <span>1. Navigate to the button next to the URL (site information).</span>
        <br />
        <span>2. Click <i>Permissions for this site</i> (with a password icon on it).</span>
        <br />
        <span>3. Scroll to <i>Pop-ups and redirects</i> and click <i>Allow</i>.</span>
    </ul>

    <strong>For Firefox:</strong>
    <ul>
        <span>
            1. Navigate to the three horizontal lines (on the right side of the toolbar),
            and click <i>Settings</i>.
        </span>
        <br />
        <span>
            2. Navigate to <i>Privacy and Security</i> on the left-hand side toolbar.
        </span>
        <br />
        <span>
            3. Scroll down to <i>Permissions</i>, and next to <i>Block pop-up windows</i>,
            click <i>Exceptions...</i>.
        </span>
        <br />
        <span>
            4. Type in the URL of the website to allow (which is <u class="website">${document.URL}</u>).
            Then click <i>Allow</i>.
        </span>
    </ul>

    <strong>This website does not support Internet Explorer.</strong>
`;

removeMusic.style.visibility = "hidden";

let instructionsDisplayed = false;
const toggleRedirectInstructions = () => {
	if (!instructionsDisplayed) {
		instructionsDisplayed = true;
		steps.innerHTML = instructions;
		window.scroll({
			top: innerHeight,
			left: 0,
			behavior: "smooth",
		});
	} else {
		instructionsDisplayed = false;
		steps.innerHTML = "";
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

	if (command.includes("hello")) {
		res("Hello!", 5000);
	} else if (command.includes("music") || command.includes("audio")) {
		res("The music is below.", 5000);
		const audioHTML = `<audio controls>\n<source src="Over-the-Horizon.mp3" type="audio/mpeg" />\nSorry, but your browser does not support audio.\n</audio>`;

		music.innerHTML = audioHTML;
		removeMusic.style.visibility = "visible";

		removeMusic.addEventListener("click", () => {
			music.innerHTML = "";
			removeMusic.style.visibility = "hidden";
		});
	} else if (command.includes("time") || command.includes("clock")) {
		res("The time will be displayed below.", 5000);

		const tick = () => {
			const now = new Date();

			time.innerHTML = `${dateFns.format(now, "h")} : ${dateFns.format(
				now,
				"mm"
			)} : ${dateFns.format(now, "ss")} ${dateFns.format(now, "A")}`;
		};

		alert("To remove the time, double-click on it.");

		const interval = setInterval(tick, 1000);

		time.addEventListener("dblclick", () => {
			clearInterval(interval);
			time.innerHTML = "";
		});
	}
};

toggleSteps.addEventListener("click", toggleRedirectInstructions);

google.addEventListener("submit", (e) => {
	e.preventDefault();

	let userCommand = google.command.value;
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
