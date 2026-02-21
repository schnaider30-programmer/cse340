const pool = require("../database/");

/* ********************
 *   Get all classification data
 * ********************* */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name",
  );
}

/* *******************
 *  Get all inventory items and classification_name by classification_id
 *  ***************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM public.inventory AS i 
            JOIN public.classification AS c 
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1;`,
      [classification_id],
    );
    return result;
  } catch (error) {
    console.log("getclassificationbyid error " + error.message);
  }
}

async function getVehiclesByInventoryId(inventory_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inventory_id],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Get Inventory Data Fails! Error: " + error.message);
  }
}

async function addNewClassification(classification_name) {
  const sql =
    "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
  try {
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    console.log("Add New Classification Fails! Error: " + error.message);
  }
}

async function addNewVehicle(
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
) {
  const sql =
    "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
  try {
    const result = await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Add new Vehicle Fails. Error: " + error.message);
  }
}

async function updateInventory(
  classification_id,
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
) {
  const sql =
    "UPDATE inventory SET classification_id = $1, inv_make = $2, inv_model = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_year = $8, inv_miles = $9, inv_color = $10 WHERE inv_id = $11 RETURNING *";
  try {
    const result = await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Update Vehicle Fails. Error: " + error.message);
  }
}

async function deleteInventory(inv_id) {
  const sql = " DELETE FROM inventory WHERE inv_id = $1 RETURNING *";
  try {
    const result = await pool.query(sql, [inv_id]);
    return result;
  } catch (error) {
    throw new Error("Delete Inventory Fails. Error: " + error.message);
  }
}

async function recordMaintenance(
  maint_type,
  maint_desc,
  maint_cost,
  maint_responsible,
  maint_date,
  maint_next_due_date,
  inv_id,
) {
  try {
    const sql =
      "INSERT INTO maintenance(maint_type, maint_desc, maint_cost, maint_responsible, maint_date, maint_next_due_date, inv_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;";
    const result = await pool.query(sql, [
      maint_type,
      maint_desc,
      maint_cost,
      maint_responsible,
      maint_date,
      maint_next_due_date,
      inv_id,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error inserting maintenance record. " + error.message);
  }
}

async function getMaintenanceByInventoryId(inv_id) {
  try {
    const sql =
      "SELECT i.inv_make, i.inv_model, i.inv_year, m.* FROM inventory AS i JOIN maintenance as m ON i.inv_id = m.inv_id WHERE m.inv_id = $1;";
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    throw new Error("Query Maintenance History Fails. " + error.message);
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehiclesByInventoryId,
  addNewClassification,
  addNewVehicle,
  updateInventory,
  deleteInventory,
  recordMaintenance,
  getMaintenanceByInventoryId,
};
