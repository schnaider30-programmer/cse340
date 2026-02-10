const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()


async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.status(200).render("account/management", {
    title: "Account Management",
    nav, 
    errors: null,
  })
}

/* ********************************
 *  Deliver login view
 *  ******************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.status(200).render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.status(200).render("account/register", {
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

  //Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration",
    );
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  );

  if (regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulation, you're register ${account_firstname}. Please login`,
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice error", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }
}

/* *******************
 * Process login request
 * ******************* */

async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice error", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email
    })
    return
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete (accountData.account_password)
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
      } else {
        res.cookie("jwt", accessToken, {httpOnly: true,secure: true, maxAge: 3600 * 1000})
      }
      return res.redirect("/account")
    } else {
      req.flash("notice error", "Please check your email or password and try again!")
      res.status(400).render("account/login", {
        title: "login",
        nav, 
        errors: null,
        account_email
      })
    }
  } catch (error) {
    throw new Error("'Access forbiden")
  }
}

/* *******************
 * Process Update request
 * ******************* */

async function buildUpdateView(req, res) {
  let nav = await utilities.getNav()
  res.status(200).render("account/update-account", {
    title: "Update Account",
    nav, 
    errors: null,
    accountData: res.locals.accountData
  })
}

/* *******************
 * Process Update request
 * ******************* */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)
  const COOKIE_MAX = 3600 * 1000
  if (updateResult) {
    const accountData = await accountModel.getAccountById(account_id)
    delete (accountData.account_password)
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: COOKIE_MAX})
    if (process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, {httpOnly: true, maxAge: COOKIE_MAX})
    } else {
      res.cookie("jwt", accessToken, {httpOnly: true,  secure: true, maxAge: COOKIE_MAX})
    }
    req.flash("notice", "Congratulations! Your information has been updated!")
    res.redirect("/account/")
  } else {
    const accountData = { account_firstname: account_firstname, account_lastname: account_lastname, account_email: account_email, account_id: account_id}
    req.flash("notice error", "Your update has failed. Please try again!")
    res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null, 
      accountData,
    })
  }
}

async function updatePassword(req, res) {
  const { account_password, account_id } = req.body
  try {
    let hashedPassword = await bcrypt.hash(account_password, 10) 
    const updateResult = await accountModel.updatePassword(hashedPassword, account_id)
    if (updateResult) {
      req.flash("notice", "Great! Your password has been updated!")
      res.redirect("/account/")
    } else {
      req.flash("notice error", "We're sorry, please try again! Update failed!")
      res.redirect("/account/update")
    }
  } catch (error) {
    req.flash("notice error", "An unexpected error occurred during password update.")
    res.redirect("/account/update")
  }
}

/* ********************************************************
 *   deletes the token cookie and returns the client to the home view
 *  ******************************************************* */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  res.redirect("/")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, buildUpdateView, updateAccount, updatePassword, accountLogout};
