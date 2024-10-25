sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter"
],
function (Controller, MessageBox, Filter) {
    "use strict";

    return Controller.extend("terminationformapplication.terminationformapplication.controller.TerminationForm", {
        onInit: function () {
            this.getUserId();
            this.setUserId()
            this.getUserDetails()

            this._wizard = this.byId("CreateProductWizard");
			this._oNavContainer = this.byId("wizardNavContainer");
			this._oWizardContentPage = this.byId("page");

            console.log(MessageBox.Icon); // This should list all the available icons


            const oReviewModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oReviewModel, "reviewModel");
            
            this.checkTeamMembersSize();
            var oView = this.getView();
			this.oSF = oView.byId("searchField");

            //  const oDataModel = this.getOwnerComponent().getModel();

            // oDataModel.read(`/EmpJob`, {
            //     urlParameters: {
            //         "$filter": `userId eq '${this._sUserId}'`
            //     },

            //     success: (oData) => {
            //         this._seqNum = oData.results[0].seqNumber
            //         this._startDate = oData.results[0].startDate
            //         this._pos = oData.results[0].position
                    

            //     },
            // });

        },

        // #region View Review Page
        wizardCompletedHandler: function () {
            const oView = this.getView();
            const oTerminationLetterUploader = oView.byId("terminationLetter");
            const oSeveranceDocUploader = oView.byId("calculationDocument");
            var oComboBox = this.getView().byId("terminationReasonComboBox");
            var oSelectedItem = oComboBox.getSelectedItem();
            var sSelectedKey = oSelectedItem.getKey();

            if (sSelectedKey === "TERVCOMP"){
                const oData = {
                    persNo: oView.byId("empnr").getText(),
                    employeeName: oView.byId("empname").getText(),
                    selectedDate: oView.byId("datePicker").getValue(),
                    uploadedDocuments : [
                        {
                            fileName: oTerminationLetterUploader.getValue(),
                            type: "Termination Letter"
                        },
                        {
                            fileName: oSeveranceDocUploader.getValue(),
                            type: "Severance Pay Document"
                        }
                    ],
    
                    termReas: oView.byId("terminationReasonComboBox").getSelectedItem().getText(),
                    resigDate: oView.byId("resignationDatePicker").getValue(),
                    posRemain: oView.byId("comboBox1").getSelectedItem().getText(),
                    backFill: oView.byId("comboBox4").getSelectedItem().getText(),
                    RegLoss: oView.byId("comboBox2").getSelectedItem().getText(),
                    PersEmail: oView.byId("Email").getValue(),
                    DirectRep: oView.byId("searchField").getValue()
                };

                oView.byId("resignationDate").setVisible(true)
                oView.byId("resigDatePicker").setVisible(true)
                oView.getModel("reviewModel").setData(oData);
                oView.getModel("reviewModel").refresh();
                oView.byId("wizardNavContainer").to(oView.byId("ReviewPage"));

            } else {
                const oData = {
                    persNo: oView.byId("empnr").getText(),
                    employeeName: oView.byId("empname").getText(),
                    selectedDate: oView.byId("datePicker").getValue(),
                    uploadedDocuments : [
                        {
                            fileName: oTerminationLetterUploader.getValue(),
                            type: "Termination Letter"
                        },
                        {
                            fileName: oSeveranceDocUploader.getValue(),
                            type: "Severance Pay Document"
                        }
                    ],
    
                    termReas: oView.byId("terminationReasonComboBox").getSelectedItem().getText(),
                    posRemain: oView.byId("comboBox1").getSelectedItem().getText(),
                    backFill: oView.byId("comboBox4").getSelectedItem().getText(),
                    RegLoss: oView.byId("comboBox2").getSelectedItem().getText(),
                    PersEmail: oView.byId("Email").getValue(),
                    DirectRep: oView.byId("searchField").getValue()
                };
                
                oView.byId("resignationDate").setVisible(false)
                oView.byId("resigDatePicker").setVisible(false)
                oView.getModel("reviewModel").setData(oData);
                oView.getModel("reviewModel").refresh();
                oView.byId("wizardNavContainer").to(oView.byId("ReviewPage"));
            }


            
		},

        backToWizardContent: function () {
			this._oNavContainer.backToPage(this._oWizardContentPage.getId());
		},

        _handleNavigationToStep: function (iStepNumber) {
			var fnAfterNavigate = function () {
				this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
				this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}.bind(this);

			this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this.backToWizardContent();
		},

        editStepOne: function () {
			this._handleNavigationToStep(0);
		},

        editStepTwo: function () {
			this._handleNavigationToStep(1);

		},

		editStepThree: function () {
			this._handleNavigationToStep(2);
		},

		editStepFour: function () {
			this._handleNavigationToStep(3);
		},

         // #endregion

        // VisibilityFunction: function () {
        //     const ContractDay = this.getView().byId("datePicker")
        //     const dateValue = ContractDay.getValue()

        //     if (dateValue) {
        //         this.getView().byId("termLetterlbl").setVisible(true)
        //         this.getView().byId("terminationLetter").setVisible(true)
        //         this.getView().byId("severanceDoc").setVisible(true)
        //         this.getView().byId("calculationDocument").setVisible(true)
        //         //this.getView().byId("docTitle").setText("Documents")

        //     } else {
        //         this.getView().byId("termLetterlbl").setVisible(false)
        //         this.getView().byId("terminationLetter").setVisible(false)
        //         this.getView().byId("severanceDoc").setVisible(false)
        //         this.getView().byId("calculationDocument").setVisible(false)
        //         this.getView().byId("docTitle").setVisible(false)

        //     }
        // },

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

        handleWizardCancel: function () {
			this._handleMessageBoxOpen("Are you sure you want to cancel your report?", "warning");
		},

        // additionalInfoValidation: function () {
		//     //var termLetter = this.getView().byId("terminationLetter").getValue();
		// 	var CalcDoc = this.getView().byId("calculationDocument").getValue();

        //     if (CalcDoc) {
        //         //this._wizard.setCurrentStep(this.byId("DocumentsStep"));
        //         this._wizard.validateStep(this.getView().byId("DocumentStep"));
        //     }
		// },


        onFileChange2: function (oEvent) {
            // Log the event to check what is passed
            console.log("FileChange Event: ", oEvent);
        
            // Get the FileUploader control explicitly by its ID
            const fileUploader2 = this.getView().byId("calculationDocument");
            const SecondWiz = this.getView().byId("DocumentStep")
            const docData = fileUploader2.getValue()
        
            // Log the FileUploader control to verify it's correctly retrieved
            console.log("FileUploader control: ", fileUploader2);
        
            // Check if a file was selected
            if (oEvent.getParameter("files") && oEvent.getParameter("files").length > 0) {
                const file2 = oEvent.getParameter("files")[0];  // Get the first selected file
        
                // Log the selected file details
                console.log("Selected File: ", file2);
        
                // Extract file properties
                const pFileName = file2.name;     // File name
                const pMimeType = file2.type;     // MIME type
        
                // Log the file name and MIME type
                console.log("File Name: ", pFileName);
                console.log("MIME Type: ", pMimeType);
        
                // Read the file content and convert it to Base64
                const fileReader2 = new FileReader();
        
                // Once file content is read, process it
                fileReader2.onload = function () {
                    // File content is base64-encoded, removing the 'data:...' prefix
                    const pBase64Data = fileReader2.result.split(',')[1];
        
                    // Log the Base64 encoded data (for debugging purposes, limit log size)
                    console.log("Base64 Data: ", pBase64Data.substring(0, 100)); // Logs first 100 characters
        
                    // Store file data for later use (upload)
                    this._oFileData2 = {
                        fileName: pFileName,
                        mimeType: pMimeType,
                        fileContent: pBase64Data
                    };

                    if (docData) {
                        SecondWiz.setValidated(true)
                    } else {
                        SecondWiz.setValidated(false)
                    }
        
                    console.log("File data processed and stored for upload.");
                    this.getView().byId("lblTerm").setVisible(true)
                    this.getView().byId("remainlbl").setVisible(true)
                    this.getView().byId("backfilllbl").setVisible(true)
                    this.getView().byId("losslbl").setVisible(true)
                    this.getView().byId("emaillbl").setVisible(true)

                    this.getView().byId("terminationReasonComboBox").setVisible(true)
                    this.getView().byId("comboBox1").setVisible(true)
                    this.getView().byId("comboBox4").setVisible(true)
                    this.getView().byId("comboBox2").setVisible(true)
                    this.getView().byId("Email").setVisible(true)
                    //this.getView().byId("addInfo").setText("Additional Infomation")


                }.bind(this);  // Ensure the correct context of `this`
        
                // Start reading the file as a data URL (base64)
                fileReader2.readAsDataURL(file2);
            } else {
                // Log error if no file is selected
                console.error("No file selected.");
            }
        },
        // #endregion
        
        // #region Dynamic Direct Reports
        checkTeamMembersSize: function () {
            const that = this;
            const oModel = this.getOwnerComponent().getModel();
            const sUserId = this._sUserId;  // Assuming user ID is available in the controller context
            //const oWizard = this.getView().byId("CreateProductWizard")

            // Read User entity to get the teamMembersSize property
            oModel.read(`/User('${sUserId}')`, {
                success: function (oData) {
                    const iTeamMembersSize = oData.teamMembersSize;
                    console.log(iTeamMembersSize)
                   // const email = that.getView().byId("Email")
                    //const emailValue = email.getValue()


                    // Check if teamMembersSize is 1 or greater
                    if (iTeamMembersSize >= 1) {
                        // Show the label and textbox if condition is met
                        that.getView().byId("directReplbl").setVisible(true);
                        that.getView().byId("searchField").setVisible(true);
                        that.getView().byId("OptionalInfoStep").setVisible(true)
                        that.getView().byId("DirectReportsReview").setVisible(true)

                    } else {
                        // Hide the label and textbox otherwise
                        that.getView().byId("directReplbl").setVisible(false);
                        that.getView().byId("searchField").setVisible(false);
                        that.getView().byId("OptionalInfoStep").setVisible(true).setValidated(true)
                        that.getView().byId("NoDirectReports").setText("Employee has no Direct Reports").setVisible(true)
                        that.getView().byId("DirectReportsReview").setVisible(false)
                    }
                },
                error: function (oError) {
                    console.error("Error fetching User entity:", oError);
                }
            });
        },

        // #endregion

        // #region Validation Checks
        ValidationDateCheck: function() {
            const date1 = this.getView().byId("datePicker").getDateValue()
            const firstWiz = this.getView().byId("EmployeeDetailsStep")

            if (date1) {
                firstWiz.setValidated(true)
            } else {
                firstWiz.setValidated(false)
            }
        },

        EmailValidation: function() {
            const ThirdWiz = this.getView().byId("AdditionalInfoStep")
            const emailInput = this.getView().byId("Email").getValue()

            if (emailInput) {
                ThirdWiz.setValidated(true)
            } else {
                ThirdWiz.setValidated(false)
            }
        },

        DirectReportsValidation: function() {
            const fourthWiz = this.getView().byId("OptionalInfoStep")
            const directR = this.getView().byId("searchField").getValue()

            if (directR) {
                fourthWiz.setValidated(true)
            } else {
                fourthWiz.setValidated(false)
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
                    "userId": "Technical"
                };

                
        
                // Create the attachment
                oModel.create("/Attachment", oPayload, {
                    success: function (oData) {
                        resolve(oData.attachmentId); // Return the attachment ID
                        console.log("Attachment uploaded successfully, Attachment ID: ", oData.attachmentId); 
                    },
                    error: function (oError) {
                        reject(oError); // Reject on error
                    }
                });
            });
        },

        uploadAttachment2: function (pFileName, pBase64Data) {
            const that = this;
            return new Promise(function (resolve, reject) {
                const oModel = that.getOwnerComponent().getModel();
        
                // Payload for creating an attachment
                const oPayload2 = {
                    "__metadata": {
                        "type": "SFOData.Attachment"
                    },

                    "fileName": pFileName,
                    "fileContent": pBase64Data, // Base64 encoded file content (excluding data URI scheme)
                    "module": "GENERIC_OBJECT",
                    "userId": "Technical"
                };

                
        
                // Create the attachment
                oModel.create("/Attachment", oPayload2, {
                    success: function (oData) {
                        resolve(oData.attachmentId); // Return the attachment ID
                        console.log("Attachment 2 uploaded successfully, Attachment ID: ", oData.attachmentId); 
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
                    const name = that.getView().byId("empname")
                    const empNr = that.getView().byId("empnr")
                    const sFullname = oData.defaultFullName;
                    name.setText(`${sFullname}`);
                    empNr.setText(`${that._sUserId}`)
                },
                error: function (oError) {
                    console.error(oError);
                }
            });
        },
        // #endregion

        // #region On resignation reason
        onComboBoxSelectionChange: function () {
            // Get the selected item from the ComboBox
            var oComboBox = this.getView().byId("terminationReasonComboBox");
            var oSelectedItem = oComboBox.getSelectedItem();

            if (oSelectedItem) {
                // Get the key of the selected item
                var sSelectedKey = oSelectedItem.getKey();
                MessageBox.show(
                    "Based on the reason for termination, here is a reminder of the eligibility for a pro-rata bonus payment", // Message text
                    {
                        icon: MessageBox.Icon.INFORMATION, // Icon type
                        title: "Reminder", // Dialog title
                        actions: [MessageBox.Action.OK], // Action buttons
                        onClose: function (oAction) {
                            // Handle action if necessary (optional)
                            console.log("MessageBox closed with action: " + oAction);
                        }
                    }
                );
                
                // Check if the selected key is "resignation"
                if (sSelectedKey === "TERVCOMP") {
                    // Show label and input field
                    this.getView().byId("resignationDatelbl").setVisible(true);
                    this.getView().byId("resignationDatePicker").setVisible(true);
                } else {
                    // Hide label and input field for other selections
                    this.getView().byId("resignationDatelbl").setVisible(false);
                    this.getView().byId("resignationDatePicker").setVisible(false);
                }
            }
        },
        // #endregion

        // #region Search Function
        onSuggest: function (event) {
			var sValue = event.getParameter("suggestValue"),
				aFilters = [];
			if (sValue) {
				aFilters = [
					new Filter([
						new Filter("EmpNr", function (sText) {
							return (sText || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
						}),
						new Filter("name", function (sDes) {
							return (sDes || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
						})
					], false)
				];
			}

			this.oSF.getBinding("suggestionItems").filter(aFilters);
			this.oSF.suggest();
		},
        // #endregion

        // #region Deactivate Position
        // DeactivatePosition: function () {
        //     const oDataModel = this.getOwnerComponent().getModel();
        //     const PositionStatus = this.getView().byId("comboBox1")

        //     var selected = PositionStatus.getSelectedItem();
        //     var selectedKey = selected.getKey();

        //     var oDate = new Date(this._startDate);
        //     var year = oDate.getFullYear();
        //     var month = String(oDate.getMonth() + 1).padStart(2, '0');
        //     var day = String(oDate.getDate()).padStart(2, '0');
        //     var hours = String(oDate.getHours()).padStart(2, '0');
        //     var minutes = String(oDate.getMinutes()).padStart(2, '0');
        //     var seconds = String(oDate.getSeconds()).padStart(2, '0');
        //     var FormattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        //     if (selectedKey == "No") {
        //         var payload3 = {
        //             "__metadata": {
        //                 "uri": `Position(code='${this._pos}',effectiveStartDate=datetime'${FormattedDate}')`,
        //                 "type" : "SFOData.Position"
        //             },

        //             "effectiveStatus": "I"
        //         }

        //         oDataModel.create("/upsert", payload3, {
        //             success: () =>{
        //                 console.log("Position Deactivated")
        //             },

        //             error() {
        //                 console.log("Error in Deactivation")
        //             }
        //         })

        //     }
        // },

        // #endregion

        // #region Filtering
        onAfterRendering: function() {
            const oComboBox = this.getView().byId("terminationReasonComboBox");
            const oModel = this.getView().getModel();
        
            // Read FOEventReason entity set without a filter
            oModel.read("/FOEventReason", {
                success: (oData) => {
                    // Log data to verify it was retrieved successfully
                    console.log("FOEventReason data:", oData);
        
                    // Filter the data client-side based on the 'event' field
                    const filteredData = oData.results.filter(item => item.event === "3680");
        
                    // Log filtered data to check if filtering worked
                    console.log("Filtered FOEventReason data:", filteredData);
        
                    // If no data matches the filter, log a warning
                    if (filteredData.length === 0) {
                        console.warn("No FOEventReason records match the event '3680'");
                    }
        
                    // Create a JSON model for the filtered data
                    const oFilteredModel = new sap.ui.model.json.JSONModel({ items: filteredData });
        
                    // Set the model to the ComboBox
                    oComboBox.setModel(oFilteredModel);
        
                    // Bind the items to the ComboBox (path to the items array in the JSON model)
                    oComboBox.bindItems({
                        path: "/items",
                        template: new sap.ui.core.ListItem({
                            key: "{externalCode}",
                            text: "{name}"
                        })
                    });
                },
                error: (oError) => {
                    console.error("Error fetching FOEventReason data", oError);
                }
            });
        },
        // #endRegion


       
        // #region Backfill Functionality
        // UpdateEmpJob: function() {
        //     const oDataModel = this.getOwnerComponent().getModel();
        //     const BackFillCB = this.getView().byId("comboBox4")

        //     var oSelectedItem2 = BackFillCB.getSelectedItem();
        //     var sSelectedKey2 = oSelectedItem2.getKey();

        //     if (sSelectedKey2 == "No") {

        //             console.log("sequenceNumber:",this._seqNum)
        //             console.log("startdate:",this._startDate)
    
        //             payload = {
        //                     "__metadata": {
        //                         "uri" : `EmpJob(seqNumber=${this._seqNum}L,startDate=datetime'${this._startDate}', userId='${this._sUserId}')`,
        //                         "type": "SFOData.EmpJob"
        //                     },
    
        //                     //Update JobInfo if 
        //                     //possible termination of employee class
        //                     //
        //             },

    
        //             oDataModel.create("/upsert", payload, {
        //                     success: function() {
        //                         console.log("Job Info Updated!")
        //                     }
        //             })


        //     } 
            
        //     else if (sSelectedKey2 == "Yes") {
                    
        //         console.log("sequenceNumber:",this._seqNum)
        //         console.log("startdate:", this._startDate)
        //         console.log("position:", this._pos)

    
        //         payload = {
        //              "__metadata": {
        //              "uri" : `EmpJob(seqNumber=${this._seqNum}L,startDate=datetime'${this._startDate}', userId='${this._sUserId}')`,
        //              "type": "SFOData.EmpJob"
        //                 },
    
        //                     //Update jobInfo if yes
                        
        //             },

        //             oDataModel.create("/upsert", payload, {
        //                     success: function() {
        //                         console.log("Job Info Updated!")

        //                         var payload2 = {
        //                             "__metadata": {
        //                                 "uri": `Position(code='${this._pos}', effectiveStartDate=datetime'${this._startDate}')`,
        //                                 "type" : "SFOData.Position"
        //                             },

        //                             //Update position if yes
        //                         }

        //             oDataModel.create("/upsert", payload2, {
        //                             success: () =>{
        //                                 console.log("Job Info and position updated!")
        //                             },

        //                             error() {
        //                                 console.log("Error in Update")
        //                             }
        //                         })
        //                     }
        //                 })
        //             }
        //     },
         // #endregion





        // #region Send Termination details to custom MDF
        submitForm: async function() {
            const that = this;
            let EmpNr = that.getView().byId("empnr").getText();
            let EmpName = that.getView().byId("empname").getText();

            let PosR = that.getView().byId("comboBox1").getValue();
            let Regret = that.getView().byId("comboBox2").getValue();
            let directReport = that.getView().byId("searchField").getValue();
            let email = that.getView().byId("Email").getValue();
            let TermReason = that.getView().byId("terminationReasonComboBox").getValue();
            let backFill = that.getView().byId("comboBox4").getValue();

            let resigDate = that.getView().byId("resignationDatePicker").getValue()
            let rDate = new Date(resigDate);
            let rDateInTicks = "/Date(" + rDate.getTime() +")/";

            let LastContractDay = that.getView().byId("datePicker").getValue();
            let oDate = new Date(LastContractDay);
            let oDateInTicks = "/Date(" + oDate.getTime() + ")/";

            let payload = {};

            if (that._oFileData){
                try{
                    const attachmentId = await that.uploadAttachment(that._oFileData.fileName, that._oFileData.fileContent);
                    const attachmentId2 = await that.uploadAttachment2(that._oFileData2.fileName, that._oFileData2.fileContent);
                    
                    if (resigDate == '') {
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
                            "cust_TerminationReason" : TermReason,
                            "cust_EmployeeBackfill" : backFill,
                            "cust_TerminationLetterNav" : {
                                 "__metadata" : {
                                     "uri" : `Attachment('${attachmentId}')`
                                }
                            },

                            "cust_SeveranceDocumentNav" : {
                                "__metadata" : {
                                    "uri" : `Attachment('${attachmentId2}')`
                                }
                            }
                        };

                    } else {
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
                            "cust_TerminationReason" : TermReason,
                            "cust_EmployeeBackfill" : backFill,
                            "cust_ResignationDate" : rDateInTicks,
                            
                            "cust_TerminationLetterNav" : {
                                "__metadata" : {
                                    "uri" : `Attachment('${attachmentId}')`
                               }
                           },

                           "cust_SeveranceDocumentNav" : {
                                "__metadata" : {
                                    "uri" : `Attachment('${attachmentId2}')`
                                }
                            }
                            
                        };

                    }

            var oModel = that.getOwnerComponent().getModel();
            oModel.create("/upsert", payload, {
                success: function() {
                    sap.m.MessageBox.show("Termination Form Submitted", {
                        icon: sap.m.MessageBox.Icon.SUCCESS,
                        title: "Success!"
                    });

                    // Clear the input fields after submission
                    // that.getView().byId("empnr").setText('');   // Clear employee number
                    // that.getView().byId("empname").setText(''); // Clear employee name
                    
                    // that.getView().byId("terminationLetter").setValue('')
                    // that.getView().byId("calculationDocument").setValue('')
                    // that.getView().byId("comboBox1").setValue('');
                    // that.getView().byId("comboBox2").setValue('');
                    // that.getView().byId("searchField").setValue('');
                    // that.getView().byId("Email").setValue('');
                    // that.getView().byId("terminationReasonComboBox").setValue('');
                    // that.getView().byId("comboBox4").setValue('');

                    // that.getView().byId("resignationDatePicker").setValue('')
                    // that.getView().byId("datePicker").setValue(''); // Clear datepicker
                
                },
                error: function (oError){
                    console.error(oError)
                }
            });
    
        } 
            catch (error) 
                 {
                    console.error("Error uploading attachment:", error);
                 }
                 
        }

        else
        {
              console.error("No file data available for upload.");
        }
      }
    })
});
  // #endregion