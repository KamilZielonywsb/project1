sap.ui.define([
    "sap/ui/core/mvc/Controller"
  ], function (Controller) {
    "use strict";
  
    return Controller.extend("project1.controller.Stats", {
      onInit: function () {
      },
      onShowStats: function() {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("Stats");
      },
      onBackPress: function () {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteView1");
    }
    });
  });
  