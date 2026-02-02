const invModel = require("../models/inventory-model");
const Util = {};

/* ****************
 * Conctructs the nav HTML unordered list
 ******************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* *****************
 *  Build the classification view HTML
 *  ****************** */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt = "Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **********************************
 *  Middleware For Handling Errors
 *  Wrap other function in this for
 *  General Error Handling
 * **********************/
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// A function1  (function2) that take another function as parameter. It returns another function3 [ a middleware because of parameters (req, res, next) ].

// Inside this function3 the function2 is executed with function3 parameters
// We wrap this function2 inside Promise.resolve to ensure that it will always be a promise
// If an error occurs, we catch it and pass it to the next() method

/* ****************************
 * Build the Detail View Html
 * ****************************/
Util.buildVehiclesDetailsView = async function (item) {
  let grid = "";
  if (item) {
    grid += '<section class="container">';
    grid += `
        <div class="vehicle-image">
            <img src="${item.inv_image}" alt="${item.inv_make} ${item.inv_model} ${item.inv_year} Vehicle">
        </div>
        <div class="vehicle-detail">
        <h2>${item.inv_make} ${item.inv_model} Details</h2>
            <p><span class="title">Price:</span> $${new Intl.NumberFormat("en-US").format(item.inv_price)}</p>
            <p><span class="title">Description:</span> ${item.inv_description}</p>
            <p><span class="title">Color:</span> ${item.inv_color}</p>
            <p><span class="title">Miles:</span> ${new Intl.NumberFormat("en-US").format(item.inv_miles)}</p>
        </div>`;
    grid += "</section>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>';
  }
  return grid;
};

module.exports = Util;
