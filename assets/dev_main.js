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

	// Send JQuery request
	$.getJSON(endpoint + "/" + getSlug(), function(data) {
		data = data["result"];
		if (data == null) {
			this.url = getURL();
			this.slug = getSlug();
			$.ajax({
				'url': endpoint + "/" + this.slug,
				'type': 'POST',
				'data': JSON.stringify(this.url),
				'dataType': 'json',
				'contentType': 'application/json; charset=utf-8'
			})
			if (confirm("Shortlink created at https://bayview.ml#" + getSlug() + ". Copy to clipboard?")) {
				copy("https://bayview.ml#" + getSlug());
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