//Needed Ressources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidation = require("../utilities/inventory-validation");
const { util } = require("prettier");

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId),
); //function within the invController that will be used to fulfill the request sent by the route.

router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId),
);

router.get(
  "/add-classification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.AddClassificationForm),
);

router.post(
  "/add-classification",
  invValidation.addClassificationRules(),
  invValidation.checkClassificationData,
  utilities.handleErrors(invController.addClassification),
);

router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.inventoryAddForm))

router.post("/add-inventory", 
  invValidation.addInventoryRules(),
  invValidation.checkInventoryData,
  utilities.handleErrors(invController.saveNewInventory)
)

router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagementView));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inventory_id", utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventoryView))

router.post("/update/",
  invValidation.addInventoryRules(),
  invValidation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteItemView))

router.post("/delete/", utilities.checkAccountType, utilities.handleErrors(invController.deleteItem))

router.get("/maintenance/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildMaintenanceView))

router.post("/maintenance",
  utilities.checkAccountType,
  invValidation.maintenanceRules(),
  invValidation.checkMaintenanceData,
  utilities.handleErrors(invController.recordMaintenance
))

router.get("/maintenance-history/:inv_id", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildHistoryTable)
)

module.exports = router;
