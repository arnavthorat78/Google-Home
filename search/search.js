// Getting the command section
const google = document.querySelector(".google");
const voice = document.querySelector(".voice");
const response = document.querySelector(".response");
const output = document.querySelector(".output");

// Getting special command response sections
const music = document.querySelector("#music");
const smallButton = document.querySelector(".smallButton");
const time = document.querySelector(".time");
const collage = document.querySelector("#collageContainer");

const user = document.querySelector(".user");
const userLoadSpinner = document.querySelector("#userLoadSpinner");

let searchEngine = "";

// Listen for authentication status changes
auth.onAuthStateChanged((userChange) => {
	if (auth.currentUser) {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = auth.currentUser.displayName;

		db.collection("users")
			.doc(userChange.uid)
			.onSnapshot(
				(snapshot) => {
					console.log(snapshot.data().settings.general.searchEngine);

					searchEngine = snapshot.data().settings.general.searchEngine;
				},
				(err) => {
					console.log(err.message);
				}
			);
	} else {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = "User";

		searchEngine = "Google";
	}

	console.log(auth.currentUser);
});

let smartCommands = [
	["hello", "hi"],
	["how are you", "hows everything"],
	["music", "audio"],
	["time", "clock"],
	["picture", "photo", "collage"],
	["name", "me", "my"],
];

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var grammar = `#JSGF V1.0; grammar smartCommands; public <smartCommand> = ${smartCommands.join(
	" | "
)};`;

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Leave the remove button hidden as default
smallButton.style.visibility = "hidden";

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

	if (command.includes(smartCommands[0][0]) || command.includes(smartCommands[0][1])) {
		// If the command includes 'hello'
		res("Hello!", 5000);
	} else if (command.includes(smartCommands[1][0]) || command.includes(smartCommands[1][1])) {
		// If the user asks how the computer is
		res("I'm great! How are you?", 5000);
	} else if (command.includes(smartCommands[2][0]) || command.includes(smartCommands[2][1])) {
		// If the user requested audio/music
		res("The music is below.", 5000);

		const removeMusic = () => {
			music.className = "d-none";
			smallButton.style.visibility = "hidden";
			smallButton.innerHTML = "";

			smallButton.removeEventListener("click", removeMusic);
		};

		music.className = "d-block";
		smallButton.innerHTML = "Remove Music";
		smallButton.style.visibility = "visible";

		smallButton.addEventListener("click", removeMusic);
	} else if (command.includes(smartCommands[3][0]) || command.includes(smartCommands[3][1])) {
		// If the user requested the live time
		res("The time will be displayed below.", 5000);

		const formatAMPM = (date) => {
			let hours = date.getHours();
			let minutes = date.getMinutes();
			let seconds = date.getSeconds();
			let ampm = hours >= 12 ? "PM" : "AM";
			hours = hours % 12;
			hours = hours ? hours : 12;
			minutes = minutes < 10 ? "0" + minutes : minutes;
			let strTime = `${hours} : ${minutes} : ${seconds} ${ampm}`;
			return strTime;
		};

		const tick = () => {
			const now = new Date();

			time.innerHTML = formatAMPM(now);
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
		command.includes(smartCommands[4][0]) ||
		command.includes(smartCommands[4][1]) ||
		command.includes(smartCommands[4][2])
	) {
		// If the user requested the collage
		res("The collage is below!", 5000);

		const removeCollage = () => {
			collage.className = "d-none";
			smallButton.style.visibility = "hidden";
			smallButton.innerHTML = "";

			smallButton.removeEventListener("click", removeCollage);
		};

		collage.className = "d-block";
		smallButton.innerHTML = "Remove Collage";
		smallButton.style.visibility = "visible";

		smallButton.addEventListener("click", removeCollage);
	} else if (
		command.includes(smartCommands[5][0]) ||
		command.includes(smartCommands[5][1]) ||
		command.includes(smartCommands[5][2])
	) {
		if (fullNameRaw == null) {
			res(
				"<strong>Sorry, but we cannot retrieve your name since you have not signed in with an account. <a class='text-decoration-none' herf='../signUp.html'>Sign up!</a></strong>",
				10000
			);
		} else {
			const userName = fullNameRaw.split(",");
			let fullName = `${userName[0]} ${userName[1]}`;

			res(`Your name is <strong>${fullName}</strong>!`, 5000);
		}
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

google.addEventListener("submit", (e) => {
	// Preventing the default action (reloading the page)
	e.preventDefault();

	// Getting the command and parameters
	let userCommand = google.command.value;
	let parameters = google.params.value;

	if (parameters == "Search") {
		// If the user wants to search for something
		if (searchEngine == "Bing") {
			open(`https://www.bing.com/search?q=${encodeURIComponent(userCommand)}`, "_blank");
		} else if (searchEngine == "DuckDuckGo") {
			open(`https://duckduckgo.com/?q=${encodeURIComponent(userCommand)}`, "_blank");
		} else {
			open(`https://www.google.com/search?q=${encodeURIComponent(userCommand)}`, "_blank");
		}

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

voice.addEventListener("submit", (e) => {
	e.preventDefault();

	let parameters = voice.params.value;

	if (parameters == "Search") {
		recognition.start();
		output.innerHTML = "Start saying your command!";

		recognition.onresult = (event) => {
			var command = event.results[0][0].transcript;
			output.innerHTML = `Result received: ${command}.`;

			if (searchEngine == "Bing") {
				open(`https://www.bing.com/search?q=${encodeURIComponent(userCommand)}`, "_blank");
			} else if (searchEngine == "DuckDuckGo") {
				open(`https://duckduckgo.com/?q=${encodeURIComponent(userCommand)}`, "_blank");
			} else {
				open(
					`https://www.google.com/search?q=${encodeURIComponent(userCommand)}`,
					"_blank"
				);
			}

			response.innerHTML = `Opened <i>${command}</i>.`;
			setTimeout(() => {
				response.innerHTML = "";
			}, 5000);

			console.log("Confidence: " + event.results[0][0].confidence);
		};

		recognition.onspeechend = () => {
			recognition.stop();
		};

		recognition.onnomatch = (event) => {
			output.innerHTML = "I didn't recognize that command.";
		};

		recognition.onerror = (event) => {
			output.innerHTML = "Error occurred in recognition: " + event.error;
		};
	} else if (parameters == "Smart") {
		recognition.start();
		output.innerHTML = "Start saying your command!";

		recognition.onresult = (event) => {
			var command = event.results[0][0].transcript;
			output.innerHTML = `Result received: ${command}.`;

			smartReact(command);

			console.log("Confidence: " + event.results[0][0].confidence);
		};

		recognition.onspeechend = () => {
			recognition.stop();
		};

		recognition.onnomatch = (event) => {
			output.innerHTML = "I didn't recognize that command.";
		};

		recognition.onerror = (event) => {
			output.innerHTML = "Error occurred in recognition: " + event.error;
		};
	}
});
