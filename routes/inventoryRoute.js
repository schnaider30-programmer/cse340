//Needed Ressources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidation = require("../utilities/inventory-validation");

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
  utilities.handleErrors(invController.AddClassificationForm),
);

router.post(
  "/add-classification",
  invValidation.addClassificationRules(),
  invValidation.checkClassificationData,
  utilities.handleErrors(invController.addClassification),
);

router.get("/add-inventory", utilities.handleErrors(invController.inventoryAddForm))

router.post("/add-inventory", 
  invValidation.addInventoryRules(),
  invValidation.checkInventoryData,
  utilities.handleErrors(invController.saveNewInventory)
)

router.get("/", utilities.handleErrors(invController.buildManagementView));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditInventoryView))

router.post("/update/",
  invValidation.addInventoryRules(),
  invValidation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)


module.exports = router;
