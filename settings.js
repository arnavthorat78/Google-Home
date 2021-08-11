const general = document.querySelector(".generalSettings");
const generalSubmit = document.querySelector("#generalSubmit");
const generalRes = document.querySelector(".generalRes");

const user = document.querySelector(".user");
const userLoadSpinner = document.querySelector("#userLoadSpinner");

let globalUser = {};

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

		generalSubmit.disabled = false;
	} else {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = "User";

		generalSubmit.disabled = true;
	}

	console.log(auth.currentUser);
});

general.addEventListener("submit", (e) => {
	e.preventDefault();

	generalRes.innerHTML = spinner("Applying settings...");

	const greeting = general.greeting.checked;

	let rawNewSettings = {
		greeting: greeting,
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
					.set({ settings: { general: newSettings } } /*, { merge: true }*/)
					.then(() => {
						console.log(settingDoc.data().settings.general);

						generalRes.innerHTML = "Settings successfully saved!";
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.then(() => {
				generalRes.innerHTML = spinner("Final changes...");
			})
			.catch((error) => {
				generalRes.innerHTML =
					"Sorry, but an unknown error occured while changing the settings. Please try again later.";
				console.log(error);
			});
	});
});
