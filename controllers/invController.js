const { utils } = require("prettier/doc.js");
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

/* *************************
 *  Build Vehicle view by inventory id
 *  *************************/
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

invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
  });
};

invCont.AddClassificationForm = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add new Classification",
    nav,
    errors: null,
  });
};

invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  try {
    const result = await invModel.addNewClassification(classification_name);
    let nav = await utilities.getNav();

    if (result.rowCount === 1) {
      req.flash(
        "notice",
        `The new classification name "${classification_name}" was successfully added.`,
      );
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
      });
    } else {
      req.flash(
        "notice error",
        "No classification was added. Please try again.",
      );
      res.status(500).render("inventory/add-classification", {
        title: "Add new Classification",
        nav,
        classification_name,
      });
    }
  } catch (error) {
    console.error("Error adding classification:", error)
    req.flash( "notice error", "A server error occurred while adding classification.",);
    res.status(500).render("inventory/add-classification", {
      title: "Add new Classification",
      nav,
      classification_name,
    });
  }
};

invCont.inventoryAddForm = async function (req, res) {
  let nav = await utilities.getNav()
  let list = await utilities.classificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    list,
    errors: null,
  })
}

invCont.saveNewInventory = async function (req, res, next) {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

  let nav = await utilities.getNav()
  let list = await utilities.classificationList(classification_id)

  try {
    const result = await invModel.addNewVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
    
    if (result.rowCount == 1) {
      req.flash("notice", "A new vehicle was successfully added to inventory")

      res.status(201).render("inventory/management", {
        title: "Vehicle Management", 
        nav
      })
    } else {
      req.flash("notice error", "No vehicle added. Please try again")
      res.render("inventory/add-inventory", {
        title: "Add New Vehicle",
        list, nav, inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color,
        errors: null
      })
    }

  } catch (error) {
    req.flash("notice error", "A server error occurred while adding vehicle.")
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      list, nav, inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color,
      errors: null
    })
    console.error(`Error: ${error}`)
  }
}

module.exports = invCont;
