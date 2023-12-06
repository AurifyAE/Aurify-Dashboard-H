// import { readSpreadValues } from '../core/spotrateDB.js';
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { app } from '../../../config/db.js';

const firestore = getFirestore(app)

document.addEventListener('DOMContentLoaded', function () {
    setInterval(() => {
        fetchData()
    }, 1000)

    showTable();
});


let askSpread, bidSpread, goldValue, silverBidSpread, silverAskSpread;

// Gold API KEY
const API_KEY = 'goldapi-fbqpmirloto20zi-io'

// Function to Fetch Gold API Data
async function fetchData() {
    var myHeaders = new Headers();
    myHeaders.append("x-access-token", API_KEY);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const responseGold = await fetch("https://www.goldapi.io/api/XAU/USD", requestOptions);
        const responseSilver = await fetch("https://www.goldapi.io/api/XAG/USD", requestOptions);

        if (!responseGold.ok && !responseSilver.ok) {
            throw new Error('One or more network responses were not OK');
        }

        const resultGold = await responseGold.json();
        const resultSilver = await responseSilver.json();

        // Adjust based on the actual API response structure
        var goldValueUSD = parseFloat(resultGold.price);
        var silverValueUSD = parseFloat(resultSilver.price)

        document.getElementById('goldRate').textContent = '$' + goldValueUSD.toFixed(2);
        document.getElementById('silverRate').textContent = '$' + silverValueUSD.toFixed(3);

        var GoldUSDResult = (goldValueUSD / 31.1035).toFixed(4);
        goldValue = (GoldUSDResult * 3.67).toFixed(4);

        var goldLowValue = parseFloat(resultGold.low_price);
        var goldHighValue = parseFloat(resultGold.high_price);
        var silverLowValue = parseFloat(resultSilver.low_price);
        var silverHighValue = parseFloat(resultSilver.high_price);


        var goldBuy = (goldValueUSD + bidSpread).toFixed(2);
        var goldSell = (goldValueUSD + askSpread + parseFloat(0.5)).toFixed(2);
        var silverBuy = (silverValueUSD + silverBidSpread).toFixed(3);
        var silverSell = (silverValueUSD + silverAskSpread + parseFloat(0.05)).toFixed(3);
        

        document.getElementById("goldInputLow").innerHTML = goldBuy;
        document.getElementById("goldInputHigh").innerHTML = goldSell;
        document.getElementById("silverInputLow").innerHTML = silverBuy;
        document.getElementById("silverInputHigh").innerHTML = silverSell;

        document.getElementById("lowLabelGold").innerHTML = goldLowValue;
        document.getElementById("highLabelGold").innerHTML = goldHighValue;
        document.getElementById("lowLabelSilver").innerHTML = silverLowValue;
        document.getElementById("highLabelSilver").innerHTML = silverHighValue;

        var element;

        // LowLabelGold
        element = document.getElementById("lowLabelGold");
        element.style.backgroundColor = goldBuy > goldLowValue ? "red" : "green";

        // HighLabelGold
        element = document.getElementById("highLabelGold");
        element.style.backgroundColor = goldSell > goldHighValue ? "red" : "green";

        // LowLabelSilver
        element = document.getElementById("lowLabelSilver");
        element.style.backgroundColor = silverBuy > silverLowValue ? "red" : "green";

        // HighLabelSilver
        element = document.getElementById("highLabelSilver");
        element.style.backgroundColor = silverSell > silverHighValue ? "red" : "green";

    } catch (error) {
        console.error('Error fetching gold and silver values:', error);
    }
}

async function readSpreadValues() {
    try {
        const uid = 'BKm70mfv8BMQuJJUO4tiM3f0t6X2';
        if (!uid) {
            console.error('User not authenticated');
            throw new Error('User not authenticated');
        }

        const spreadCollection = collection(firestore, `users/${uid}/spread`);
        const querySnapshot = await getDocs(spreadCollection);

        const spreadDataArray = [];
        querySnapshot.forEach((doc) => {
            const spreadData = doc.data();
            const spreadDocId = doc.id;
            spreadDataArray.push({ id: spreadDocId, data: spreadData });
        });

        console.log(spreadDataArray);

        return spreadDataArray;
    } catch (error) {
        console.error('Error reading data from Firestore: ', error);
        throw error;
    }
}

async function displaySpreadValues() {
    try {
        const spreadDataArray = await readSpreadValues();

        spreadDataArray.forEach((spreadData) => {
            askSpread = spreadData.data.editedAskSpreadValue || 0;
            bidSpread = spreadData.data.editedBidSpreadValue || 0;
            silverAskSpread = spreadData.data.editedAskSilverSpreadValue || 0;
            silverBidSpread = spreadData.data.editedBidSilverSpreadValue || 0;
        });
    } catch (error) {
        console.error('Error reading spread values: ', error);
        throw error;
    }
}


// Function to read data from the Firestore collection
async function readData() {
    // Get the UID of the authenticated user
    const uid = 'BKm70mfv8BMQuJJUO4tiM3f0t6X2';

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    const querySnapshot = await getDocs(collection(firestore, `users/${uid}/commodities`));
    const result = [];
    querySnapshot.forEach((doc) => {
        result.push({
            id: doc.id,
            data: doc.data()
        });
    });
    return result;
}

// Show Table from Database
async function showTable() {
    try {
        const tableData = await readData();
        // console.log('Data read successfully:', tableData);

        const tableBody = document.getElementById('tableBodyTV');
        console.log(tableData);

        // Loop through the tableData
        for (const data of tableData) {
            // Assign values from data to variables
            const metalInput = data.data.metal;
            const purityInput = data.data.purity;
            const unitInput = data.data.unit;
            const weightInput = data.data.weight;
            const sellAEDInput = data.data.sellAED;
            const buyAEDInput = data.data.buyAED;
            const sellPremiumInputAED = data.data.sellPremiumAED;
            const buyPremiumInputAED = data.data.buyPremiumAED;


            // Create a new table row
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
            <td>${metalInput}</td>
            <td>${purityInput}</td>
            <td>${unitInput} ${weightInput}</td>
            <td id="sellAED">0</td>
            <td id="buyAED">0</td>
            `;

            // Append the new row to the table body
            tableBody.appendChild(newRow);

            displaySpreadValues();

            setInterval(async () => {
                let weight = weightInput;
                let unitMultiplier = 1;

                // Adjust unit multiplier based on the selected unit
                if (weight === "GM") {
                    unitMultiplier = 1;
                } else if (weight === "KG") {
                    unitMultiplier = 1000;
                } else if (weight === "TTB") {
                    unitMultiplier = 116.6400;
                } else if (weight === "TOLA") {
                    unitMultiplier = 11.664;
                } else if (weight === "OZ") {
                    unitMultiplier = 31.1034768;
                }

                let sellPremium = sellPremiumInputAED || 0;
                let buyPremium = buyPremiumInputAED || 0;
                let askSpreadValue = askSpread || 0;
                let bidSpreadValue = bidSpread || 0;

                if (weight === "GM") {
                    // Update the sellAED and buyAED values for the current 
                    newRow.querySelector("#sellAED").innerText = parseFloat(((parseFloat(goldValue) + parseFloat(sellPremium) + parseFloat(askSpreadValue)) * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length))).toFixed(2)) + parseFloat(0.5);
                    newRow.querySelector("#buyAED").innerText = ((parseFloat(goldValue) + parseFloat(buyPremium) + parseFloat(bidSpreadValue)) * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length))).toFixed(2);
                } else {
                    // Update the sellAED and buyAED values for the current row
                    const sellAEDValue = parseFloat(((parseFloat(goldValue) + parseFloat(sellPremium) + parseFloat(askSpreadValue)) * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length))).toFixed(2)) + parseFloat(0.5);
                    const buyAEDValue = parseInt((parseFloat(goldValue) + parseFloat(buyPremium) + parseFloat(bidSpreadValue)) * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length))).toFixed(0);

                    newRow.querySelector("#sellAED").innerText = parseInt(sellAEDValue).toFixed(0); // Round to remove decimals
                    newRow.querySelector("#buyAED").innerText = parseInt(buyAEDValue).toFixed(0);   // Round to remove decimals
                }
            }, 1000)
        }
    } catch (error) {
        console.error('Error reading data:', error);
    }
}