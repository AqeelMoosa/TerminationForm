sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/DatePicker",
    "sap/m/MessageBox"
],
function (Controller, DatePicker, MessageBox) {
    "use strict";

    return Controller.extend("terminationformapplication.terminationformapplication.controller.TerminationForm", {
        onInit: function () {

            this.getUserId();
            this.setUserId()
            this.getUserDetails()
        },

        // #region Get User Details
        getUserId: function () {
            const sQuery = window.location.search;
            const oParams = {};
            sQuery.replace(/^\?/, '').split('&').forEach(function(param) {
                const aParam = param.split('=');
                oParams[aParam[0]] = decodeURIComponent(aParam[1]);
            });
            
            return oParams["USER_ID"] || null;
        },

        setUserId: function (oEvent) {
            this._sUserId = this.getUserId();
        },

        getUserDetails: function() {
           const that = this; 
           const oDataModel = this.getOwnerComponent().getModel();
            oDataModel.read(`/User('${this._sUserId}')`, {
                success: function (oData) {
                    const oUsername = that.getView().byId("Username")
                    const sFullname = oData.defaultFullName;
                    oUsername.setText(`${sFullname} (${that._sUserId})`);
                },
                error: function (oError) {
                    console.error(oError);
                }
            });
        },
        // #endregion

        // #region Send Termination details to custom MDF

        submitForm: function() {
            const that = this;
            let EmpNr = that.getView().byId("empnr").getValue();
            let EmpName = that.getView().byId("empname").getValue();
            let payload = {};
            payload = {
                "__metadata": {
                    "uri": "https://apisalesdemo2.successfactors.eu/odata/v2/cust_EmployeeTerminationForm('"+that._sUserId+"')",
                    "type" : "SFOData.cust_EmployeeTerminationForm"
                },
                
                "cust_EmployeeNumber": EmpNr,
                "cust_EmployeeName": EmpName

            }

            var oModel = that.getOwnerComponent().getModel();
            oModel.create("/upsert", payload, {
                success: function() {
                    sap.m.MessageBox.show("Record Added", {
                        icon: sap.m.MessageBox.Icon.SUCCESS,
                        title: "Success!"
                    });
                }
            })
        },

        // #endregion


    });
});
