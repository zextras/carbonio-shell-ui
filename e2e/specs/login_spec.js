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
const takeScreenshot = require('./utils').takeScreenshot;
const performLoginAndRouteTo = require('./utils').performLoginAndRouteTo;

const until = protractor.ExpectedConditions;

describe('Login and Logout', function() {
	it('User performs a login', async function() {
		await browser.get('http://localhost:8080/');
		await browser.wait(until.presenceOf(element(by.react('ShellView')), 5000, 'Element taking too long to appear in the DOM'));
		expect(element(by.react('ShellView')).isPresent()).toBeTruthy();
	});

	it('User performs a logout and is redirected to \'/login\'', async function() {
		await browser.get('http://localhost:8080/logout');
		await browser.wait(until.presenceOf(element(by.css('button[type = "submit"]')), 5000, 'Element taking too long to appear in the DOM'));
		await element(by.css('button[type = "submit"]')).submit();
		await browser.wait(function() {
			return browser.getCurrentUrl().then(function(url) {
				return url !== 'http://localhost:8080/logout' && url !== 'http://localhost:8080/';
			});
		}, 5000, "url has not changed");
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/login');
	});
});
