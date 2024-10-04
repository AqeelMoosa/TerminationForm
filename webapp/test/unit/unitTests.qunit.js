/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"termination_form_application/terminationformapplication/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
