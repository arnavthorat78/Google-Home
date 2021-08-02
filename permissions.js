const url = document.querySelector(".website");

const user = document.querySelector(".user");

let fullNameRaw = localStorage.getItem("user");
if (fullNameRaw == null) {
	user.innerHTML = "User";
} else {
	const splitFullName = fullNameRaw.split(",");
	let fullName = `${splitFullName[0]} ${splitFullName[1]}`;
	user.innerHTML = fullName;
}

url.innerHTML = document.URL.replace("permissions.html", "search.html");
