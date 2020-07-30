/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

const createWriteStream = require('fs').createWriteStream;
const until = protractor.ExpectedConditions;

async function takeScreenshot(fileName) {
	const png = await browser.takeScreenshot();
	const stream = createWriteStream(`output/${fileName}`);
	stream.write(Buffer.from(png, 'base64'));
	stream.end();
}

async function performLoginAndRouteTo(url) {
	await browser.get('http://localhost:8080/login');
	// Wait for LoginView to be rendered
	await browser.wait(until.presenceOf(element(by.name('username')), 5000, 'Element taking too long to appear in the DOM'));
	await browser.wait(until.presenceOf(element(by.name('password')), 5000, 'Element taking too long to appear in the DOM'));
	await browser.wait(until.presenceOf(element(by.css('button[type = "submit"]')), 5000, 'Element taking too long to appear in the DOM'));
	// Perform the login
	await element(by.name('username')).sendKeys('admin');
	await element(by.name('password')).sendKeys('assext');
	await element(by.css('button[type = "submit"]')).submit();
	// Wait for the Shell view to be rendered
	await browser.wait(until.presenceOf(element(by.react('ShellView')), 5000, 'Element taking too long to appear in the DOM'));

	await browser.get(`http://localhost:8080${url}`);
}

async function setMockedResponse() {

}

module.exports = {
	takeScreenshot,
	performLoginAndRouteTo,
	setMockedResponse
};
