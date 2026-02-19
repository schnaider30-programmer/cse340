'use strict'

let classificationList = document.querySelector("#classificationId")

classificationList.addEventListener("change", () => {
    let classificationId = classificationList.value
    console.log(`classification_id is: ${classificationId}`) 
    let classIdURL = "/inv/getInventory/" + classificationId
    fetch(classIdURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Network response was not ok")
        })
        .then(function (data) {
            console.log("Data", data)
            buildInventoryList(data)
        })
        .catch(function (error) {
            console.log('There was a problem: ', error.message) 
    })
})

function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay")
    // Set up the table labels 
    let dataTable = '<thead>'; 
    dataTable += '<tr><th colspan="4">Vehicle Name</th></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
        // Iterate over all vehicles in the array and put each in a row 
    data.forEach(function (element) { 
    console.log(element.inv_id + ", " + element.inv_model); 
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
    dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td>`; 
    dataTable += `<td><a href="/inv/maintenance/${element.inv_id}" title="Click to record maintenance">Maintenance</a></td></tr>`
    }) 
    dataTable += '</tbody>'; 
    // Display the contents in the Inventory Management view 
    inventoryDisplay.innerHTML = dataTable; 

}