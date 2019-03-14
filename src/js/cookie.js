
var options = {};
options.path = "/";

window.onload = function() {
	var alias = location.pathname.split('/');
	alias = alias[alias.length - 1];
	if (getCookie('acceptCookie') == undefined) {
		setCookie('acceptCookie', false, options);
	}

    if (getCookie('acceptCookie') == 'true') {
        dontPrintAccept();
    }
}

function iAccept() {
    setCookie('acceptCookie', true, options);
	location.reload();
}


function dontPrintAccept() {
	if (document.getElementById('acceptCookie') != undefined) {
        document.getElementById('acceptCookie').style.display = 'none';
	}
}



function setCookie(name, value, options) {
	options = options || {};
	var expires = undefined;
	if (typeof expires == "number" && expires) {
		var d = new Date();
		d.setTime(d.getTime() + expires * 10000);
		expires = options.expires = d;
	}
	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString();
	}

	value = encodeURIComponent(value);
	var updatedCookie = name + "=" + value;

	for (var propName in options) {
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if (propValue !== true) {
			updatedCookie += "=" + propValue;
		}
	}

	document.cookie = updatedCookie;
}

function getCookie(name) {
	var matches = document.cookie.match(
		new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}