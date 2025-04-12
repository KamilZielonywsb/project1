sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], (Controller, JSONModel, MessageToast) => {
    "use strict";

    return Controller.extend("project1.controller.Detail", {

        onInit: function () {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Detail").attachPatternMatched(this._onProductMatched, this);

            let oEditModel = new JSONModel({
                editMode: false
            });
            this.getView().setModel(oEditModel, "editModel");
        },

        _onProductMatched: function (oEvent) {
            let sProductID = oEvent.getParameter("arguments").productID,
                oModel = this.getView().getModel("Products"),
                aProducts = oModel.getProperty("/Products"),
                oProduct = aProducts.find(p => p.ID === sProductID),
                oProductModel = new JSONModel(oProduct);

            this.getView().setModel(oProductModel, "productModel");
        },

        onBackPress: function () {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteView1");
        },

        onEditPress: function () {
            this.getView().getModel("editModel").setProperty("/editMode", true);
        },

        onSavePress: function () {
            let oProductModel = this.getView().getModel("productModel"),
                oProductData = oProductModel.getData();

            let oProductsModel = this.getView().getModel("Products"),
                aProducts = oProductsModel.getProperty("/Products");

            let iIndex = aProducts.findIndex(p => p.ID === oProductData.ID);
            if (iIndex !== -1) {
                aProducts[iIndex] = oProductData;
            }

            oProductsModel.setProperty("/Products", aProducts);
            this.getView().getModel("editModel").setProperty("/editMode", false);
            MessageToast.show("Product details saved successfully.");
        },

        onCancelPress: function () {
            let oProductModel = this.getView().getModel("productModel"),
                oProductData = oProductModel.getData();

            let oModel = this.getView().getModel("Products"),
                aProducts = oModel.getProperty("/Products"),
                oOriginalProduct = aProducts.find(p => p.ID === oProductData.ID);

            oProductModel.setData(oOriginalProduct);
            this.getView().getModel("editModel").setProperty("/editMode", false);
            MessageToast.show("Changes canceled.");
        }

    });
});