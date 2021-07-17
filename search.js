// Getting the command section
const google = document.querySelector(".google");
const recentSearches = document.querySelector("#recentSearches");
const response = document.querySelector(".response");

// Getting special command response sections
const music = document.querySelector(".music");
const smallButton = document.querySelector(".smallButton");
const time = document.querySelector(".time");
const collage = document.querySelector(".collageContainer");

const user = document.querySelector(".user");

let fullNameRaw = localStorage.getItem("user");
if (fullNameRaw == null) {
	user.innerHTML = "User";
} else {
	const splitFullName = fullNameRaw.split(",");
	let fullName = `${splitFullName[0]} ${splitFullName[1]}`;
	user.innerHTML = fullName;
}

// Leave the remove button hidden as default
smallButton.style.visibility = "hidden";

let recentSearchesLocal = localStorage.getItem("userRecentSearches").split(",");

for (let i = 0; i < recentSearchesLocal.length; i++) {
	if (i > 5) {
		recentSearchesLocal = recentSearchesLocal.slice(recentSearchesLocal.length - 10, 10);
	}

	recentSearches.innerHTML += `<option value="${recentSearchesLocal[i]}">`;
}

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

google.addEventListener("submit", (e) => {
	// Preventing the default action (reloading the page)
	e.preventDefault();

	// Getting the command and parameters
	let userCommand = google.command.value;
	let parameters = google.params.value;

	let recentSearchArray = [];

	for (let i = 0; i < recentSearchesLocal.length; i++) {
		if (i > 4) {
			break;
		}

		recentSearchArray.push(recentSearchesLocal[i]);
	}

	recentSearchArray.push(userCommand);
	localStorage.setItem("userRecentSearches", recentSearchArray);
	recentSearches.innerHTML += `<option value="${userCommand}">`;

	let recentRef = db.collection("users").doc(fullNameRaw.split(",")[2]);

	db.runTransaction((transaction) => {
		return transaction.get(recentRef).then((recent) => {
			if (!recent.exists) {
				throw "Document does not exist!";
			}

			let newRecentSearch = (recent.data().recent_searches = recentSearchArray);
			transaction.update(recentRef, { recent_searches: newRecentSearch });
		});
	})
		.then(() => {
			console.log("Transaction successfully committed!");
		})
		.catch((error) => {
			console.log("Transaction failed: ", error);
		});

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