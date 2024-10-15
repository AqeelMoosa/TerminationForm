sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("terminationformapplication.terminationformapplication.controller.BaseController", {
        setUserModel: function () {
            const oDataModel = this.getOwnerComponent().getModel();
            oDataModel.read("/User", {
                urlParameters: {
                    "$select": "userId, displayName"
                },
                success: (oUserData) => {
                    const aUserArray = [];
 
                    // Iterate over the returned departments and push the necessary details into the array
                    oUserData.results.forEach(user => {
                        aUserArray.push({
                            EmpNr: user.userId,
                            name: user.displayName,
                        });
                    });
 
                    // Create a new JSON model with the modified department data
                    const oUserModel = new sap.ui.model.json.JSONModel(aUserArray);
                    oUserModel.setSizeLimit(100000);
                    // Set the created model to the owner component with the name "departmentsModel"
                    this.getOwnerComponent().setModel(oUserModel, "UserModel");
                },
                error: (oError) => console.error(this.oResourceBundle.getText("errorFetchingUsers", [oError.message || oError]))
            });
        },
      });
    }
  );
  