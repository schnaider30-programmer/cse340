const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const accountValidation = require("../utilities/account-validation");

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.post(
  "/login",
  accountValidation.LoginRules(),
  accountValidation.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
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

router.get("/update", utilities.handleErrors(accountController.buildUpdateView))

router.post("/update", accountValidation.updateUserRules(), accountValidation.checkUpdateUserData, utilities.handleErrors(accountController.updateAccount))

router.post("/update-password", accountValidation.updatePasswordRules(), accountValidation.checkPasswordData, utilities.handleErrors(accountController.updatePassword))

router.get("/logout", utilities.handleErrors(accountController.accountLogout))


module.exports = router;
