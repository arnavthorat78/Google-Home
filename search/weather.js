const weatherLocation = document.querySelector(".weatherLocation");
const weather = document.querySelector(".weather");
const response = document.querySelector(".response");
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

// Change API key here if nessecary
const api = "4d7ad498d3a58ade256b6890f5400bc5";
const spinner = `
	<div class="spinner-grow spinner-grow-sm" role="status">
		<span class="visually-hidden">Loading...</span>
	</div>
	<span>Processing request...</span>
`;

weatherLocation.addEventListener("submit", (e) => {
	e.preventDefault();

	weather.innerHTML = spinner;

	const city = weatherLocation.city.value;
	const stateCode = weatherLocation.state.value;
	const countryCode = weatherLocation.country.value;

	let extraDetails = false;

	if ((!stateCode && countryCode) || (!countryCode && stateCode)) {
		html = `
			<div class="card shadow mb-5" style="width: 100%;">
				<div class="card-body">
					<h2 class="card-title text-secondary">
						Error!
					</h2>
					<p class="lead card-subtitle">Internal Error!</p>
					<p class="card-text">
						Sorry, but an error occured while processing the request: <strong>one code parameter provided, but other not provided</strong>.
					</p>
				</div>
				<div class="card-footer text-muted" style="font-size: 0.75rem">
					Data retrieved from <strong><a class="text-decoration-none text-muted" herf="https://openweathermap.org" target="_blank">OpenWeatherMap</a></strong>.
				</div>
			</div>
		`;

		weather.innerHTML = html;

		return;
	} else if (stateCode && countryCode) {
		extraDetails = true;
	}

	fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
			`${city},${extraDetails ? `${stateCode},${countryCode}` : ""}`
		)}&appid=${api}&units=metric`
	)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);

			let html = "";

			if (data.message) {
				html = `
					<div class="card shadow mb-5" style="width: 100%;">
						<div class="card-body">
							<h2 class="card-title text-secondary">
								Error!
							</h2>
							<p class="lead card-subtitle">${data.cod} Error!</p>
							<p class="card-text">
								Sorry, but an error occured while processing the request: <strong>${data.message}</strong>.
							</p>
						</div>
						<div class="card-footer text-muted" style="font-size: 0.75rem">
							Data retrieved from <strong><a class="text-decoration-none text-muted" herf="https://openweathermap.org" target="_blank">OpenWeatherMap</a></strong>.
						</div>
					</div>
				`;

				weather.innerHTML = html;

				return;
			}

			html = `
				<div class="card shadow mb-5" style="width: 100%;">
					<div class="card-img-top display-3 pt-3">
						<img class="${
							data.weather[0].icon.includes("d") ? "day" : "night"
						}" src="http://openweathermap.org/img/wn/${
				data.weather[0].icon
			}@2x.png" alt="Weather Icon" draggable="false" />
					</div>
					<div class="card-body">
						<h2 class="card-title text-secondary">
							${data.weather[0].main || "Weather title unavailable"}
						</h2>
						<p class="lead card-subtitle" style="font-size: 2rem;">${
							data.main.temp || "Temperature unavailable"
						}${data.main.temp ? "°C" : ""}</p>
						<p class="card-text">
							In <strong>${data.name || "<i>city name unavailable</i>"}</strong> (${
				data.sys.country || "<i>country code unavailable</i>"
			}), the weather includes <strong>${
				data.weather[0].description || "<i>weather description unavailable</i>"
			}</strong>.
						</p>

						<button
							class="btn btn-primary"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#collapseExample"
							aria-expanded="false"
							aria-controls="collapseExample"
						>
							More Information <i class="bi bi-caret-down-fill"></i>
						</button>
						<div class="m-3 collapse" id="collapseExample">
							<ul class="list-group list-group-flush">
								<li class="list-group-item">Feels like: <strong>${data.main.feels_like || "RealFeel unavailable"}${
				data.main.feels_like ? "°C" : ""
			}</strong></li>
								<li class="list-group-item">Daily temperature: <span class="text-danger fw-bold">${
									data.main.temp_max || "Unavailable"
								}°C</span> / <span class="text-primary fw-bold">${
				data.main.temp_min || "Unavailable"
			}°C</span></li>
								<li class="list-group-item">
									Wind: <strong class="text-secondary">${
										data.wind.speed
											? (data.wind.speed * 3.6).toFixed(2)
											: "Unavailable"
									} ${data.wind.speed ? "km/h" : ""}</strong>
									<br />
									Gusts: <strong class="text-secondary">${
										data.wind.gust
											? (data.wind.gust * 3.6).toFixed(2)
											: "Unavailable"
									} ${data.wind.gust ? "km/h" : ""}</strong>
								</li>
								<li class="list-group-item">Cloud cover: <strong>${data.clouds.all || "Unavailable"}${
				data.clouds.all ? "%" : ""
			}</strong></li>
								<li class="list-group-item">Humidity: <strong>${data.main.humidity || "Unavailable"}${
				data.main.humidity ? "%" : ""
			}</strong></li>
								<li class="list-group-item">Atmospheric pressure: <strong>${data.main.pressure || "Unavailable"} ${
				data.clouds.all ? "hPa" : ""
			}</strong></li>
							</ul>
						</div>
					</div>
					<div class="card-footer text-muted" style="font-size: 0.75rem">
						Data retrieved from <strong><a class="text-decoration-none text-muted" herf="https://openweathermap.org" target="_blank">OpenWeatherMap</a></strong>.
					  </div>
				</div>
			`;

			weather.innerHTML = html;

			response.innerHTML = "Not your city? Try searching with state and country codes.";
		})
		.catch((err) => {
			console.log(err);
		});
});
