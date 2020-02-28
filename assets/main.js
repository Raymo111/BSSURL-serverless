var endpoint = "https://www.jsonstore.io/e3c54c65c90ae3b65c584fd114d23413860cabfa5637afdd2bd27ffe5408070e";

// Redirect
if (window.location.hash != "") {
	$.getJSON(endpoint + "/" + window.location.hash.substr(1).toLowerCase(), function(data) {
		data = data["result"];
		if (data != null) {
			window.location.href = data;
		}
	});
}

// Make page visible after redirect processes to avoid flashing
//document.getElementById("page").style.display = "block";

function getURL() {
	var url = document.getElementById("url").value;
	var protocolChk = url.startsWith("http://") || url.startsWith("https://");
	if (!protocolChk) {
		newurl = "https://" + url;
		return newurl;
	} else {
		return url;
	}
}

function getSlug() {
	return document.getElementById("slug").value.toLowerCase();
}

function shorten() {
	if (getURL() == "") {
		alert("A long URL is required!");
		return;
	}
	if (getSlug() == "") {
		alert("A slug is required!");
		return;
	}
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
			alert("Shortlink created at https://bayview.ml/" + getSlug());
		} else {
			alert("Slug is taken!");
		}
	});
}
