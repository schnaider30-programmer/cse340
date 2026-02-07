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
            .isNumeric().withMessage("Price must a numeric value"),
        
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

module.exports = validate;
