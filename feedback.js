// Getting the offline <div> element
const offline = document.querySelector(".offline");

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

/**
 * A function which downloads a CSV file to the users local computer.
 *
 * Thanks to JSFiddle for supplying this code!
 *
 * To use this code, call the function, then, in the filename, type in the name of the file. This file must always be prefixed with `.csv`.
 * For rows, make an array with nested arrays in it. Each nested array can contain the number of columns you want. The nested arrays act as rows.
 * You can use the rows like the following: `[ [ "name", "value" ], [ "age", "value" ] ]`.
 *
 * @param {string} filename The default filename to save the CSV file as.
 * @param {array} rows An array containing the rows of the CSV file.
 */
const exportToCSV = (filename, rows) => {
	let processRow = (row) => {
		let finalVal = "";
		for (let j = 0; j < row.length; j++) {
			let innerValue = row[j] === null ? "" : row[j].toString();
			if (row[j] instanceof Date) {
				innerValue = row[j].toLocaleString();
			}
			let result = innerValue.replace(/"/g, '""');
			if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
			if (j > 0) finalVal += ",";
			finalVal += result;
		}
		return finalVal + "\n";
	};

	let csvFile = "";
	for (let i = 0; i < rows.length; i++) {
		csvFile += processRow(rows[i]);
	}

	let blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
	if (navigator.msSaveBlob) {
		navigator.msSaveBlob(blob, filename);
	} else {
		let link = document.createElement("a");
		if (link.download !== undefined) {
			let url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", filename);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
};
