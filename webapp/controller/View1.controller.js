sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, Fragment, MessageToast, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit() {},

        onProductPress: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oContext = oItem.getBindingContext("Products");
            const sProductID = oContext.getProperty("ID");
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Detail", { productID: sProductID });
        },

        onAddProduct: function () {
            const oView = this.getView();

            if (!this.pDialog) {
                this.pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "project1.view.fragment.AddProduct",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this.pDialog.then(oDialog => oDialog.open());
        },

        onSaveProduct: function () {
            const oView = this.getView();
            const oModel = oView.getModel("Products");
            const aProducts = oModel.getData().Products;

            const sName = oView.byId("NameInput").getValue(),
                  sCategory = oView.byId("CategoryInput").getValue(),
                  sManufacturer = oView.byId("ManufacturerInput")?.getValue() || "",
                  sPrice = oView.byId("PriceInput").getValue(),
                  sStock = oView.byId("StockInput")?.getValue() || "0",
                  sDescription = oView.byId("DescriptionInput")?.getValue() || "";

            if (!sName || !sCategory || !sPrice) {
                MessageToast.show("Please fill in required fields.");
                return;
            }

            const newProduct = {
                ID: (aProducts.length + 1).toString(),
                Name: sName,
                Category: sCategory,
                Manufacturer: sManufacturer,
                Price: sPrice,
                Stock: sStock,
                Description: sDescription
            };

            aProducts.push(newProduct);
            oModel.setProperty("/Products", aProducts);

            MessageToast.show("Product added!");
            this._clearForm();
            this.onCancelProduct();
        },

        onCancelProduct: function () {
            this.pDialog.then(oDialog => oDialog.close());
            this._clearForm();
        },

        _clearForm: function () {
            const oView = this.getView();
            const aInputs = [
                "NameInput",
                "CategoryInput",
                "ManufacturerInput",
                "PriceInput",
                "StockInput",
                "DescriptionInput"
            ];

            aInputs.forEach(sId => {
                const oInput = oView.byId(sId);
                if (oInput) {
                    oInput.setValue("");
                    oInput.setValueState("None");
                }
            });
        },

        onDeleteProduct: function () {
            const oTable = this.getView().byId("table");
            const aSelectedItems = oTable.getSelectedItems();

            const oModel = this.getView().getModel("Products");
            const aProducts = oModel.getProperty("/Products");

            aSelectedItems.forEach(oItem => {
                const sProductID = oItem.getBindingContext("Products").getProperty("ID");
                const iIndex = aProducts.findIndex(p => p.ID === sProductID);
                if (iIndex !== -1) {
                    aProducts.splice(iIndex, 1);
                }
            });

            oModel.setProperty("/Products", aProducts);
            oTable.removeSelections(true);
            this.getView().byId("removeProductBtn").setEnabled(false);

            MessageToast.show("Product deleted successfully.");
        },

        onItemSelected: function () {
            const oTable = this.getView().byId("table");
            const aSelectedItems = oTable.getSelectedItems();
            const oRemoveBtn = this.getView().byId("removeProductBtn");

            oRemoveBtn.setEnabled(aSelectedItems.length > 0);
        },

        onFilterChange: function () {
            const oView = this.getView();
            const oTable = oView.byId("table");

            const sName = oView.byId("idNameInput").getValue();
            const sCategory = oView.byId("idCategoryInput").getValue();
            const sManufacturer = oView.byId("idManufacturerInput")?.getValue();
            const sPrice = oView.byId("idPriceInput")?.getValue();
            const sStock = oView.byId("idStockInput")?.getValue();
            const sDescription = oView.byId("idDescriptionInput")?.getValue();
            const aFilters = [];

            if (sName) {
                aFilters.push(new Filter("Name", FilterOperator.Contains, sName));
            }

            if (sCategory) {
                aFilters.push(new Filter("Category", FilterOperator.Contains, sCategory));
            }

            if (sManufacturer) {
                aFilters.push(new Filter("Manufacturer", FilterOperator.Contains, sManufacturer));
            }

            if (sPrice) {
                aFilters.push(new Filter("Price", FilterOperator.Contains, sPrice));
            }

            if (sStock) {
                aFilters.push(new Filter("Stock", FilterOperator.Contains, sStock));
            }
            
            if (sDescription) {
                aFilters.push(new Filter("Description", FilterOperator.Contains, sDescription));
            }

            const oBinding = oTable.getBinding("items");
            if (oBinding) {
                oBinding.filter(aFilters);
            }
        },
        onShowStats: function() {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Stats");
          }
    });
});
