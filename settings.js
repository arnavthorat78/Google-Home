const general = document.querySelector(".generalSettings");
const generalSubmit = document.querySelector("#generalSubmit");
const generalRes = document.querySelector(".generalRes");
const generalProgress = document.querySelector(".generalProgress");

const weather = document.querySelector(".weatherSettings");
const weatherSubmit = document.querySelector("#weatherSubmit");
const weatherRes = document.querySelector(".weatherRes");
const weatherProgress = document.querySelector(".weatherProgress");

const user = document.querySelector(".user");
const userLoadSpinner = document.querySelector("#userLoadSpinner");

let globalUser = {};
generalProgress.classList.add("d-none");

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

					weather.tempUnits.value = snapshot.data().settings.weather.units;
					weatherSubmit.disabled = false;
				},
				(err) => {
					console.log(err.message);
				}
			);
	} else {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = "User";

		generalSubmit.disabled = true;
		weatherSubmit.disabled = true;
	}

	console.log(auth.currentUser);
});

general.addEventListener("submit", (e) => {
	e.preventDefault();

	generalProgress.classList.remove("d-none");
	generalProgress.children[0].classList.remove("bg-success");
	generalProgress.children[0].classList.add("bg-danger");
	generalProgress.children[0].style.width = "25%";
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

						generalProgress.children[0].style.width = "75%";
						generalProgress.children[0].classList.remove("bg-danger");
						generalProgress.children[0].classList.add("bg-warning");
						generalRes.innerHTML = spinner("Changing local information...");
						setTimeout(() => {
							generalProgress.children[0].classList.remove("bg-warning");
							generalProgress.children[0].classList.add("bg-success");
							generalProgress.children[0].style.width = "100%";

							generalRes.innerHTML = "Settings successfully saved!";

							setTimeout(() => {
								generalProgress.classList.add("d-none");
								generalRes.innerHTML = "";
							}, 5000);
						}, 2500);
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.then(() => {
				generalRes.innerHTML = spinner("Setting global changes...");
				generalProgress.children[0].style.width = "50%";
				generalProgress.children[0].classList.add("bg-danger");
			})
			.catch((error) => {
				generalRes.innerHTML =
					"Sorry, but an unknown error occured while changing the settings. Please try again later.";
				console.log(error);
			});
	});
});

weather.addEventListener("submit", (e) => {
	e.preventDefault();

	weatherProgress.classList.remove("d-none");
	weatherProgress.children[0].classList.remove("bg-success");
	weatherProgress.children[0].classList.add("bg-danger");
	weatherProgress.children[0].style.width = "25%";
	weatherRes.innerHTML = spinner("Viewing settings...");

	const units = weather.tempUnits.value;

	let rawNewSettings = {
		units: units,
	};
	let settingDocRef = db.collection("users").doc(globalUser.uid);

	return db.runTransaction((transaction) => {
		return transaction
			.get(settingDocRef)
			.then((settingDoc) => {
				if (!settingDoc.exists) {
					throw "Document does not exist!";
				}

				let newSettings = (settingDoc.data().settings.weather = rawNewSettings);
				settingDocRef
					.set({ settings: { weather: newSettings } }, { merge: true })
					.then(() => {
						console.log(settingDoc.data().settings.weather);

						weatherProgress.children[0].style.width = "75%";
						weatherProgress.children[0].classList.remove("bg-danger");
						weatherProgress.children[0].classList.add("bg-warning");
						weatherRes.innerHTML = spinner("Changing local information...");
						setTimeout(() => {
							weatherProgress.children[0].classList.remove("bg-warning");
							weatherProgress.children[0].classList.add("bg-success");
							weatherProgress.children[0].style.width = "100%";

							weatherRes.innerHTML = "Settings successfully saved!";

							setTimeout(() => {
								weatherProgress.classList.add("d-none");
								weatherRes.innerHTML = "";
							}, 5000);
						}, 2500);
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.then(() => {
				weatherRes.innerHTML = spinner("Setting global changes...");
				weatherProgress.children[0].style.width = "50%";
				weatherProgress.children[0].classList.add("bg-danger");
			})
			.catch((error) => {
				weatherRes.innerHTML =
					"Sorry, but an unknown error occured while changing the settings. Please try again later.";
				console.log(error);
			});
	});
});
