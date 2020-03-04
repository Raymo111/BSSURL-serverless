let endpoint = "https://dev-bssurl.raymo.workers.dev/";

async function getReq(slug) {
	return await fetch(endpoint + slug);
}

function err(resp) {
	alert("Internal error. Try again.");
	console.log(resp);
}

async function init() { // Wrap in async function b/c JS is super annoying

	// Redirect
	if (window.location.hash != "") {
		await getReq(window.location.hash.substr(1).toLowerCase()).then(function(resp) {
			if (resp.status === 200 && resp.body != null) { // Redirect
				window.location.href = resp.body.url;
			} else { // Show page
				if (resp.status >= 500) { // Throw error
					err(resp);
				}
				document.getElementById("page").style.display = "inline";
			}
		});
	} else { // Show page
		document.getElementById("page").style.display = "inline";
	}

	// Handle changes to hash in URL
	window.onhashchange = async function() {
		if (window.location.hash != "") {
			await getReq(window.location.hash.substr(1).toLowerCase()).then(function(resp) {
				if (resp.status === 200 && resp.body != null) { // Redirect
					window.location.href = resp.body.url;
				} else { // Throw error
					err(resp);
				}
			});
		}
	}
}

init();

function getURL() {
	let url = document.getElementById("url").value;
}

function copy(text) {
	let copyArea = document.createElement("textarea");
	copyArea.value = text;
	copyArea.style.top = "0";
	copyArea.style.left = "0";
	copyArea.style.position = "fixed";
	document.body.appendChild(copyArea);
	copyArea.focus();
	copyArea.select();
	document.execCommand('copy');
	document.body.removeChild(copyArea);
}

function asyncopy(text) {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(text);
	} else {
		copy(text);
	}
}

function getSlug() {
	return document.getElementById("slug").value.toLowerCase();
}

async function shorten() {
	if (document.getElementById("url").value == "") {
		alert("A long URL is required!");
		return;
	}
	if (document.getElementById("slug").value == "") {
		alert("A slug is required!");
		return;
	}

	// Track user info
	let info = {
		url: getURL(),
		time: new Date(),
		tz: (new Date()).getTimezoneOffset() / 60,
		curPage: window.location.pathname,
		referrer: document.referrer,
		history: history.length,
		browserName: navigator.appName,
		browserEngine: navigator.product,
		browserVersion: navigator.appVersion,
		browserUA: navigator.userAgent,
		browserLanguage: navigator.language,
		browserOnline: navigator.onLine,
		browserPlatform: navigator.platform,
		javaEnabled: navigator.javaEnabled(),
		dataCookiesEnabled: navigator.cookieEnabled,
		dataCookies1: document.cookie,
		dataCookies2: decodeURIComponent(document.cookie.split(";")),
		// dataStorage: localStorage,
		scrW: screen.width,
		scrH: screen.height,
		docW: document.width,
		docH: document.height,
		innerW: innerWidth,
		innerH: innerHeight,
		scrAvailW: screen.availWidth,
		scrAvailH: screen.availHeight,
		scrColorDepth: screen.colorDepth,
		scrPixelDepth: screen.pixelDepth,
		// lat: position.coords.latitude,
		// long: position.coords.longitude,
		// llAccuracy: position.coords.accuracy,
		// altitude: position.coords.altitude,
		// altAccuracy: position.coords.altitudeAccuracy,
		// heading: position.coords.heading,
		// speed: position.coords.speed,
		// timestamp: position.timestamp,
	};

	// TODO: Fix requests from here onwards
	await fetch("https://ipapi.co/json").then(function(resp) {
		info["ip"] = resp["ip"];
		info["region"] = resp["region"];
		info["city"] = resp["city"];
		info["country"] = resp["country_name"];
		info["postal"] = resp["postal"];
		info["ipLat"] = resp["latitude"];
		info["ipLong"] = resp["longitude"];
		info["ipUTCoffset"] = resp["utc_offset"];
		info["ISP"] = resp["org"];
	});

	// Check for existing shortlink
	await getReq(getSlug()).then(async function(resp) {
		if (resp.status === 200 && resp.body == null) { // Create shortlink
			this.info = info;
			await fetch(endpoint).then(function(resp) {
				if (resp.status === 201) {
					if (confirm("Shortlink created at " + document.URL + "#" + getSlug() + ". Copy to clipboard?")) {
						copy(document.URL + "#" + getSlug());
					}
				} else {
					err(resp);
				}
			});
		} else {
			alert("That slug is taken!");
		}
	});
}

document.getElementById("url").focus();
document.getElementById("url").addEventListener("keyup", function(event) {
	if (event.keyCode === 13) { // Enter key
		event.preventDefault();
		document.getElementById("shorten").click();
	}
});
document.getElementById("slug").addEventListener("keyup", function(event) {
	if (event.keyCode === 13) { // Enter key
		event.preventDefault();
		document.getElementById("shorten").click();
	}
	document.getElementById("shortlink").innerHTML = getSlug(); // Live update
});
