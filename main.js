// Getting the offline <div> element
const offline = document.querySelector(".offline");

// Getting the steps' DOM elements
const toggleSteps = document.querySelector(".toggleSteps");
const steps = document.querySelector(".steps");

// Getting the command section
const google = document.querySelector(".google");
const response = document.querySelector(".response");

// Getting special command response sections
const music = document.querySelector(".music");
const smallButton = document.querySelector(".smallButton");
const time = document.querySelector(".time");
const collage = document.querySelector(".collageContainer");

// HTML instructions page (leave closed if possible!)
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

    <strong>This website does not support Internet Explorer.</strong><br />
`;

// Offline text (if the user is offline)
const offlineHTML = `
	<div class="offlineCSS">
		<img src="./img/Wi-Fi.png" alt="Wi-Fi" draggable="false" />
		<h4>You are offline!</h4>
		<p>Some features of this website may not work as desired.</p>
	</div>
`;

// If the user is offline, display the error
window.addEventListener("offline", (e) => {
	offline.innerHTML = offlineHTML;
});

// If the user is back online, hide the error
window.addEventListener("online", (e) => {
	offline.innerHTML = "";
});

// Leave the remove music button hidden as default
smallButton.style.visibility = "hidden";

// Setting the instructions displayed default as hidden (false)
let instructionsDisplayed = false;

/**
 * Toggles the redirect instructions.
 *
 * This is to be used for the onclick, taking in no parameters. However, it must have the instructions variable available.
 */
const toggleRedirectInstructions = () => {
	if (!instructionsDisplayed) {
		// If the instructions aren't displayed...
		instructionsDisplayed = true;
		steps.innerHTML = instructions;
		// Scroll to the bottom (instructions)
		window.scroll({
			top: innerHeight,
			left: 0,
			behavior: "smooth",
		});
	} else {
		// If the instructions are displayed...
		instructionsDisplayed = false;
		steps.innerHTML = "";
	}
};

/**
 * This method is to be used for responding to search queries, URL commands, and also smart commands.
 * This method must have the response variable available, which is the DOM element for placing the text for the user to read.
 *
 * @param {string} text The text to display
 * @param {number} ms The number of milliseconds to wait for until the text disappears
 */
const res = (text, ms) => {
	response.innerHTML = text;
	setTimeout(() => {
		response.innerHTML = "";
	}, ms);
};

/**
 * The brower's reaction to a user's command. This can react to simple greetings, music, time, and also, if the command is not identified, will throw a simple readable error to the user.
 *
 * Uses RegExp to validify the string. It uses the following methods to make the command as broad as possible. `replace()` (2 times), `trim()`, and `toLowerCase()`.
 * It also uses `includes()` in the conditions for the most broad usage possible.
 *
 * @param {string} command The user's command
 */
const smartReact = (command) => {
	// Removing punctuation, extra spaces, trimming the string, and making the string lowercase
	command = command
		.replace(/[!"#$%&'()*+,-.\\/:;<=>?@[\]^_`{|}~]/g, "")
		.replace(/\s{2,}/g, " ")
		.trim()
		.toLowerCase();

	if (command.includes("hello") || command.includes("hi")) {
		// If the command includes 'hello'
		res("Hello!", 5000);
	} else if (command.includes("how are you") || command.includes("hows everything")) {
		// If the user asks how the computer is
		res("I'm great! How are you?", 5000);
	} else if (command.includes("music") || command.includes("audio")) {
		// If the user requested audio/music
		res("The music is below.", 5000);
		const audioHTML = `<audio controls>\n<source src="./music/Over-the-Horizon.mp3" type="audio/mpeg" />\nSorry, but your browser does not support audio.\n</audio>`;

		const removeMusic = () => {
			music.innerHTML = "";
			smallButton.style.visibility = "hidden";
			smallButton.innerHTML = "";

			smallButton.removeEventListener("click", removeMusic);
		};

		music.innerHTML = audioHTML;
		smallButton.innerHTML = "Remove Music";
		smallButton.style.visibility = "visible";

		smallButton.addEventListener("click", removeMusic);
	} else if (command.includes("time") || command.includes("clock")) {
		// If the user requested the live time
		res("The time will be displayed below.", 5000);

		const tick = () => {
			const now = new Date();

			time.innerHTML = `${dateFns.format(now, "h")} : ${dateFns.format(
				now,
				"mm"
			)} : ${dateFns.format(now, "ss")} ${dateFns.format(now, "A")}`;
		};

		const interval = setInterval(tick, 1000);

		const removeTime = () => {
			clearInterval(interval);
			time.innerHTML = "";
			smallButton.style.visibility = "hidden";
			smallButton.innerHTML = "";

			smallButton.removeEventListener("click", removeTime);
		};

		smallButton.innerHTML = "Remove Time";
		smallButton.style.visibility = "visible";

		smallButton.addEventListener("click", removeTime);
	} else if (
		command.includes("picture") ||
		command.includes("photo") ||
		command.includes("collage")
	) {
		// If the user requested the collage
		res("The collage is below!", 5000);
		const collageHTML = `<a class="collageDownload" href="./img/Collage.png" download>\n<img class="collage" src="../img/Collage.png" alt="Collage" draggable="false" />\n</a>`;

		const removeCollage = () => {
			collage.innerHTML = "";
			smallButton.style.visibility = "hidden";
			smallButton.innerHTML = "";

			smallButton.removeEventListener("click", removeCollage);
		};

		collage.innerHTML = collageHTML;
		smallButton.innerHTML = "Remove Collage";
		smallButton.style.visibility = "visible";

		smallButton.addEventListener("click", removeCollage);
	} else if (command == "" || command == " ") {
		// If the user typed in nothing
		res("<strong>Please do not leave the command empty.</strong>", 10000);
	} else {
		// If the computer cannot find the command
		res(
			"<strong>Sorry, but this command could not be identified. Try searching it instead, or see if you have made any spelling mistakes.</strong>",
			10000
		);
	}
};

toggleSteps.addEventListener("click", toggleRedirectInstructions);

google.addEventListener("submit", (e) => {
	// Preventing the default action (reloading the page)
	e.preventDefault();

	// Getting the command and parameters
	let userCommand = google.command.value;
	let parameters = google.params.value;

	if (parameters == "Search") {
		// If the user wants to search for something
		open(`https://www.google.com/search?q=${encodeURIComponent(userCommand)}`, "_blank");

		response.innerHTML = `Opened <i>${userCommand}</i>.`;
		setTimeout(() => {
			response.innerHTML = "";
		}, 5000);
	} else if (parameters == "URL") {
		// If the user would like to view a URL
		open(userCommand, "_blank");

		response.innerHTML = `Opened <i>${userCommand}</i>.`;
		setTimeout(() => {
			response.innerHTML = "";
		}, 5000);
	} else if (parameters == "Smart") {
		// If the user would like Smart
		smartReact(userCommand);
	}
});
