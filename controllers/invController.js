const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* *******************
 *  Build inventory by classification view
 *  ******************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const vehicle = await invModel.getVehiclesByInventoryId(inventory_id);
  const detailsView = await utilities.buildVehiclesDetailsView(vehicle[0]);
  const vehicleName =
    vehicle[0].inv_year +
    " " +
    vehicle[0].inv_make +
    " " +
    vehicle[0].inv_model;
  let nav = await utilities.getNav();
  res.render("inventory/details", {
    title: vehicleName,
    nav,
    detailsView,
  });
};

module.exports = invCont;
