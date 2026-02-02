const utilities = require("../utilities");
const accountModel = require("../models/account-model");

/* ********************************
 *  Deliver login view
 *  ******************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
*  Process Registration
* *************************************** */

async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  );

  if (regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulation, you're register ${account_firstname}. Please login`,
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice red", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
    });
  }
}

module.exports = { buildLogin, buildRegister, registerAccount };
