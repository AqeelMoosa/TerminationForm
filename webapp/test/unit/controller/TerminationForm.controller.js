/*global QUnit*/

sap.ui.define([
	"termination_form_application/terminationformapplication/controller/TerminationForm.controller"
], function (Controller) {
	"use strict";

	QUnit.module("TerminationForm Controller");

	QUnit.test("I should test the TerminationForm controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
