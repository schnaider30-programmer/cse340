const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const accountValidation = require("../utilities/account-validation");

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.post(
  "/login",
  accountValidation.LoginRules(),
  accountValidation.checkLoginData,
  (req, res) => {
    res.status(200).send("Login process");
  },
);

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister),
);

router.post(
  "/register",
  accountValidation.registrationRules(),
  accountValidation.checkRegData,
  utilities.handleErrors(accountController.registerAccount),
);

module.exports = router;
