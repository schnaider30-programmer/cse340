const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

/* *********************************
 *  Registration Data Validation Rules
 *  ******************************** */

validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      // .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      // .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists =
          await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error("Email exist. Please log in or use different email");
        }
      }),

    body("account_password")
      .trim()
      .escape()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* *********************************
 *  Login Data Validation Rules
 *  ******************************** */

validate.LoginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email."),

    body("account_password")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Password is required"),
  ];
};

/* *****************************
 *  Check data and return or continue to registration
 *  ******************* */
validate.checkRegData = async function (req, res, next) {
  const { account_firstname, account_lastname, account_email } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* *****************************
 *  Check data and return or continue to Login
 *  ******************* */
validate.checkLoginData = async function (req, res, next) {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = utilities.getNav();
    res.render("account/login", {
      nav,
      title: "Login",
      errors,
      account_email,
    });
    return;
  }
  next();
};

/* *********************************
 *  Login Data Validation Rules
 *  ******************************** */

validate.updateUserRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("First name cannot be empty when updating!"),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Last name cannot be empty when updating."),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Email field cannot be empty!")
      .bail()
      .isEmail()
      .withMessage("Please enter a valid email!")
      .bail()
      .normalizeEmail()
      .withMessage("Please enter a valid email!")
      .custom(async (account_email, { req }) => {
        const emailExists = await accountModel.getAccountByEmail(account_email);
        if (
          emailExists &&
          emailExists.account_id !== parseInt(req.body.account_id)
        ) {
          throw new Error(
            "Email already exists. Please choose a different email address!",
          );
        }
      }),
  ];
};

validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .escape()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

validate.checkUpdateUserData = async function (req, res, next) {
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  let errors = [];
  const accountData = {
    account_firstname: account_firstname,
    account_lastname: account_lastname,
    account_email: account_email,
    account_id: account_id,
  };
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = utilities.getNav();
    req.flash("notice error", "Requirements are not meet. Please try again!");
    res.render("account/update-account", {
      nav,
      title: "Account Update",
      errors,
      accountData,
    });
    return;
  }
  next();
};

validate.checkPasswordData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("notice error", "Password does not meet requirement.");
    res.redirect("/account/update");
  } else {
    next();
  }
};

module.exports = validate;
