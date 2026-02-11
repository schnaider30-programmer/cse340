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
  if (data && data.rowCount > 0) {
    const grid = await utilities.buildClassificationGrid(data.rows);
    let nav = await utilities.getNav();
    const className = data.rows[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } else {
    const grid = await utilities.buildClassificationGrid(data.rows)
    let nav = await utilities.getNav()
    // const className = data.rows[0].classification_name;
    res.render("inventory/classification", {
      title: "No Vehicles Foud",
      nav,
      grid
    })
  }

};

/* *************************
 *  Build Vehicle view by inventory id
 *  *************************/
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const vehicle = await invModel.getVehiclesByInventoryId(inventory_id);
  const detailsView = await utilities.buildVehiclesDetailsView(vehicle);
  const vehicleName =
    vehicle.inv_year +
    " " +
    vehicle.inv_make +
    " " +
    vehicle.inv_model;
  let nav = await utilities.getNav();
  res.render("inventory/details", {
    title: vehicleName,
    nav,
    detailsView,
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
  const classificationSelect = await utilities.classificationList()
  try {
    const result = await invModel.addNewClassification(classification_name);
    let nav = await utilities.getNav();

    if (result) {
      req.flash(
        "notice",
        `The new classification name "${classification_name}" was successfully added.`,
      );
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
        classificationSelect,
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
        errors: null,
      });
    }
  } catch (error) {
    console.error("Error adding classification:", error)
    req.flash( "notice error", "A server error occurred while adding classification.",);
    res.status(500).render("inventory/add-classification", {
      title: "Add new Classification",
      nav,
      classification_name,
      errors: null,
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


invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationSelect = await utilities.classificationList()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect
  });
};

/* *********************************
 *  Form to add new item in inventory
 *  ********************************* */

invCont.saveNewInventory = async function (req, res, next) {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

  let nav = await utilities.getNav()
  let  classificationSelect = await utilities.classificationList()

  try {
    const result = await invModel.addNewVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
    
    if (result) {
      req.flash("notice", "A new vehicle was successfully added to inventory")

      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav, 
        classificationSelect
      })
    } else {
      req.flash("notice error", "No vehicle added. Please try again")
      res.render("inventory/add-inventory", {
        title: "Add New Vehicle",
        classificationSelect, nav, inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color,
        errors: null,
        
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

invCont.updateInventory = async function (req, res, next) {
  const { classification_id, inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

  let nav = await utilities.getNav()
  let list = await utilities.classificationList()

  try {
    const updateResult = await invModel.updateInventory(classification_id, inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
    console.log(updateResult)
    if (updateResult) {
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", `The ${itemName} was successfully updated.`)

      res.redirect("/inv/")
      
    } else {
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice error", "We're sorry. Your update failed. Please try again")
      res.render("inventory/edit-inventory", {
        title: `Update ${itemName}`,
        list, nav, inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color, inv_id,
        errors: null
      })
    }

  } catch (error) {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice error", "A server error occurred while updating inventory.")
    res.status(500).render("inventory/edit-inventory", {
      title: `Update ${itemName}`,
      list, nav, inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color, inv_id,
      errors: null
    })
    console.error(`Error: ${error}`)
  }
}

invCont.getInventoryJSON = async function (req, res, next) {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***********************
 *  Build Edit Inventory Management View
 *  *********************** */

invCont.buildEditInventoryView = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehiclesByInventoryId(inventory_id);
  const list = await utilities.classificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/edit-inventory", {
    title: `Update ${itemName}`,
    nav,
    list,
    itemName,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_year: itemData.inv_year,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    errors: null,
  })
}

/* ********************************** 
 *  Build Delete Item Confirmation View 
 *  Unit 5 - Team Activity
 * *********************************** */

invCont.deleteItemView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)
  const itemData = await invModel.getVehiclesByInventoryId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("inventory/delete-confirm", {
    title: `Delete ${itemName}`,
    nav,
    itemName,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_price: itemData.inv_price,
    inv_year: itemData.inv_year,
    inv_id,
    errors: null
  })
}
/* *******************************************
  * Delete Item 
  * ******************************************** */

invCont.deleteItem = async function (req, res, next) {
  let { inv_id, inv_make, inv_model } = req.body
  inv_id = parseInt(inv_id)
  const itemName = `${inv_make} ${inv_model}`
  const deleteResult = await invModel.deleteInventory( inv_id )

  if (deleteResult) {
    req.flash("notice", `${itemName} was successfully deleted.`)

    res.redirect("/inv/")
    
  } else {
    req.flash("notice error", "We're sorry. Your deletion failed. Please try again")
    res.redirect(`/inv/delete/${inv_id}`)
  }
}

module.exports = invCont;
