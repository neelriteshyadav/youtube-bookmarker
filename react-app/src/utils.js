/** @format */
/* global chrome */

// src/utils.js

export async function getActiveTabURL() {
	const tabs = await chrome.tabs.query({
		currentWindow: true,
		active: true,
	});

	return tabs[0];
}
