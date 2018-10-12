// ==UserScript==
// @name         LinkedIn Auto Connect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add everyone!!
// @author       Richie Goh
// @match        https://www.linkedin.com/search/results/people/*
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	var retryCount = 0;
	var startAutoConnect = false;
	var email = "user@domain.com";

	var autoConnect = function () {

		if (!startAutoConnect) return;

		$("#email").val(email);
		$("button:contains('Connect')").filter(function () {
			return $(this).text().trim() === 'Connect';
		}).click();

		$("button:contains('Send now')").prop("disabled", false);
		$("button:contains('Send now')").click();

		if ($("button:contains('Connect')").filter(function () {
			return $(this).text().trim() === 'Connect';
		}).length == 0) {
			++retryCount;
			console.log("retrying.." + retryCount);
		}
		else
			retryCount = 0;

		if (retryCount >= 10) {
			$("button:contains('Next')").click();
			retryCount = 0;
		}
		//window.scroll(0, 1000);

		setTimeout(autoConnect, 500);

	}

	var toggleAutoConnect = function () {
		if (!startAutoConnect) {
			retryCount = 0;
			startAutoConnect = true;
			autoConnect();
			$("#btnAutoConnect").text("Stop Auto Connect");
			$("#btnAutoConnect").css("font-weight", 600);
		}
		else {
			startAutoConnect = false;
			$("#btnAutoConnect").css("font-weight", 400);
			$("#btnAutoConnect").text("Start Auto Connect");
		}
	}

	var button = document.createElement("button");
	$('.nav-side').append($("<li class='nav-item nav-item--app-launcher'><button class='nav-item__link' id='btnAutoConnect'>Start Auto Connect</button></li>"));
	$("#btnAutoConnect").click(function () {
		toggleAutoConnect();
	});
})();