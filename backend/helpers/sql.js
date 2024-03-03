const { BadRequestError } = require("../expressError");

/**
 * Takes in an object containing data to be updated and a mapping of JavaScript to SQL column names.
 *
 * @param {Object} dataToUpdate - Data to be updated in the database.
 * @param {Object} jsToSql - Mapping of JavaScript object keys to SQL column names.
 * @returns {Object} - An object containing the SQL set clause and values for a partial update.
 * @throws {BadRequestError} - If no data is provided for the update.
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
