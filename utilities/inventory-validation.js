const utilities = require("./index");
const { body, validationResult } = require("express-validator");
const validate = {};

validate.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .isLength({ min: 1 }).withMessage("Classification name cannot be empty")
      .isAlpha()
      .withMessage("Please provide a correct classification name"),
  ];
};

validate.addInventoryRules = () => {
    return [
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please choose where to add new vehicle"),
        
        body("inv_make")
            .trim()
            .escape()
            .notEmpty().withMessage("Make cannot be empty")
            .bail()
            .isLength({ min: 3 }).withMessage("Make must have at least 3 characters"), 
        
        body("inv_model")
            .trim()
            .escape()
            .notEmpty().withMessage("Model cannot be empty")
            .bail()
            .isLength({ min: 3 }).withMessage("Model must have at least 3 characters"),
        
        body("inv_description")
            .trim()
            .escape()
            .notEmpty().withMessage("Please provide a description for the vehicle"),
        
        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide and image path"),
        
        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide and thumbnail path"),        
        
        body("inv_price")
            .trim()
            .escape()
            .notEmpty().withMessage("Price field cannot be empty")
            .bail()
            .isDecimal({decimal_digits: "1,2", force_decimal: false}).withMessage("Price must a numeric value"),
        
        body("inv_year")
            .trim()
            .escape()
            .notEmpty().withMessage("Year field cannot be empty")
            .bail()
            .isNumeric({ no_symbols: true }).withMessage("Year must be a numeric value only")
            .bail()
            .isLength({ discreteLengths: 4 }).withMessage("Year must be four digits"),
        
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty().withMessage("Miles field cannot be empty")
            .bail()
            .isNumeric({ no_symbols: true }).withMessage("Miles must be a numeric value only"),
        
        body("inv_color")
            .trim()
            .escape()
            .notEmpty().withMessage("Please provide a color")
            .bail()
            .isAlpha().withMessage("Color only accept alphabetic character"),
    ]
}

validate.maintenanceRules = () => {
    return [
        body("maint_type")
            .trim()
            .escape()
            .notEmpty().withMessage("Maintenance type cannot be empty.")
            .bail()
            .isLength({ min: 3, max: 50 }).withMessage("Maintenance can only be between 3 and 50 characters.")
            .bail()
            .matches(/^[A-Za-z0-9\s\-]+$/).withMessage("Maintenance type can only be letters, space, and hyphens."),

        body("maint_desc")
            .trim()
            .escape()
            .notEmpty().withMessage("Please give a description for this maintenance.")
            .bail()
            .isLength({ max: 100 }).withMessage("Description can only be 100 characters long."),
        
        body("maint_cost")
            .trim()
            .notEmpty().withMessage("Maintenance cost is required.")
            .bail()
            .isDecimal({ decimal_digits: "1,2", force_decimal: true }).withMessage("Cost must be a numeric value only.")
            .bail()
            .isLength({ max: 10 }).withMessage("Cost value is too long."),
        
        body("maint_responsible")
            .trim()
            .escape()
            .notEmpty().withMessage("Responsible person is required.")
            .bail()
            .isLength({ min: 2, max: 50 }).withMessage("Responsible name must be between 2 and 50 characters.")
            .bail()
            .matches(/^[a-zA-Z\s '-]+$/).withMessage("Responsible name can only contain letters, spaces, apostrophes, and hyphens."),
    
        body("maint_date")
            .trim()
            .notEmpty().withMessage("Maintenance date is required.")
            .bail()
            .isISO8601().withMessage("Please provide a valid date in YYYY-MM-DD format."),
        
        body("maint_next_due_date")
            .trim()
            .notEmpty().withMessage("Maintenance next scheduled date is required.")
            .bail()
            .isISO8601().withMessage("Next due date must be a valid date in YYYY-MM-DD format."),
        

        body("inv_id")
            .trim()
            .notEmpty().withMessage("Vehicle ID was not found.")
            .bail()
            .isInt().withMessage("Vehicle ID must be a positive number."),      
    ]  
}



validate.checkInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color } = req.body

    let nav = await utilities.getNav()
    let list = await utilities.classificationList(classification_id)

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render("inventory/add-inventory", {
            title: "Add New Vehicle",
            errors, 
            nav, list, inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color
        })
        return
    }
    next()
}

validate.checkUpdateData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color, inv_id } = req.body

    let nav = await utilities.getNav()
    let list = await utilities.classificationList(classification_id)
    itemName = `${inv_make} ${inv_model}`
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render("inventory/edit-inventory", {
            title: `Update ${itemName}`,
            errors, 
            nav, list, inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color, inv_id
        })
        return
    }
    next()
}

validate.checkClassificationData = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,
      classification_name,
    });
    return;
  }
  next();
};

validate.checkMaintenanceData = async function (req, res, next) {
    let nav = utilities.getNav()
    const { item_name, maint_type, maint_desc, maint_cost, maint_responsible, maint_date, maint_next_due_date, inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render("inventory/maintenance", {
            title: "Car Maintenance",
            nav, 
            itemName: item_name,
            maint_type, 
            errors,
            maint_desc,
            maint_cost,
            maint_responsible, 
            maint_date,
            maint_next_due_date,
            inv_id,
        })
        return
    }
    next()
}

module.exports = validate;
