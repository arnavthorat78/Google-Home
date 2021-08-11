const general = document.querySelector(".generalSettings");
const generalSubmit = document.querySelector("#generalSubmit");
const generalRes = document.querySelector(".generalRes");

const user = document.querySelector(".user");
const userLoadSpinner = document.querySelector("#userLoadSpinner");

let globalUser = {};

/**
 * Get a Bootstrap grow spinner with your custom message.
 *
 * @param {string} mes The message to display on the spinner.
 * @returns The spinner with the message
 */
const spinner = (mes) => {
	return `
        <div class="spinner-grow spinner-grow-sm" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <span>${mes}</span>
    `;
};

// Listen for authentication status changes
auth.onAuthStateChanged((userChange) => {
	if (auth.currentUser) {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = auth.currentUser.displayName;

		globalUser = userChange;

		db.collection("users")
			.doc(userChange.uid)
			.onSnapshot(
				(snapshot) => {
					// console.log(snapshot.data().settings.general.greeting);

					general.greeting.checked = snapshot.data().settings.general.greeting;
					general.searchEngine.value = snapshot.data().settings.general.searchEngine;
					generalSubmit.disabled = false;
				},
				(err) => {
					console.log(err.message);
				}
			);
	} else {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = "User";

		generalSubmit.disabled = true;
	}

	console.log(auth.currentUser);
});

general.addEventListener("submit", (e) => {
	e.preventDefault();

	generalRes.innerHTML = spinner("Viewing settings...");

	const greeting = general.greeting.checked;
	const searchEngine = general.searchEngine.value;

	let rawNewSettings = {
		greeting: greeting,
		searchEngine: searchEngine,
	};
	let settingDocRef = db.collection("users").doc(globalUser.uid);

	return db.runTransaction((transaction) => {
		return transaction
			.get(settingDocRef)
			.then((settingDoc) => {
				if (!settingDoc.exists) {
					throw "Document does not exist!";
				}

				let newSettings = (settingDoc.data().settings.general = rawNewSettings);
				settingDocRef
					.set({ settings: { general: newSettings } }, { merge: true })
					.then(() => {
						console.log(settingDoc.data().settings.general);

						generalRes.innerHTML = "Settings successfully saved!";
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.then(() => {
				generalRes.innerHTML = spinner("Setting global changes...");
			})
			.catch((error) => {
				generalRes.innerHTML =
					"Sorry, but an unknown error occured while changing the settings. Please try again later.";
				console.log(error);
			});
	});
});
