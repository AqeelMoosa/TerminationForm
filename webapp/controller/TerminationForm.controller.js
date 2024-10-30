sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
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
            
            //this.checkTeamMembersSize();
            

            const oModel = this.getOwnerComponent().getModel();
            const sUserId = this._sUserId;

            oModel.read(`/User('${sUserId}')`, {
                success: (oData) => {
                    this.teamMemberSize = oData.teamMembersSize;
                    
                    if (this.teamMemberSize >= 1) {
                        // Hide or remove the Direct Reports step
                        const directReportsStep = this.createDirectReportsStep();
                        this._wizard.addStep(directReportsStep);
                    }
                },
                error: function () {
                    console.error("Failed to retrieve team member size.");
                }
            });

        },

        createDirectReportsStep: function () {
            // Define and return the "Direct Reports" step as a separate function
            return new sap.m.WizardStep({
                id: "OptionalInfoStep",
                title: "Direct Reports",
                validated: false,
                content: [
                    new sap.m.Label({
                        text: "If employee had direct reports, to whom should they be moved?"
                    }),
                    new sap.m.SearchField({
                        id: "searchField",
                        width: "500px",
                        class: "centeredFormContent",
                        placeholder: "Search for...",
                        enableSuggestions: true,
                        suggest: this.onSuggest.bind(this),  // Define onSuggest in the controller
                        change: this.DirectReportsValidation.bind(this),  // Define DirectReportsValidation in the controller
                        suggestionItems: {
                            path: 'UserModel>/',
                            template: new sap.m.SuggestionItem({
                                text: "{UserModel>name}",
                                description: "({UserModel>EmpNr})",
                                key: "{UserModel>EmpNr}"
                            })
                        }
                    }),
                ]
            });
        },



        // #region View Review Page
        wizardCompletedHandler: function () {
            const oView = this.getView();
            const oTerminationLetterUploader = oView.byId("terminationLetter");
            const oSeveranceDocUploader = oView.byId("calculationDocument");
            var oComboBox = this.getView().byId("terminationReasonComboBox");
            var oSelectedItem = oComboBox.getSelectedItem();
            var sSelectedKey = oSelectedItem.getKey();

            if (this.teamMemberSize >=1) {
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
                        DirectRep: sap.ui.getCore().byId("searchField").getValue()
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
                        DirectRep: sap.ui.getCore().byId("searchField").getValue()
                    };
                    
                    oView.byId("resignationDate").setVisible(false)
                    oView.byId("resigDatePicker").setVisible(false)
                    oView.getModel("reviewModel").setData(oData);
                    oView.getModel("reviewModel").refresh();
                    oView.byId("wizardNavContainer").to(oView.byId("ReviewPage"));
                }

            } else {
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
                        //DirectRep: sap.ui.getCore().byId("searchField").getValue()
                    };
                    
                    oView.byId("DirectReportsReview").setVisible(false)
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
                        //DirectRep: sap.ui.getCore().byId("searchField").getValue()
                    };
                    
                    oView.byId("DirectReportsReview").setVisible(false)
                    oView.byId("resignationDate").setVisible(false)
                    oView.byId("resigDatePicker").setVisible(false)
                    oView.getModel("reviewModel").setData(oData);
                    oView.getModel("reviewModel").refresh();
                    oView.byId("wizardNavContainer").to(oView.byId("ReviewPage"));
                }
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
            //console.log("FileChange Event: ", oEvent);
        
            // Get the FileUploader control explicitly by its ID
            const fileUploader = this.getView().byId("terminationLetter");
            
        
            // Log the FileUploader control to verify it's correctly retrieved
           // console.log("FileUploader control: ", fileUploader);
        
            // Check if a file was selected
            if (oEvent.getParameter("files") && oEvent.getParameter("files").length > 0) {
                const file = oEvent.getParameter("files")[0];  // Get the first selected file
        
                // Log the selected file details
                //console.log("Selected File: ", file);
        
                // Extract file properties
                const sFileName = file.name;     // File name
                const sMimeType = file.type;     // MIME type
        
                // Log the file name and MIME type
                //console.log("File Name: ", sFileName);
                //console.log("MIME Type: ", sMimeType);
        
                // Read the file content and convert it to Base64
                const fileReader = new FileReader();
        
                // Once file content is read, process it
                fileReader.onload = function () {
                    // File content is base64-encoded, removing the 'data:...' prefix
                    const sBase64Data = fileReader.result.split(',')[1];
        
                    // Log the Base64 encoded data (for debugging purposes, limit log size)
                    //console.log("Base64 Data: ", sBase64Data.substring(0, 100)); // Logs first 100 characters
        
                    // Store file data for later use (upload)
                    this._oFileData = {
                        fileName: sFileName,
                        mimeType: sMimeType,
                        fileContent: sBase64Data
                    };

                    //console.log("File data processed and stored for upload.");
                }.bind(this);  // Ensure the correct context of `this`
                
                // Start reading the file as a data URL (base64)
                fileReader.readAsDataURL(file);
            } else {
                // Log error if no file is selected
                console.error("No file selected.");
                sap.m.MessageBox.show("No file found", {
                    icon: sap.m.MessageBox.Icon.ERROR,
                    title: "Warning!"
                });
            }
        },

        onFileChange2: function (oEvent) {
            // Log the event to check what is passed
            //console.log("FileChange Event: ", oEvent);
        
            // Get the FileUploader control explicitly by its ID
            const fileUploader2 = this.getView().byId("calculationDocument");
            const SecondWiz = this.getView().byId("DocumentStep")
            const docData = fileUploader2.getValue()
        
            // Log the FileUploader control to verify it's correctly retrieved
           // console.log("FileUploader control: ", fileUploader2);
        
            // Check if a file was selected
            if (oEvent.getParameter("files") && oEvent.getParameter("files").length > 0) {
                const file2 = oEvent.getParameter("files")[0];  // Get the first selected file
        
                // Log the selected file details
               // console.log("Selected File: ", file2);
        
                // Extract file properties
                const pFileName = file2.name;     // File name
                const pMimeType = file2.type;     // MIME type
        
                // Log the file name and MIME type
                //console.log("File Name: ", pFileName);
                //console.log("MIME Type: ", pMimeType);
        
                // Read the file content and convert it to Base64
                const fileReader2 = new FileReader();
        
                // Once file content is read, process it
                fileReader2.onload = function () {
                    // File content is base64-encoded, removing the 'data:...' prefix
                    const pBase64Data = fileReader2.result.split(',')[1];
        
                    // Log the Base64 encoded data (for debugging purposes, limit log size)
                    //console.log("Base64 Data: ", pBase64Data.substring(0, 100)); // Logs first 100 characters
        
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
        
                    //console.log("File data processed and stored for upload.");
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
                sap.m.MessageBox.show("No file found", {
                    icon: sap.m.MessageBox.Icon.ERROR,
                    title: "Warning!"
                });
            }
        },

        uploadToSuccessFactors: function (base64String, fileName) {
            const oModel = this.getOwnerComponent().getModel();
        
            const attachmentData = {
                "__metadata": {
                        "type": "SFOData.Attachment"
                    },

                    "fileName": fileName,
                    "fileContent": base64String,
                    "module": "GENERIC_OBJECT",
                    "userId": "Technical"
            };
        
            // Example API endpoint for SuccessFactors Attachment entity
            oModel.create("/Attachment", attachmentData, {
                success: function (odata) {
                    console.log("Document uploaded successfully. Attachment ID:", odata.attachmentId);
                },
                error: function (oError) {
                    console.error("Error uploading document:", oError);
                }
            });
        },
        // #endregion
        
        // #region Dynamic Direct Reports
        // checkTeamMembersSize: function () {
        //     const that = this;
        //     const oModel = this.getOwnerComponent().getModel();
        //     const sUserId = this._sUserId;  // Assuming user ID is available in the controller context
        //     //const oWizard = this.getView().byId("CreateProductWizard")

        //     // Read User entity to get the teamMembersSize property
        //     oModel.read(`/User('${sUserId}')`, {
        //         success: function (oData) {
        //             const iTeamMembersSize = oData.teamMembersSize;
        //             //console.log(iTeamMembersSize)
        //            // const email = that.getView().byId("Email")
        //             //const emailValue = email.getValue()


        //             // Check if teamMembersSize is 1 or greater
        //             // if (iTeamMembersSize >= 1) {
        //             //     // Show the label and textbox if condition is met
        //             //     that.getView().byId("directReplbl").setVisible(true);
        //             //     that.getView().byId("searchField").setVisible(true);
        //             //     that.getView().byId("OptionalInfoStep").setVisible(true)
        //             //     that.getView().byId("DirectReportsReview").setVisible(true)

        //             // } else {
        //             //     // Hide the label and textbox otherwise
        //             //    // that.getView().byId("directReplbl").setVisible(false);
        //             //     that.getView().byId("searchField").setVisible(false);
        //             //     that.getView().byId("OptionalInfoStep").setVisible(true).setValidated(true)
        //             //     that.getView().byId("NoDirectReports").setText("Employee has no Direct Reports").setVisible(true)
        //             //     that.getView().byId("DirectReportsReview").setVisible(false)
        //             // }
        //         },
        //         error: function (oError) {
        //             console.error("Error fetching User entity:", oError);
        //             sap.m.MessageBox.show("User Not Found", {
        //                 icon: sap.m.MessageBox.Icon.ERROR,
        //                 title: "Warning!"
        //             });
        //         }
        //     });
        // },

        // #endregion

        // #region GenerateForms

        onGenerateWordDoc: function (oEvent) {
            if (!window.docx) {
                console.error("docx library is not loaded!");
                return;
            }
        
            const { Document, Packer, Paragraph, TextRun, HeadingLevel } = window.docx;
            const that = this;

            if (this.teamMemberSize >=1 ) {
                const empNr = this.getView().byId("empnr").getText();
                const empName = this.getView().byId("empname").getText();
                const selectedDate = this.getView().byId("datePicker").getValue();
                const terminationReason = this.getView().byId("terminationReasonComboBox").getValue();
                const email = this.getView().byId("Email").getValue();
                const directReport = sap.ui.getCore().byId("searchField").getValue();
                const backFill = this.getView().byId("comboBox4").getValue();
                const resigDate = this.getView().byId("resignationDatePicker").getValue();
                const posR = this.getView().byId("comboBox1").getValue();
                const regret = this.getView().byId("comboBox2").getValue();
                const TL = this.getView().byId("terminationLetter").getValue();
                const SP = this.getView().byId("calculationDocument").getValue();
            
                let teamMembersSize = 0;
                const oModel = this.getOwnerComponent().getModel();
                const sUserId = this._sUserId;
            
                oModel.read(`/User('${sUserId}')`, {
                    success: function (oData) {
                        teamMembersSize = oData.teamMembersSize;
            
                        const doc = new Document({
                            sections: [
                                {
                                    properties: {},
                                    children: [
                                        // Main Title (Heading 1)
                                        new Paragraph({
                                            text: "",
                                            heading: HeadingLevel.HEADING_1,
                                            alignment: "center",
                                            children: [
                                                new TextRun({
                                                    text: "Employee Termination Form",
                                                    bold: true,
                                                    underline: true,
                                                    size: 36, // Larger font for main heading
                                                }),
                                            ],
                                            spacing: { after: 300 },
                                        }),
                                        new Paragraph({
                                            text: "", // Horizontal line
                                            border: {
                                                bottom: {
                                                    color: "auto",
                                                    space: 1,
                                                    size: 6,
                                                },
                                            },
                                        }),
            
                                        // Employee Details Section (Heading 2)
                                        new Paragraph({
                                            text: "1. Employee Details",
                                            heading: HeadingLevel.HEADING_2,
                                            spacing: { after: 200 },
                                        }),
                                        new Paragraph({
                                            children: [
                                                new TextRun({ text: `1.1 Employee Number: ${empNr}`, break: 1, size: 24 }),
                                                new TextRun({ text: `1.2 Employee Name: ${empName}`, break: 1, size: 24 }),
                                                new TextRun({ text: `1.3 Last Contract Day: ${selectedDate}`, break: 1, size: 24 }),
                                                
                                            ],
                                            spacing: { after: 200 },
                                        }),
            
                                        // Additional Information Section (Heading 2)
                                        new Paragraph({
                                            text: "2. Additional Information",
                                            heading: HeadingLevel.HEADING_2,
                                            spacing: { after: 200 },
                                        }),
                                        new Paragraph({
                                            children: [
                                                new TextRun({ text: `2.1 Termination Reason: ${terminationReason}`, break: 1, size: 24 }),
                                                ...(terminationReason === "Vol Resignation to Competitor (TERVCOMP)" ? [
                                                    new TextRun({ text: `2.2 Resignation Date: ${resigDate}`, break: 1, size: 24 })
                                                ] : []),
                                                new TextRun({ text: `2.3 Position Remaining: ${posR}`, break: 1, size: 24 }),
                                                new TextRun({ text: `2.4 Regretted Loss: ${regret}`, break: 1, size: 24 }),
                                                new TextRun({ text: `2.5 Position Backfill: ${backFill}`, break: 1, size: 24 }),
                                                new TextRun({ text: `2.6 Email: ${email}`, break: 1, size: 24 }),
                                            ],
                                            spacing: { after: 200 },
                                        }),
            
                                        // Direct Reports Section (Heading 2)
                                        ...(teamMembersSize >= 1 ? [
                                            new Paragraph({
                                                text: "3. Direct Reports",
                                                heading: HeadingLevel.HEADING_2,
                                                spacing: { after: 200 },
                                            }),
                                            new Paragraph({
                                                children: [
                                                    new TextRun({ text: `3.1 Direct Report to: ${directReport}`, break: 1, size: 24 }),
                                                ],
                                                spacing: { after: 200 },
                                            })
                                        ] : []),
            
                                        // Attachments Section (Heading 2)
                                        new Paragraph({
                                            text: "4. Attachments",
                                            heading: HeadingLevel.HEADING_2,
                                            spacing: { after: 200 },
                                        }),
                                        new Paragraph({
                                            children: [
                                                new TextRun({ text: `4.1 Termination Letter: ${TL}`, break: 1, size: 24 }),
                                                new TextRun({ text: `4.2 Severance Package Document: ${SP}`, break: 1, size: 24 }),
                                            ],
                                            spacing: { after: 200 },
                                        }),
                                    ],
                                },
                            ],
                        });
            
                        Packer.toBlob(doc).then(blob => {
                            const fileName = "Termination_Form.docx";
                            saveAs(blob, fileName);
                            console.log(oEvent)
                        });
                    },
                    error: function () {
                        console.error("Failed to retrieve team member size.");
                    },
                });
            
            } else {
                const empNr = this.getView().byId("empnr").getText();
                const empName = this.getView().byId("empname").getText();
                const selectedDate = this.getView().byId("datePicker").getValue();
                const terminationReason = this.getView().byId("terminationReasonComboBox").getValue();
                const email = this.getView().byId("Email").getValue();
               // const directReport = sap.ui.getCore().byId("searchField").getValue();
                const backFill = this.getView().byId("comboBox4").getValue();
                const resigDate = this.getView().byId("resignationDatePicker").getValue();
                const posR = this.getView().byId("comboBox1").getValue();
                const regret = this.getView().byId("comboBox2").getValue();
                const TL = this.getView().byId("terminationLetter").getValue();
                const SP = this.getView().byId("calculationDocument").getValue();
            
                let teamMembersSize = 0;
                const oModel = this.getOwnerComponent().getModel();
                const sUserId = this._sUserId;
            
                oModel.read(`/User('${sUserId}')`, {
                    success: function (oData) {
                        teamMembersSize = oData.teamMembersSize;
            
                        const doc = new Document({
                            sections: [
                                {
                                    properties: {},
                                    children: [
                                        // Main Title (Heading 1)
                                        new Paragraph({
                                            text: "",
                                            heading: HeadingLevel.HEADING_1,
                                            alignment: "center",
                                            children: [
                                                new TextRun({
                                                    text: "Employee Termination Form",
                                                    bold: true,
                                                    underline: true,
                                                    size: 36, // Larger font for main heading
                                                }),
                                            ],
                                            spacing: { after: 300 },
                                        }),
                                        new Paragraph({
                                            text: "", // Horizontal line
                                            border: {
                                                bottom: {
                                                    color: "auto",
                                                    space: 1,
                                                    size: 6,
                                                },
                                            },
                                        }),
            
                                        // Employee Details Section (Heading 2)
                                        new Paragraph({
                                            text: "1. Employee Details",
                                            heading: HeadingLevel.HEADING_2,
                                            spacing: { after: 200 },
                                        }),
                                        new Paragraph({
                                            children: [
                                                new TextRun({ text: `1.1 Employee Number: ${empNr}`, break: 1, size: 24 }),
                                                new TextRun({ text: `1.2 Employee Name: ${empName}`, break: 1, size: 24 }),
                                                new TextRun({ text: `1.3 Last Contract Day: ${selectedDate}`, break: 1, size: 24 }),
                                                
                                            ],
                                            spacing: { after: 200 },
                                        }),
            
                                        // Additional Information Section (Heading 2)
                                        new Paragraph({
                                            text: "2. Additional Information",
                                            heading: HeadingLevel.HEADING_2,
                                            spacing: { after: 200 },
                                        }),
                                        new Paragraph({
                                            children: [
                                                new TextRun({ text: `2.1 Termination Reason: ${terminationReason}`, break: 1, size: 24 }),
                                                ...(terminationReason === "Vol Resignation to Competitor (TERVCOMP)" ? [
                                                    new TextRun({ text: `2.2 Resignation Date: ${resigDate}`, break: 1, size: 24 })
                                                ] : []),
                                                new TextRun({ text: `2.3 Position Remaining: ${posR}`, break: 1, size: 24 }),
                                                new TextRun({ text: `2.4 Regretted Loss: ${regret}`, break: 1, size: 24 }),
                                                new TextRun({ text: `2.5 Position Backfill: ${backFill}`, break: 1, size: 24 }),
                                                new TextRun({ text: `2.6 Email: ${email}`, break: 1, size: 24 }),
                                            ],
                                            spacing: { after: 200 },
                                        }),
            
                                        // Direct Reports Section (Heading 2)
                                        ...(teamMembersSize >= 1 ? [
                                            new Paragraph({
                                                text: "3. Direct Reports",
                                                heading: HeadingLevel.HEADING_2,
                                                spacing: { after: 200 },
                                            }),
                                            new Paragraph({
                                                children: [
                                                    new TextRun({ text: `3.1 Direct Report to: ${directReport}`, break: 1, size: 24 }),
                                                ],
                                                spacing: { after: 200 },
                                            })
                                        ] : []),
            
                                        // Attachments Section (Heading 2)
                                        new Paragraph({
                                            text: "4. Attachments",
                                            heading: HeadingLevel.HEADING_2,
                                            spacing: { after: 200 },
                                        }),
                                        new Paragraph({
                                            children: [
                                                new TextRun({ text: `4.1 Termination Letter: ${TL}`, break: 1, size: 24 }),
                                                new TextRun({ text: `4.2 Severance Package Document: ${SP}`, break: 1, size: 24 }),
                                            ],
                                            spacing: { after: 200 },
                                        }),
                                    ],
                                },
                            ],
                        });
            
                        Packer.toBlob(doc).then(blob => {
                            const fileName = "Termination_Form.docx";
                            saveAs(blob, fileName);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const base64String = reader.result.split(",")[1];
                                console.log("Base64 Uploaded Doc String:", base64String.substring(0, 100));
                                that.uploadToSuccessFactors(base64String, fileName);
                            };
                            reader.readAsDataURL(blob)
                        });
                    },
                    error: function () {
                        console.error("Failed to retrieve team member size.");
                    },
                });
            }

            
        },
        
        
        
        
    
        onGeneratePDF: function () {
            // Create a new jsPDF instance
            const { jsPDF } = window.jspdf;
            var oComboBox = this.getView().byId("terminationReasonComboBox");
            var oSelectedItem = oComboBox.getSelectedItem();
            var sSelectedKey = oSelectedItem.getKey();
            
            if (!jsPDF) {
                console.error("jsPDF is not loaded!");
                return;
            }
            
            const doc = new jsPDF();

            if (this.teamMemberSize >= 1) {
                let empNr = this.getView().byId("empnr").getText();
                let empName = this.getView().byId("empname").getText();
                let selectedDate = this.getView().byId("datePicker").getValue();
                let TL = this.getView().byId("terminationLetter").getValue();
                let SP = this.getView().byId("calculationDocument").getValue();
                let PosR = this.getView().byId("comboBox1").getValue();
                let Regret = this.getView().byId("comboBox2").getValue();
                let directReport = sap.ui.getCore().byId("searchField").getValue();
                let email = this.getView().byId("Email").getValue();
                let TermReason = this.getView().byId("terminationReasonComboBox").getValue();
                let backFill = this.getView().byId("comboBox4").getValue();
                let resigDate = this.getView().byId("resignationDatePicker").getValue();
            
                // Retrieve team members size
                let teamMembersSize = 0; // initialize variable
                const oModel = this.getOwnerComponent().getModel();
                const sUserId = this._sUserId;
            
                oModel.read(`/User('${sUserId}')`, {
                    success: function (oData) {
                        teamMembersSize = oData.teamMembersSize;
            
                        // Define PDF content
                        doc.setFont("Helvetica", "normal");
                        doc.setFontSize(16);
                        doc.text("Termination Form", 20, 20);
                        doc.setDrawColor(0, 0, 0);
                        doc.line(10, 25, 200, 25);  // Line under title
                        
                        // Define text positioning for details
                        doc.setFontSize(12);
                        doc.setTextColor(0); // Reset color to black
            
                        if (sSelectedKey === "TERVCOMP") {
                            // Section: Employee Details
                            doc.setFontSize(14);
                            doc.text("Employee Details", 20, 40);
                            
                            doc.setFontSize(12);
                            doc.setFont("Helvetica", "bold");
                            doc.text("Employee Number:", 20, 50);
                            doc.setFont("Helvetica", "normal");
                            doc.text(empNr, 60, 50);
                            
                            doc.setFont("Helvetica", "bold");
                            doc.text("Employee Name:", 20, 60);
                            doc.setFont("Helvetica", "normal");
                            doc.text(empName, 60, 60);
                            
                            doc.setFont("Helvetica", "bold");
                            doc.text("Last Contract Day:", 20, 70);
                            doc.setFont("Helvetica", "normal");
                            doc.text(selectedDate, 60, 70);
                            
                            // Section: Additional Information
                            doc.setFontSize(14);
                            doc.text("Additional Information", 20, 90);
                            
                            doc.setFontSize(12);
                            doc.setFont("Helvetica", "bold");
                            doc.text("Termination Reason:", 20, 100);
                            doc.setFont("Helvetica", "normal");
                            doc.text(TermReason, 70, 100);
                            
                            doc.setFont("Helvetica", "bold");
                            doc.text("Resignation Date:", 20, 110);
                            doc.setFont("Helvetica", "normal");
                            doc.text(resigDate, 60, 110);
                            
                            doc.setFont("Helvetica", "bold");
                            doc.text("Position Remaining:", 20, 120);
                            doc.setFont("Helvetica", "normal");
                            doc.text(PosR, 70, 120);
                            
                            doc.setFont("Helvetica", "bold");
                            doc.text("Regretted Loss:", 20, 130);
                            doc.setFont("Helvetica", "normal");
                            doc.text(Regret, 60, 130);
                            
                            doc.setFont("Helvetica", "bold");
                            doc.text("Position Backfill:", 20, 140);
                            doc.setFont("Helvetica", "normal");
                            doc.text(backFill, 60, 140);
                            
                            doc.setFont("Helvetica", "bold");
                            doc.text("Email:", 20, 150);
                            doc.setFont("Helvetica", "normal");
                            doc.text(email, 40, 150);
                            
                            // Section: Direct Reports (only if team members size >= 1)
                            if (teamMembersSize >= 1) {
                                doc.setFontSize(14);
                                doc.text("Direct Reports", 20, 170);
                                
                                doc.setFontSize(12);
                                doc.setFont("Helvetica", "bold");
                                doc.text("Direct Report to:", 20, 180);
                                doc.setFont("Helvetica", "normal");
                                doc.text(directReport, 60, 180);
                            }
            
                            // Section: Attachments
                            doc.setFontSize(14);
                            doc.text("Attachments", 20, 200);
                            
                            doc.setFontSize(12);
                            doc.setFont("Helvetica", "bold");
                            doc.text("Termination Letter ID:", 20, 210);
                            doc.setFont("Helvetica", "normal");
                            doc.text(TL, 70, 210);
                            
                            doc.setFont("Helvetica", "bold");
                            doc.text("Severance Pay Document ID:", 20, 220);
                            doc.setFont("Helvetica", "normal");
                            doc.text(SP, 90, 220);
                        } else {
                            // Section: Employee Details
                            doc.setFontSize(14);
                            doc.text("Employee Details", 20, 40);
                            
                            doc.setFontSize(12);
                            doc.setFont("Helvetica", "bold");
                            doc.text("Employee Number:", 20, 50);
                            doc.setFont("Helvetica", "normal");
                            doc.text(empNr, 60, 50);
                            
                            doc.setFont("Helvetica", "bold");
                            doc.text("Employee Name:", 20, 60);
                            doc.setFont("Helvetica", "normal");
                            doc.text(empName, 60, 60);
                            
                            doc.setFont("Helvetica", "bold");
                            doc.text("Last Contract Day:", 20, 70);
                            doc.setFont("Helvetica", "normal");
                            doc.text(selectedDate, 60, 70);
                            
                            // Section: Additional Information
                            doc.setFontSize(14);
                            doc.text("Additional Information", 20, 90);
                            
                            doc.setFontSize(12);
                            doc.setFont("Helvetica", "bold");
                            doc.text("Termination Reason:", 20, 100);
                            doc.setFont("Helvetica", "normal");
                            doc.text(TermReason, 70, 100);
                            
                            doc.setFont("Helvetica", "bold");
                            doc.text("Position Remaining:", 20, 110);
                            doc.setFont("Helvetica", "normal");
                            doc.text(PosR, 70, 110);
                            
                            doc.setFont("Helvetica", "bold");
                            doc.text("Regretted Loss:", 20, 120);
                            doc.setFont("Helvetica", "normal");
                            doc.text(Regret, 60, 120);
                            
                            doc.setFont("Helvetica", "bold");
                            doc.text("Position Backfill:", 20, 130);
                            doc.setFont("Helvetica", "normal");
                            doc.text(backFill, 60, 130);
                            
                            doc.setFont("Helvetica", "bold");
                            doc.text("Email:", 20, 140);
                            doc.setFont("Helvetica", "normal");
                            doc.text(email, 40, 140);
                            
                            // Section: Direct Reports (only if team members size >= 1)
                            if (teamMembersSize >= 1) {
                                doc.setFontSize(14);
                                doc.text("Direct Reports", 20, 170);
                                
                                doc.setFontSize(12);
                                doc.setFont("Helvetica", "bold");
                                doc.text("Direct Report to:", 20, 180);
                                doc.setFont("Helvetica", "normal");
                                doc.text(directReport, 60, 180);
                            }
            
                            // Section: Attachments
                            doc.setFontSize(14);
                            doc.text("Attachments", 20, 200);
                            
                            doc.setFontSize(12);
                            doc.setFont("Helvetica", "bold");
                            doc.text("Termination Letter ID:", 20, 210);
                            doc.setFont("Helvetica", "normal");
                            doc.text(TL, 70, 210);
                            
                            doc.setFont("Helvetica", "bold");
                            doc.text("Severance Pay Document ID:", 20, 220);
                            doc.setFont("Helvetica", "normal");
                            doc.text(SP, 70, 220);
                        }
            
                        // Save the PDF
                        doc.save("Termination_Form.pdf");
                    },
                    error: function () {
                        console.error("Failed to read user data");
                    }
                });
            } else  //main one 
            
            {
            let empNr = this.getView().byId("empnr").getText();
            let empName = this.getView().byId("empname").getText();
            let selectedDate = this.getView().byId("datePicker").getValue();
            let TL = this.getView().byId("terminationLetter").getValue();
            let SP = this.getView().byId("calculationDocument").getValue();
            let PosR = this.getView().byId("comboBox1").getValue();
            let Regret = this.getView().byId("comboBox2").getValue();
           // let directReport = sap.ui.getCore().byId("searchField").getValue();
            let email = this.getView().byId("Email").getValue();
            let TermReason = this.getView().byId("terminationReasonComboBox").getValue();
            let backFill = this.getView().byId("comboBox4").getValue();
            let resigDate = this.getView().byId("resignationDatePicker").getValue();
        
            // Retrieve team members size
            let teamMembersSize = 0; // initialize variable
            const oModel = this.getOwnerComponent().getModel();
            const sUserId = this._sUserId;
        
            oModel.read(`/User('${sUserId}')`, {
                success: function (oData) {
                    teamMembersSize = oData.teamMembersSize;
        
                    // Define PDF content
                    doc.setFont("Helvetica", "normal");
                    doc.setFontSize(16);
                    doc.text("Termination Form", 20, 20);
                    doc.setDrawColor(0, 0, 0);
                    doc.line(10, 25, 200, 25);  // Line under title
                    
                    // Define text positioning for details
                    doc.setFontSize(12);
                    doc.setTextColor(0); // Reset color to black
        
                    if (sSelectedKey === "TERVCOMP") {
                        // Section: Employee Details
                        doc.setFontSize(14);
                        doc.text("Employee Details", 20, 40);
                        
                        doc.setFontSize(12);
                        doc.setFont("Helvetica", "bold");
                        doc.text("Employee Number:", 20, 50);
                        doc.setFont("Helvetica", "normal");
                        doc.text(empNr, 60, 50);
                        
                        doc.setFont("Helvetica", "bold");
                        doc.text("Employee Name:", 20, 60);
                        doc.setFont("Helvetica", "normal");
                        doc.text(empName, 60, 60);
                        
                        doc.setFont("Helvetica", "bold");
                        doc.text("Last Contract Day:", 20, 70);
                        doc.setFont("Helvetica", "normal");
                        doc.text(selectedDate, 60, 70);
                        
                        // Section: Additional Information
                        doc.setFontSize(14);
                        doc.text("Additional Information", 20, 90);
                        
                        doc.setFontSize(12);
                        doc.setFont("Helvetica", "bold");
                        doc.text("Termination Reason:", 20, 100);
                        doc.setFont("Helvetica", "normal");
                        doc.text(TermReason, 70, 100);
                        
                        doc.setFont("Helvetica", "bold");
                        doc.text("Resignation Date:", 20, 110);
                        doc.setFont("Helvetica", "normal");
                        doc.text(resigDate, 60, 110);
                        
                        doc.setFont("Helvetica", "bold");
                        doc.text("Position Remaining:", 20, 120);
                        doc.setFont("Helvetica", "normal");
                        doc.text(PosR, 70, 120);
                        
                        doc.setFont("Helvetica", "bold");
                        doc.text("Regretted Loss:", 20, 130);
                        doc.setFont("Helvetica", "normal");
                        doc.text(Regret, 60, 130);
                        
                        doc.setFont("Helvetica", "bold");
                        doc.text("Position Backfill:", 20, 140);
                        doc.setFont("Helvetica", "normal");
                        doc.text(backFill, 60, 140);
                        
                        doc.setFont("Helvetica", "bold");
                        doc.text("Email:", 20, 150);
                        doc.setFont("Helvetica", "normal");
                        doc.text(email, 40, 150);
                        
                        // Section: Direct Reports (only if team members size >= 1)
                        if (teamMembersSize >= 1) {
                            doc.setFontSize(14);
                            doc.text("Direct Reports", 20, 170);
                            
                            doc.setFontSize(12);
                            doc.setFont("Helvetica", "bold");
                            doc.text("Direct Report to:", 20, 180);
                            doc.setFont("Helvetica", "normal");
                            doc.text(directReport, 60, 180);
                        }
        
                        // Section: Attachments
                        doc.setFontSize(14);
                        doc.text("Attachments", 20, 200);
                        
                        doc.setFontSize(12);
                        doc.setFont("Helvetica", "bold");
                        doc.text("Termination Letter ID:", 20, 210);
                        doc.setFont("Helvetica", "normal");
                        doc.text(TL, 70, 210);
                        
                        doc.setFont("Helvetica", "bold");
                        doc.text("Severance Pay Document ID:", 20, 220);
                        doc.setFont("Helvetica", "normal");
                        doc.text(SP, 90, 220);
                    } else {
                        // Section: Employee Details
                        doc.setFontSize(14);
                        doc.text("Employee Details", 20, 40);
                        
                        doc.setFontSize(12);
                        doc.setFont("Helvetica", "bold");
                        doc.text("Employee Number:", 20, 50);
                        doc.setFont("Helvetica", "normal");
                        doc.text(empNr, 60, 50);
                        
                        doc.setFont("Helvetica", "bold");
                        doc.text("Employee Name:", 20, 60);
                        doc.setFont("Helvetica", "normal");
                        doc.text(empName, 60, 60);
                        
                        doc.setFont("Helvetica", "bold");
                        doc.text("Last Contract Day:", 20, 70);
                        doc.setFont("Helvetica", "normal");
                        doc.text(selectedDate, 60, 70);
                        
                        // Section: Additional Information
                        doc.setFontSize(14);
                        doc.text("Additional Information", 20, 90);
                        
                        doc.setFontSize(12);
                        doc.setFont("Helvetica", "bold");
                        doc.text("Termination Reason:", 20, 100);
                        doc.setFont("Helvetica", "normal");
                        doc.text(TermReason, 70, 100);
                        
                        doc.setFont("Helvetica", "bold");
                        doc.text("Position Remaining:", 20, 110);
                        doc.setFont("Helvetica", "normal");
                        doc.text(PosR, 70, 110);
                        
                        doc.setFont("Helvetica", "bold");
                        doc.text("Regretted Loss:", 20, 120);
                        doc.setFont("Helvetica", "normal");
                        doc.text(Regret, 60, 120);
                        
                        doc.setFont("Helvetica", "bold");
                        doc.text("Position Backfill:", 20, 130);
                        doc.setFont("Helvetica", "normal");
                        doc.text(backFill, 60, 130);
                        
                        doc.setFont("Helvetica", "bold");
                        doc.text("Email:", 20, 140);
                        doc.setFont("Helvetica", "normal");
                        doc.text(email, 40, 140);
                        
                        // Section: Direct Reports (only if team members size >= 1)
                        if (teamMembersSize >= 1) {
                            doc.setFontSize(14);
                            doc.text("Direct Reports", 20, 170);
                            
                            doc.setFontSize(12);
                            doc.setFont("Helvetica", "bold");
                            doc.text("Direct Report to:", 20, 180);
                            doc.setFont("Helvetica", "normal");
                            doc.text(directReport, 60, 180);
                        }
        
                        // Section: Attachments
                        doc.setFontSize(14);
                        doc.text("Attachments", 20, 200);
                        
                        doc.setFontSize(12);
                        doc.setFont("Helvetica", "bold");
                        doc.text("Termination Letter ID:", 20, 210);
                        doc.setFont("Helvetica", "normal");
                        doc.text(TL, 70, 210);
                        
                        doc.setFont("Helvetica", "bold");
                        doc.text("Severance Pay Document ID:", 20, 220);
                        doc.setFont("Helvetica", "normal");
                        doc.text(SP, 70, 220);
                    }
        
                    // Save the PDF
                    doc.save("Termination_Form.pdf");
                },
                error: function () {
                    console.error("Failed to read user data");
                }
            });
            }
           
            // Get data from fields
            
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
            const fourthWiz = sap.ui.getCore().byId("OptionalInfoStep")
            const directR =  sap.ui.getCore().byId("searchField").getValue();

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
                        //console.log("Attachment uploaded successfully, Attachment ID: ", oData.attachmentId); 
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
                        //console.log("Attachment 2 uploaded successfully, Attachment ID: ", oData.attachmentId); 
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
            //console.log(this._sUserId)
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
                            //console.log("MessageBox closed with action: " + oAction);
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

			const oSearchField = sap.ui.getCore().byId("searchField");

            if (oSearchField) {
                oSearchField.getBinding("suggestionItems").filter(aFilters);
                oSearchField.suggest(); // Trigger the suggestion list to open
            }
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
                   // console.log("FOEventReason data:", oData);
        
                    // Filter the data client-side based on the 'event' field
                    const filteredData = oData.results.filter(item => item.event === "3680");
        
                    // Log filtered data to check if filtering worked
                    //console.log("Filtered FOEventReason data:", filteredData);
        
                    // If no data matches the filter, log a warning
                    if (filteredData.length === 0) {
                        //console.warn("No FOEventReason records match the event '3680'");
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
                            text: "{name} ({externalCode})"
                        })
                    });
                },
                error: (oError) => {
                    console.error("Error fetching FOEventReason data", oError);
                    sap.m.MessageBox.show("Error fetching termination reason", {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Warning!"
                    });
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

         // #region onCancel
         _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						this._handleNavigationToStep(0);
						this._wizard.discardProgress(this._wizard.getSteps()[0]);
                        this.getView().byId("datePicker").setDateValue(null)
                        this.getView().byId("terminationLetter").setValue("")
                        this.getView().byId("calculationDocument").setValue("")
                        this.getView().byId("terminationReasonComboBox").setValue("")
                        this.getView().byId("resignationDatePicker").setValue("")
                        this.getView().byId("comboBox1").setValue("")
                        this.getView().byId("comboBox4").setValue("")
                        this.getView().byId("comboBox2").setValue("")
                        this.getView().byId("Email").setValue("")
                        sap.ui.getCore().byId("searchField").setValue("")
					}
				}.bind(this)
			});
		},

        handleWizardCancel: function () {
			this._handleMessageBoxOpen("Are you sure you want to cancel the form?", "warning");
		},

         // #endregion


        // #region Send Termination details to custom MDF
        submitForm: async function() {
            const that = this;
            let EmpNr = that.getView().byId("empnr").getText();
            let EmpName = that.getView().byId("empname").getText();

            let PosR = that.getView().byId("comboBox1").getValue();
            let Regret = that.getView().byId("comboBox2").getValue();
            let directReport = sap.ui.getCore().byId("searchField").getValue();
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
                    
                    if (PosR === "TERVCOMP") {
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
                            "cust_ResignationDate" : null,
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
                    sap.m.MessageBox.show("Error in form submission", {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Warning!"
                    });
                }
            });
    
        } 
            catch (error) 
                 {
                    console.error("Error uploading attachment:", error);
                    sap.m.MessageBox.show("Error uploading attachments", {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Warning!"
                    });
                 }
                 
        }

        else
        {
              console.error("No file data available for upload.");
              sap.m.MessageBox.show("No file data available for upload.", {
                icon: sap.m.MessageBox.Icon.ERROR,
                title: "Warning!"
            });
        }
      }
    })
});
  // #endregion