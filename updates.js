const user = document.querySelector(".user");
const userLoadSpinner = document.querySelector("#userLoadSpinner");

const updates = document.querySelector("#updates");

const updateAddition = document.querySelector("#updateAddition");
const addUpdate = document.querySelector(".addUpdate");
const addButton = document.querySelector("#add");
const updateFeedback = document.querySelector(".updateFeedback");

const editUpdate = document.querySelector(".editUpdate");
const editButton = document.querySelector("#edit");
const editFeedback = document.querySelector(".editFeedback");

const unsubscribe = document.querySelector("#unsub");

let admin = false;
let unsub = null;

// Listen for authentication status changes
auth.onAuthStateChanged((userChange) => {
	if (auth.currentUser) {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = auth.currentUser.displayName;

		addButton.disabled = false;
		editButton.disabled = false;

		db.collection("users")
			.doc(userChange.uid)
			.onSnapshot(
				(snapshot) => {
					admin = snapshot.data().admin;
					console.log(admin);

					if (admin) {
						updateAddition.className = "d-block";
					} else {
						updateAddition.className = "d-none";
					}

					unsub = db
						.collection("updates")
						.orderBy("updateNum", "desc")
						.onSnapshot((snapshot) => {
							snapshot.docChanges().forEach((change) => {
								const doc = change.doc;
								// console.log(doc);

								if (change.type == "added") {
									addNewUpdate(doc.data(), doc.id);
								} else if (change.type == "removed") {
									deleteUpdate(doc.id);
								}
							});

							document.querySelector(".spinner").innerHTML = "";
						});
				},
				(err) => {
					console.log(err.message);
				}
			);
	} else {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = "User";

		addButton.disabled = true;
		editButton.disabled = true;

		updateAddition.className = "d-none";

		admin = false;
	}

	console.log(auth.currentUser);
});

// auth.onAuthStateChanged((userChange) => {
// 	if (auth.currentUser) {
// 		// userLoadSpinner.classList.add("d-none");
// 		// user.innerHTML = auth.currentUser.displayName;

// 		db.collection("users")
// 			.doc(userChange.uid)
// 			.onSnapshot(
// 				(snapshot) => {
// 					console.log(snapshot.data().settings.general.searchEngine);

// 					if (snapshot.data().admin) {
// 						console.log(snapshot.data().admin);

// 						admin = true;
// 					}
// 				},
// 				(err) => {
// 					console.log(err.message);
// 				}
// 			);
// 	} else {
// 		// userLoadSpinner.classList.add("d-none");
// 		// user.innerHTML = "User";
// 		// searchEngine = "Google";
// 	}

// 	console.log(auth.currentUser);
// });

/**
 * Get a Bootstrap grow spinner with your custom message.
 *
 * @param {string} mes The message to display on the spinner.
 * @param {boolean} size The size of the spinner. If it is true, it will be set to small, else large.
 * @returns The spinner with the message
 */
const spinner = (mes, size) => {
	return `
        <div class="spinner-grow ${size ? "spinner-grow-sm" : ""}" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <${size ? "span" : "span class='h2'"}>${mes}</${size ? "span" : "span class='h2'"}>
    `;
};

const addNewUpdate = (update, id) => {
	let html = `
		<div class="card shadow mb-5 w-100" id="${update["id"]}" data-id="${id}">
			<div class="card-img-top display-3">
				<i class="${update["updateIcon"]}"></i>
			</div>
			<div class="card-body">
				<h5 class="card-title text-${update["colour"]}">
					<i class="${update["symbol"]}"></i>
					<span>Version <span>${update["version"]}</span></span>
				</h5>
				<p class="lead card-subtitle">${update["title"]}</p>
				<p class="card-text">
					${update["description"]}
				</p>
				<a href="${update["link"]}" class="btn btn-${update["colour"]}">${update["buttonText"]}</a>
			</div>
			<div class="card-footer text-muted">
				<div class="d-none">${update["completed"]}</div>
				${update["completed"] ? "Completed" : "Expected to be completed"} at <strong>${
		update["date"]
	}</strong>.
				<br />
				<div class="btn-group" role="group">
					<button class="btn btn-success ${
						!admin ? "disabled" : ""
					} btn-sm mt-2" data-bs-toggle="modal" id="edit" data-bs-target="#staticBackdrop" title="Edit update (${
		update["id"]
	})"><i class="bi bi-pencil"></i></button>
					<button class="btn btn-danger ${
						!admin ? "disabled" : ""
					} btn-sm mt-2" id="delete" title="Delete update (${
		update["id"]
	})"><i class="bi bi-trash"></i></button>
				</div>
				<br />
				<small>Update number <strong>${update["updateNum"]}</strong>.</small>
			</div>
		</div>
	`;

	updates.innerHTML += html;
};

const deleteUpdate = (id) => {
	const updates = document.querySelectorAll(".card");

	updates.forEach((update) => {
		if (update.getAttribute("data-id") == id) {
			update.remove();
		}
	});
};

// const unsub = db
// 	.collection("updates")
// 	.orderBy("updateNum", "desc")
// 	.onSnapshot((snapshot) => {
// 		snapshot.docChanges().forEach((change) => {
// 			const doc = change.doc;
// 			// console.log(doc);

// 			if (change.type == "added") {
// 				addNewUpdate(doc.data(), doc.id);
// 			} else if (change.type == "removed") {
// 				deleteUpdate(doc.id);
// 			}
// 		});

// 		document.querySelector(".spinner").innerHTML = "";
// 	});

/**
 * Add a new update template. This is useful for adding a new template easily to the DOM, if wanted.
 *
 * The parameter `data` must be an array, which contains objects, which contain the following properties: `id`, `updateIcon`, `colour`, `symbol`, `version`, `title`, `description`, `link`, `buttonText`, `completed`, and `date`.
 * The completed value must be of type `Boolean`.
 *
 * Example:
 *
 *     const updateHTML = document.querySelector(".updates");
 *
 *     let updates = [
 *           {
 *              id: "initial",
 *              version: "1.0.0",
 *              updateIcon: "bi bi-laptop",
 *              symbol: "bi bi-clock-history",
 *              colour: "secondary",
 *              title: "Initial Website~",
 *              description: "This was the initial website when it was first launched.",
 *              link: "index.html",
 *              buttonText: "Check it out!",
 *              completed: true,
 *              date: "11/07/2021",
 *          },
 *     ];
 *
 *     addUpdateTemplate(updates, updateHTML, true, true);
 *
 *
 * @param {Array} data The array of objects, which are the updates. See the information above for how to structure it.
 * @param {Document} docRef The reference to the DOM. This must be provided.
 * @param {Boolean} reset This is an optional parameter, which specifies if you want to reset the DOM parameter so that it is empty. By default, it is set to `false`.
 * @param {Boolean} append This is an optional parameter, which specifies to append each update to the DOM. If this is `false`, then it will automatically return an array of objects with the HTML templates.
 * @returns An array with objects with the HTML templates. This value will not be returned with append is set to true.
 */
const addUpdateTemplate = (data, docRef, reset = false, append = true) => {
	let templates = [];

	if (reset) {
		docRef.innerHTML = "";
	}

	data.forEach((value) => {
		let html = "";

		try {
			html = `
                <div class="card shadow mb-5 w-100" id="${value["id"]}">
                    <div class="card-img-top display-3">
                        <i class="${value["updateIcon"]}"></i>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title text-${value["colour"]}">
                            <i class="${value["symbol"]}"></i>
                            <span>Version <span>${value["version"]}</span></span>
                        </h5>
                        <p class="lead card-subtitle">${value["title"]}</p>
                        <p class="card-text">
                            ${value["description"]}
                        </p>
                        <a href="${value["link"]}" class="btn btn-${value["colour"]}">${
				value["buttonText"]
			}</a>
                    </div>
                    <div class="card-footer text-muted">
						<div class="d-none">${value["completed"]}</div>
                        ${
							value["completed"] ? "Completed" : "Expected to be completed"
						} at <strong>${value["date"]}</strong>.
                        <br />
						<div class="btn-group" role="group">
							<button class="btn btn-success btn-sm mt-2" data-bs-toggle="modal" id="edit" data-bs-target="#staticBackdrop" title="Edit update (${
								value["id"]
							})"><i class="bi bi-pencil"></i></button>

							<button class="btn btn-danger btn-sm mt-2" id="delete" title="Delete update (${
								value["id"]
							})"><i class="bi bi-trash"></i></button>
						</div>
                    </div>
                </div>
            `;
		} catch (error) {
			console.log(error);

			if (
				!value["id"] ||
				!value["updateIcon"] ||
				!value["colour"] ||
				!value["synbol"] ||
				!value["version"] ||
				!value["title"] ||
				!value["description"] ||
				!value["link"] ||
				!value["buttonText"] ||
				!value["completed"] ||
				!value["updateNum"] ||
				!value["date"]
			) {
				throw new Error(
					`Error occured during HTML template rendering: missing or insuffient values in data parameter. Please make sure the data array is structured properly. Expected proper array with object, got ${value}.`
				);
			} else if (typeof value["completed"] != "boolean") {
				throw new Error(
					`Error occured during HTML template rendering: value 'completed' is not of type 'boolean'. Expected type 'boolean' got ${
						value["completed"]
					} with type of ${typeof value["completed"]}.`
				);
			} else {
				throw new Error(`An unknown or internal error occured.`);
			}
		}

		if (append) {
			docRef.innerHTML += html;
		} else {
			templates.unshift(html);
		}
	});

	if (!append) {
		return templates;
	}
};

// addUpdateTemplate(data, updates, true, true);

addUpdate.addEventListener("submit", (e) => {
	e.preventDefault();

	updateFeedback.innerHTML = spinner("Adding update...", true);

	const rawDate = addUpdate.date.value.split("-");
	const date = `${rawDate[2]}/${rawDate[1]}/${rawDate[0]}`;

	const updateObject = {
		id: addUpdate.updateId.value,
		version: addUpdate.version.value,
		updateIcon: addUpdate.updateIcon.value,
		symbol: addUpdate.symbol.value,
		colour: addUpdate.colour.value,
		title: addUpdate.title.value,
		description: addUpdate.description.value.trim(),
		link: addUpdate.link.value,
		buttonText: addUpdate.buttonText.value,
		completed: addUpdate.completed.value == "true" ? true : false,
		updateNum: +addUpdate.updateNum.value,
		date: date,
	};

	db.collection("updates")
		.add(updateObject)
		.then(() => {
			updateFeedback.innerHTML = `Added update '${updateObject.id}'!`;
		})
		.catch((err) => {
			console.log(err);

			updateFeedback.innerHTML =
				"An unknown error occured while adding the update. Try again later.";
		});

	// const idTest = /[a-zA-Z]$/g;
	// let idAlreadyExists = false;

	// data.forEach((value) => {
	// 	if (value["id"] == addUpdate.updateId.value) {
	// 		idAlreadyExists = true;
	// 		return;
	// 	}
	// });

	// if (!idTest.test(addUpdate.updateId.value)) {
	// 	updateFeedback.innerHTML = "Sorry, but your ID cannot contain numbers or symbols.";
	// 	return;
	// } else if (idAlreadyExists) {
	// 	updateFeedback.innerHTML =
	// 		"Sorry, but an update with this ID already exists. Please choose a unique ID.";
	// 	return;
	// }
});

editUpdate.addEventListener("submit", (e) => {
	e.preventDefault();

	editFeedback.innerHTML = spinner("Editing update...", true);

	const rawDate = editUpdate.date.value.split("-");
	const date = `${rawDate[2]}/${rawDate[1]}/${rawDate[0]}`;

	const editObject = {
		id: editUpdate.updateId.value,
		version: editUpdate.version.value,
		updateIcon: editUpdate.updateIcon.value,
		symbol: editUpdate.symbol.value,
		colour: editUpdate.colour.value,
		title: editUpdate.title.value,
		description: editUpdate.description.value.trim(),
		link: editUpdate.link.value,
		buttonText: editUpdate.buttonText.value,
		completed: editUpdate.completed.value == "true" ? true : false,
		updateNum: +editUpdate.updateNum.value,
		date: date,
	};

	db.collection("updates")
		.doc(editUpdate.firebaseId.value)
		.set(editObject)
		.then(() => {
			editFeedback.innerHTML = `Update '${editUpdate.updateId.value}' has been successfully edited!`;
		})
		.catch((err) => {
			console.log(err);

			editFeedback.innerHTML = `An unknown error occured while editing the update. Please try again later.`;
		});
});

updates.addEventListener("click", (e) => {
	if (e.target.id === "delete") {
		const id = e.path[3].getAttribute("data-id");

		if (
			confirm("Are you sure you want to delete this update? This change cannot be reversed.")
		) {
			db.collection("updates")
				.doc(id)
				.delete()
				.then(() => {
					console.log("Update deleted!");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	if (e.target.id === "edit") {
		const firebaseId = e.path[3].getAttribute("data-id");

		const id = e.path[3].id;
		const version = e.path[3].children[1].children[0].children[1].children[0].innerHTML;
		const updateIcon = e.path[3].children[0].children[0].className;
		const symbol = e.path[3].children[1].children[0].children[0].className;
		const colour = e.path[3].children[1].children[0].classList[1].split("-")[1];
		const title = e.path[3].children[1].children[1].innerHTML;
		const description = e.path[3].children[1].children[2].innerHTML.trim();
		const link = e.path[3].children[1].children[3].getAttribute("href");
		const buttonText = e.path[3].children[1].children[3].innerHTML;
		const updateNum = e.path[3].children[2].children[5].children[0].innerHTML;
		const completed = e.path[3].children[2].children[0].innerHTML;

		const rawDate = e.path[3].children[2].children[1].innerHTML.split("/");
		const date = `${rawDate[2]}-${rawDate[1]}-${rawDate[0]}`;

		editUpdate.firebaseId.value = firebaseId;
		editUpdate.updateId.value = id;
		editUpdate.version.value = version;
		editUpdate.updateIcon.value = updateIcon;
		editUpdate.symbol.value = symbol;
		editUpdate.colour.value = colour;
		editUpdate.title.value = title;
		editUpdate.description.value = description;
		editUpdate.link.value = link;
		editUpdate.buttonText.value = buttonText;
		editUpdate.completed.value = completed;
		editUpdate.updateNum.value = updateNum;
		editUpdate.date.value = date;
	}
});

unsubscribe.addEventListener("click", () => {
	unsub();
	console.log("Unsubscribed from database changes.");
});
