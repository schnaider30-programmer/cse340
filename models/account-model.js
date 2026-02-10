const pool = require("../database");

/*  ***************************
 *  Register new account
 *  *************************** */

async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password,
) {
  try {
    const sql =
      "INSERT INTO account ( account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
* Return account data using email address
* ***************************** */

async function getAccountByEmail(account_email) {
  try {
    const sql = 'SELECT account_id, account_firstname, account_lastname, account_email, account_password, account_type FROM account WHERE account_email = $1'
    const result = await pool.query(sql, [account_email])
    return result.rows[0]
  } catch (error) {
      throw new Error ("No matching email found" + error.message)
  }
}

/* *****************************
* Return account data using Account_Id
* ***************************** */

async function getAccountById(account_id) {
  try {
    const sql = 'SELECT account_id, account_firstname, account_lastname, account_email, account_password, account_type FROM account WHERE account_id = $1'
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
  } catch (error) {
      throw new Error ("No matching email found" + error.message)
  }
}

/* *****************************
* Update account
* ***************************** */
async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
  try {
    const sql = 'UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *;'
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    return result.rows[0]
  } catch (error) {
      throw new Error ("No account found. Error:" + error.message)
  }
}

/* *****************************
* Update account Password With hashed password
* ***************************** */
async function updatePassword(hashedPassword, account_id) {
  try {
    const sql = 'UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *;'
    const query = await pool.query(sql, [hashedPassword, account_id])
    return query.rows[0]
  } catch (error) {
    throw new Error("Could not update password. Error:" + error.message)
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail,getAccountById, updateAccount, updatePassword };
