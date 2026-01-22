//Needed Ressources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

router.get("/type/:classificationId", invController.buildByClassificationId); //function within the invController that will be used to fulfill the request sent by the route.

module.exports = router;