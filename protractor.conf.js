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

exports.config = {
	framework: 'jasmine',
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: ['e2e/specs/*_spec.js'],
	plugins: [
		{ package: 'protractor-react-selector' }
	],
	onPrepare: async function() {
		const jasmineReporters = require('jasmine-reporters');
		const junitReporter = new jasmineReporters.JUnitXmlReporter({

			// setup the output path for the junit reports
			savePath: 'e2e/output/',

			// conslidate all true:
			//   output/junitresults.xml
			//
			// conslidate all set to false:
			//   output/junitresults-example1.xml
			//   output/junitresults-example2.xml
			consolidateAll: false

		});
		jasmine.getEnv().addReporter(junitReporter);

		await browser.waitForAngularEnabled(false);
		// // Performs the login
		// await browser.get('http://localhost:8080/login');
		// // Wait for LoginView to be rendered
		// await browser.wait(until.presenceOf(element(by.name('username')), 5000, 'Element taking too long to appear in the DOM'));
		// await browser.wait(until.presenceOf(element(by.name('password')), 5000, 'Element taking too long to appear in the DOM'));
		// await browser.wait(until.presenceOf(element(by.css('button[type = "submit"]')), 5000, 'Element taking too long to appear in the DOM'));
		// // Perform the login
		// await element(by.name('username')).sendKeys('admin');
		// await element(by.name('password')).sendKeys('assext');
		// await element(by.css('button[type = "submit"]')).submit();
		// Wait for the Shell view to be rendered
		// await browser.wait(until.presenceOf(element(by.react('ShellView')), 5000, 'Element taking too long to appear in the DOM'));
	}
}
