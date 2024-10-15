sap.ui.define(
    [
        "./BaseController"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("terminationformapplication.terminationformapplication.controller.App", {
        onInit: function() {
          this.setUserModel()
        }
      });
    }
  );
  