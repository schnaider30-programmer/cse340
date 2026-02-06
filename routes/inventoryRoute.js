//Needed Ressources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

router.get("/", (req, res, next) => {
  res.status(200).send('Login process')
})

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId),
); //function within the invController that will be used to fulfill the request sent by the route.

router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId),
);

module.exports = router;
