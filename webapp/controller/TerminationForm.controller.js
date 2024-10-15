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

            // const fileUploader = this.getView().byId("terminationLetter");
            // fileUploader.attachChange(this.onFileChange, this);
        },

        // #region Access and Change file to base 64
        onFileChange: function (oEvent) {
            // Log the event to check what is passed
            console.log("FileChange Event: ", oEvent);
        
            // Get the FileUploader control explicitly by its ID
            const fileUploader = this.getView().byId("terminationLetter");
        
            // Log the FileUploader control to verify it's correctly retrieved
            console.log("FileUploader control: ", fileUploader);
        
            // Check if a file was selected
            if (oEvent.getParameter("files") && oEvent.getParameter("files").length > 0) {
                const file = oEvent.getParameter("files")[0];  // Get the first selected file
        
                // Log the selected file details
                console.log("Selected File: ", file);
        
                // Extract file properties
                const sFileName = file.name;     // File name
                const sMimeType = file.type;     // MIME type
        
                // Log the file name and MIME type
                console.log("File Name: ", sFileName);
                console.log("MIME Type: ", sMimeType);
        
                // Read the file content and convert it to Base64
                const fileReader = new FileReader();
        
                // Once file content is read, process it
                fileReader.onload = function () {
                    // File content is base64-encoded, removing the 'data:...' prefix
                    const sBase64Data = fileReader.result.split(',')[1];
        
                    // Log the Base64 encoded data (for debugging purposes, limit log size)
                    console.log("Base64 Data: ", sBase64Data.substring(0, 100)); // Logs first 100 characters
        
                    // Store file data for later use (upload)
                    this._oFileData = {
                        fileName: sFileName,
                        mimeType: sMimeType,
                        fileContent: sBase64Data
                    };
        
                    console.log("File data processed and stored for upload.");
                }.bind(this);  // Ensure the correct context of `this`
        
                // Start reading the file as a data URL (base64)
                fileReader.readAsDataURL(file);
            } else {
                // Log error if no file is selected
                console.error("No file selected.");
            }
        },
        // #endregion
        



        // #region Upload to Attachment entity
        uploadAttachment: function (sFileName, sBase64Data) {
            const that = this;
            return new Promise(function (resolve, reject) {
                const oModel = that.getOwnerComponent().getModel();
        
                // Payload for creating an attachment
                const oPayload = {
                    "__metadata": {
                        "type": "SFOData.Attachment"
                    },
                    "fileName": sFileName,
                    "fileContent": sBase64Data, // Base64 encoded file content (excluding data URI scheme)
                    "module": "GENERIC_OBJECT",
                    "userId": that._sUserId
                };

                
        
                // Create the attachment
                oModel.create("/Attachment", oPayload, {
                    success: function (oData) {
                        const that = this;
                        resolve(oData.attachmentId); // Return the attachment ID
                        that._sAttachmentId = oData.attachmentId;
                        console.log("Attachment uploaded successfully, Attachment ID: ", oData.attachmentId); 
                    },
                    error: function (oError) {
                        reject(oError); // Reject on error
                    }
                });
            });
        },
        // #endregion

        



        // #region Get User Details
        getUserId: function () {
            const sQuery = window.location.href.split('?').pop();
            const oParams = {};
            sQuery.replace(/^\?/, '').split('&').forEach(function(param) {
                const aParam = param.split('=');
                oParams[aParam[0]] = decodeURIComponent(aParam[1] || '');
            });
            
            return oParams["USER_ID"] || null;
           
        },

        setUserId: function () {
            this._sUserId = this.getUserId();
            console.log(this._sUserId)
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
        submitForm: async function() {
            const that = this;
            let EmpNr = that.getView().byId("empnr").getValue();
            let EmpName = that.getView().byId("empname").getValue();

            let PosR = that.getView().byId("comboBox1").getValue();
            let Regret = that.getView().byId("comboBox2").getValue();
            let directReport = that.getView().byId("directReports").getValue();
            let email = that.getView().byId("Email").getValue();

            let LastContractDay = that.getView().byId("datePicker").getValue();
            let oDate = new Date(LastContractDay); // Convert the string to a JavaScript Date object
            let oDateInTicks = "/Date(" + oDate.getTime() + ")/"; // Convert to the required ticks format
        

            // let tLetter = that.getView().byId("terminationLetter").getValue();
            // let sPay = that.getView().byId("calculationDocument").getValue();

            let payload = {};

            payload = {
                "__metadata": {
                    "uri": "https://apisalesdemo2.successfactors.eu/odata/v2/cust_EmployeeTerminationForm('"+that._sUserId+"')",
                    "type" : "SFOData.cust_EmployeeTerminationForm"
                },
            
                "cust_PositionRemain": PosR,
                "cust_RegrettedLoss": Regret,
                "cust_DirectReports": directReport,
                "cust_Email": email,
                "cust_EmployeeNumber": EmpNr,
                "cust_EmployeeName": EmpName,
                "cust_LastContractDay" : oDateInTicks,
                // "cust_TerminationLetter" : {
                //     "__metadata" : {
                //         "uri" : "Attachment('"+that._sAttachmentId+"')"
                //   }
                //  }
                
            };

            

            var oModel = that.getOwnerComponent().getModel();
            oModel.create("/upsert", payload, {
                success: function() {
                    sap.m.MessageBox.show("Record Added", {
                        icon: sap.m.MessageBox.Icon.SUCCESS,
                        title: "Success!"
                    });

                    // Clear the input fields after submission
                    that.getView().byId("empnr").setValue('');   // Clear employee number
                    that.getView().byId("empname").setValue(''); // Clear employee name
                    that.getView().byId("datePicker").setValue(''); // Clear datepicker
                    that.getView().byId("terminationLetter").setValue('')
                    that.getView().byId("calculationDocument").setValue('')
                },
                error: function (oError){
                    console.error(oError)
                }
            });
        
        } 
   
    });
});
     // #endregion