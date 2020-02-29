var endpoint = "https://www.jsonstore.io/e3c54c65c90ae3b65c584fd114d23413860cabfa5637afdd2bd27ffe5408070e";

// Redirect
if (window.location.hash != "") {
	$.getJSON(endpoint + "/" + window.location.hash.substr(1).toLowerCase(), function(data) {
		data = data["result"];
		if (data != null) { // Redirect
			window.location.href = data;
		} else { // Show page
			document.getElementById("page").style.display = "inline";
		}
	});
} else { // Show page
	document.getElementById("page").style.display = "inline";
}

// Handle changes to hash in URL
window.onhashchange = function() {
	if (window.location.hash != "") {
		$.getJSON(endpoint + "/" + window.location.hash.substr(1).toLowerCase(), function(data) {
			data = data["result"];
			if (data != null) { // Redirect
				window.location.href = data;
			}
		});
	}
}

function validateURL(url) {
	var validatorRegex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,})(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
	return validatorRegex.test(url);
}

function getURL() {
	var url = document.getElementById("url").value;
	if (validateURL(url)) {
		return url;
	} else {
		alert("Invalid long url!");
		exit();
	}
}

function copy(text) {
	var copyArea = document.createElement("textarea");
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

function shorten() {
	if (document.getElementById("url").value == "") {
		alert("A long URL is required!");
		return;
	}
	if (document.getElementById("slug").value == "") {
		alert("A slug is required!");
		return;
	}

	// Track user info
	var info = {
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
	$.getJSON("https://ipapi.co/json", function(data) {
		info["ip"] = data["ip"];
		info["region"] = data["region"];
		info["city"] = data["city"];
		info["country"] = data["country_name"];
		info["postal"] = data["postal"];
		info["ipLat"] = data["latitude"];
		info["ipLong"] = data["longitude"];
		info["ipUTCoffset"] = data["utc_offset"];
		info["ISP"] = data["org"];
	});
	console.log(info); // TODO for debugging only

	// Check for existing shortlink
	$.getJSON(endpoint + "/" + getSlug(), function(data) {
		data = data["result"];
		if (data == null) { // Create shortlink
			this.slug = getSlug();
			this.info = info;
			$.ajax({
				'url': endpoint + "/" + this.slug,
				'type': 'POST',
				'data': this.info,
				'dataType': 'json',
				'contentType': 'application/json; charset=utf-8'
			})
			if (confirm("Shortlink created at " + document.URL + "#" + getSlug() + ". Copy to clipboard?")) {
				copy(document.URL + "#" + getSlug());
			}
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
