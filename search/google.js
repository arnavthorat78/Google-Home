const user = document.querySelector(".user");
const userLoadSpinner = document.querySelector("#userLoadSpinner");

// Listen for authentication status changes
auth.onAuthStateChanged((userChange) => {
	if (auth.currentUser) {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = auth.currentUser.displayName;
	} else {
		userLoadSpinner.classList.add("d-none");
		user.innerHTML = "User";
	}

	console.log(auth.currentUser);
});
