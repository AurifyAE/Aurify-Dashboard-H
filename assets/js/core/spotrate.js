import { saveDataToFirestore, readData, updateDataInFirestore, deleteDataFromFirestore, saveSpreadValues, readSpreadValues } from '../core/spotrateDB.js'
import { serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

// const { JSDOM } = require('jsdom');
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.2.0/socket.io.js';
document.head.appendChild(script);

// const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
// global.window = dom.window;
// global.document = dom.window.document;

const socket = io('https://meta-api-server.onrender.com');
socket.on('goldValue', (goldValue) => {
  // console.log('Received gold value:', goldValue);
  setGoldValue(goldValue.bid)
  // You can do something with the received gold value here, like updating UI
});

setInterval(() => {
  fetchData1()
}, 500)

// fetchData()
showTable();
displaySpreadValues();


// Gold API KEY
const API_KEY = 'goldapi-fbqpmirloto20zi-io'
// Add a variable to keep track of the edited row
let editedRow;
// Add a variable to store the row to be deleted
let rowToDelete;


document.body.addEventListener('click', function (event) {
  if (event.target.classList.contains('deleteRowConfirmation')) {
    deleteRowConfirmation(event.target);
  }

  if (event.target.classList.contains('editRowBtn')) {
    editRow(event.target);
  }

  if (event.target.classList.contains('editGoldBid')) {
    editGoldBid(event.target);
  }

  if (event.target.classList.contains('editSilverBid')) {
    editSilverBid(event.target);
  }

  if (event.target.classList.contains('editGoldAsk')) {
    editGoldAsk(event.target);
  }

  if (event.target.classList.contains('editSilverAsk')) {
    editSilverAsk(event.target);
  }

  if (event.target.classList.contains('editGoldMarginValue')) {
    editGoldMarginValue(event.target);
  }

  if (event.target.classList.contains('editSilverMarginValue')) {
    editSilverMarginValue(event.target);
  }
});

// Function to Fetch Gold API Data
async function fetchData1() {
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
    // var goldValue = parseFloat(resultGold.price);
    var silverValue = parseFloat(resultSilver.price);

    var goldLowValue = parseFloat(resultGold.low_price);
    var goldHighValue = parseFloat(resultGold.high_price);
    var silverLowValue = parseFloat(resultSilver.low_price);
    var silverHighValue = parseFloat(resultSilver.high_price);

    // Make sure setGoldValue and setSilverValue are defined and do what you expect

    // setGoldValue(goldValue)
    setSilverValue(silverValue);
    setGoldLowMarginValue(goldLowValue)
    setGoldHighMarginValue(goldHighValue)
    setSilverLowMarginValue(silverLowValue)
    setSilverHighMarginValue(silverHighValue)
  } catch (error) {
    console.error('Error fetching gold and silver values:', error);
  }
}

// const api = new MetaApi.default(token);

// async function fetchData() {
//   console.log('koiiii');
//   let token = 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIyMTlmN2Y0ZTQ2MjgzNmVhN2IyMGRlMjI5MWZhYWFiOSIsInBlcm1pc3Npb25zIjpbXSwiYWNjZXNzUnVsZXMiOlt7ImlkIjoidHJhZGluZy1hY2NvdW50LW1hbmFnZW1lbnQtYXBpIiwibWV0aG9kcyI6WyJ0cmFkaW5nLWFjY291bnQtbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6OGFhOTRlYWQtMGVlMy00NGIyLTk2YjEtMzIxODBmNWE5YzVjIl19LHsiaWQiOiJtZXRhYXBpLXJlc3QtYXBpIiwibWV0aG9kcyI6WyJtZXRhYXBpLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDo4YWE5NGVhZC0wZWUzLTQ0YjItOTZiMS0zMjE4MGY1YTljNWMiXX0seyJpZCI6Im1ldGFhcGktcnBjLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOjhhYTk0ZWFkLTBlZTMtNDRiMi05NmIxLTMyMTgwZjVhOWM1YyJdfSx7ImlkIjoibWV0YWFwaS1yZWFsLXRpbWUtc3RyZWFtaW5nLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOjhhYTk0ZWFkLTBlZTMtNDRiMi05NmIxLTMyMTgwZjVhOWM1YyJdfSx7ImlkIjoibWV0YXN0YXRzLWFwaSIsIm1ldGhvZHMiOlsibWV0YXN0YXRzLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDo4YWE5NGVhZC0wZWUzLTQ0YjItOTZiMS0zMjE4MGY1YTljNWMiXX0seyJpZCI6InJpc2stbWFuYWdlbWVudC1hcGkiLCJtZXRob2RzIjpbInJpc2stbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6OGFhOTRlYWQtMGVlMy00NGIyLTk2YjEtMzIxODBmNWE5YzVjIl19LHsiaWQiOiJtZXRhYXBpLXJlYWwtdGltZS1zdHJlYW1pbmctYXBpIiwibWV0aG9kcyI6WyJtZXRhYXBpLWFwaTp3czpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6OGFhOTRlYWQtMGVlMy00NGIyLTk2YjEtMzIxODBmNWE5YzVjIl19LHsiaWQiOiJjb3B5ZmFjdG9yeS1hcGkiLCJtZXRob2RzIjpbImNvcHlmYWN0b3J5LWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDo4YWE5NGVhZC0wZWUzLTQ0YjItOTZiMS0zMjE4MGY1YTljNWMiXX1dLCJ0b2tlbklkIjoiMjAyMTAyMTMiLCJpbXBlcnNvbmF0ZWQiOmZhbHNlLCJyZWFsVXNlcklkIjoiMjE5ZjdmNGU0NjI4MzZlYTdiMjBkZTIyOTFmYWFhYjkiLCJpYXQiOjE3MDkyMTg4NTEsImV4cCI6MTcxMTgxMDg1MX0.Q2IK0ReqNRDYcfYpaZF4_Neke8Kl3hYkPo7qBqNfeA7Dwq875Qw7p2Ja29F3ezl4MiinB8xt9egL4H3E79lmmWO0YipW0KcPaesBIwQ4mumK8aeJ2_zPupAGy3aq0gWaHLeRF4-hR0Lly6jTb_2WSNugXOGMsNMqZSl0LA0OD1IQ20mNv8wUpx3Vmgc4_TBnfB1dHCrtl2pcc-CJiazGuseaF3_slAAmneDwSfuSbgtqyO_Bt2HVORX85Ec1jZfp_zgjHaTSf_e4zSPreej1dce8Dm_dFd1358V1EcougVpPbbkV3WZGW4N3E9D4bENlIj0d5Jo7Df_mPGJzax2kS0eoktoFueuo267vElLioMNIYupcIBlHoUZbe3hszTF33xaIR1m-LyFsi_hMn7NBdjk1i456ZMc7Wh0-wEPDdQH04fpYTlTiUWWibOLCxbGIk8Oi7-jPDLOtwSHCC3srqO1qSWP_ErMsZip3A15nemMr0Vp_TuGwG4kZeXiFoMLg2kC4wtGZDNDv3yuOsw9nKPogCpDYnZ1deiHky7Ws1_rc3UbzjaniX31LMaOUGf-jYW9DcV_4WZsOVtpcCeVswBVhNS1_pNQWGWN9Ya2hMYj9XHcOzABJOZk0tu1h4C3O6gASesWoOpwpqsp-u-FKHRclFFDTVpgYUJ7rn81Zfnc';
//   let accountId = '8aa94ead-0ee3-44b2-96b1-32180f5a9c5c';
//   const api = new MetaApi.default(token);

//   async function getRealTimeBidAskPrices() {
//     try {
//       const account = await api.metatraderAccountApi.getAccount(accountId);
//       const initialState = account.state;
//       const deployedStates = ['DEPLOYING', 'DEPLOYED'];

//       if (!deployedStates.includes(initialState)) {
//         // wait until account is deployed and connected to broker
//         // console.log('Deploying account');
//         await account.deploy();
//       }
//       // console.log('Waiting for API server to connect to broker (may take a couple of minutes)');
//       await account.waitConnected();

//       // connect to MetaApi API
//       let connection = account.getStreamingConnection();
//       await connection.connect();

//       // wait until terminal state synchronized to the local state
//       // console.log('Waiting for SDK to synchronize to terminal state (may take some time depending on your history size)');
//       await connection.waitSynchronized();


//       // Subscribe to real-time market data for XAUUSD.fix (gold) and XAGUSD.fix (silver)
//       await connection.subscribeToMarketData('XAUUSD.fix', [{ type: 'quotes' }]);
//       // await connection.subscribeToMarketData('XAGUSD.fix', [{ type: 'quotes' }]);

//       // Access terminal state
//       let terminalState = connection.terminalState;

//       let goldPrice = null;
//       let silverPrice = null;

//       connection.addSynchronizationListener({
//         async onSymbolPriceUpdated(instanceIndex, price) {
//           if (price.symbol === 'XAUUSD.fix' || price.symbol === 'XAGUSD.fix') {
//             console.log(`Real-time Bid and Ask Prices for ${price.symbol}:`, price);

//             const bidPrice = price.bid;
//             console.log('Bid Price:', bidPrice);

//             if (price.symbol === 'XAUUSD.fix') {
//               // Update gold price
//               goldPrice = bidPrice;
//               setGoldValue(goldPrice);
//               // ... (other gold-related logic)
//             } else if (price.symbol === 'XAGUSD.fix') {
//               // Update silver price
//               silverPrice = bidPrice;
//               setSilverValue(silverPrice);
//               // ... (other silver-related logic)
//             }

//             // Check if both gold and silver prices are available
//             if (goldPrice !== null && silverPrice !== null) {
//               // Perform actions that require both gold and silver data
//               console.log('Both gold and silver prices are available:', goldPrice, silverPrice);
//             }
//           }
//         },
//       });

//       // Keep the script running to receive real-time updates
//       // console.log('Listening for real-time updates. Press Ctrl+C to exit.');
//       await new Promise(() => { });

//       // Close the connection if the account was undeployed
//       if (!deployedStates.includes(initialState)) {
//         // console.log('Undeploying account');
//         await connection.close();
//         await account.undeploy();
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   getRealTimeBidAskPrices();
// }

// // Add an event listener to trigger the calculation when the gold value input changes
// document.getElementById("getGoldValue").addEventListener("input", function () {
//   setGoldValue(); // Call setGoldValue function when the input changes
//   calculateRates(); // Call calculateRates to update the table values
// });

// document.getElementById("getGoldValue").addEventListener("input", setGoldValue);

document.getElementById("addRowForm").addEventListener("input", calculateRates);

// Call calculateRates with default values
calculateRates();

// Function to calculate total value including Premium 
function totalUSDInputValue() {
  const sellPremiumUSDElement = document.getElementById('sellPremiumUSD');
  const buyPremiumUSDElement = document.getElementById('buyPremiumUSD');

  // Ensure the elements exist and contain valid numerical data
  const sellPremiumUSD = sellPremiumUSDElement ? parseFloat(sellPremiumUSDElement.value) || 0 : 0;
  const buyPremiumUSD = buyPremiumUSDElement ? parseFloat(buyPremiumUSDElement.value) || 0 : 0;

  // Get values from Sell and Buy USD Input
  const sellUSDInputElement = document.getElementById("sellUSDInput");
  const buyUSDInputElement = document.getElementById("buyUSDInput");

  const sellUSDInput = sellUSDInputElement ? parseFloat(sellUSDInputElement.textContent) || 0 : 0;
  const buyUSDInput = buyUSDInputElement ? parseFloat(buyUSDInputElement.textContent) || 0 : 0;

  const totalSellUSDInput = sellPremiumUSD + buyUSDInput;
  const totalBuyUSDInput = buyPremiumUSD + sellUSDInput;

  // Update the content of elements
  if (sellUSDInputElement) {
    sellUSDInputElement.textContent = parseFloat(totalSellUSDInput);
  }

  if (buyUSDInputElement) {
    buyUSDInputElement.textContent = parseFloat(totalBuyUSDInput);
  }

  valuesUSDToAED()
}


// Set default values in the form
document.getElementById("metalInput").value = "Gold";
document.getElementById("purityInput").value = "999";
document.getElementById("unitInput").value = "1";
document.getElementById("weightInput").value = "GM";

function calculateRates() {
  // Get values from the form
  const metalType = document.getElementById("metalInput").value;
  const purity = document.getElementById("purityInput").value;
  const unitInput = document.getElementById("unitInput");
  const weightInput = document.getElementById("weightInput");

  // Set default values for unit and weight
  let unit = parseFloat(unitInput.value) || 1; // Use the value from the input or default to 1
  let weight = weightInput.value || "GM"; // Use the value from the input or default to "GM"

  // Update unit and weight based on the selected metal type
  switch (metalType) {
    case "Gold kilobar":
      unit = 1;
      weight = "KG";
      break;
    case "Gold TOLA":
      unit = 1;
      weight = "TOLA";
      break;
    case "Gold TEN TOLA":
      unit = 1;
      weight = "TTB";
      break;
    case "Silver":
      unit = 1;
      weight = "GM";
      break;
    // Add more cases for other metal types if needed
    default:
      break;
  }

  // Update the form fields
  unitInput.value = unit;
  weightInput.value = weight;

  // Perform the calculation based on the example formula
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

  // Declare these variables at the beginning of your script
  let valueUSD1 = 0;
  let valueUSD2 = 0;

  // Get references to the input fields
  const sellPremiumUSD = document.getElementById('sellPremiumUSD');
  const sellPremiumAED = document.getElementById('sellPremiumAED');
  // Add event listeners to sell Premium USD for conversion to AED
  sellPremiumUSD.addEventListener('input', convertUSDToAED1);
  // Add event listeners to sell Premium AED for conversion to USD
  sellPremiumAED.addEventListener('input', convertAEDToUSD1);
  // Get references to the input fields
  const buyPremiumUSD = document.getElementById('buyPremiumUSD');
  const buyPremiumAED = document.getElementById('buyPremiumAED');
  // Add event listeners to Buy Premium USD for conversion to AED
  buyPremiumUSD.addEventListener('input', convertUSDToAED2);
  // Add event listeners to Buy Premium AED for conversion to USD
  buyPremiumAED.addEventListener('input', convertAEDToUSD2);

  function convertUSDToAED1() {
    const valueUSD1 = parseFloat(sellPremiumUSD.value) || 0;

    if (!isNaN(valueUSD1)) {
      sellPremiumAED.value = (valueUSD1 * 3.67).toFixed(2);
    } else {
      sellPremiumAED.value = ''; // Clear AED input if USD input is not a valid number
    }
  }

  function convertAEDToUSD1() {
    const valueAED1 = parseFloat(sellPremiumAED.value);

    if (!isNaN(valueAED1)) {
      sellPremiumUSD.value = (valueAED1 / 3.67).toFixed(2);
    } else {
      sellPremiumUSD.value = ''; // Clear USD input if AED input is not a valid number
    }
  }

  function convertUSDToAED2() {
    const valueUSD2 = parseFloat(buyPremiumUSD.value) || 0;

    if (!isNaN(valueUSD2)) {
      buyPremiumAED.value = (valueUSD2 * 3.67).toFixed(2);
    } else {
      buyPremiumAED.value = ''; // Clear AED input if USD input is not a valid number
    }
  }

  function convertAEDToUSD2() {
    const valueAED2 = parseFloat(buyPremiumAED.value);

    if (!isNaN(valueAED2)) {
      buyPremiumUSD.value = (valueAED2 / 3.67).toFixed(2);
    } else {
      buyPremiumUSD.value = ''; // Clear USD input if AED input is not a valid number
    }
  }


  const goldUSDResult = parseFloat(document.getElementById("goldAskingPrice").textContent);
  const calculatedRate = ((goldUSDResult + valueUSD1) / 31.1035 * 3.67 * unit * unitMultiplier) * (purity / Math.pow(10, purity.length));

  // Update the sell and buy rates in the form
  document.getElementById("sellAEDInput").textContent = calculatedRate.toFixed(2);
  document.getElementById("sellUSDInput").textContent = (calculatedRate / 3.67).toFixed(2);

  // You can adjust the buy rate calculation based on your requirements
  const goldUSDBiddingResult = parseFloat(document.getElementById("goldBiddingPrice").textContent);
  const buyRate = (((goldUSDBiddingResult + valueUSD2) / 31.1035) * 3.67 * unit * unitMultiplier) * (purity / Math.pow(10, purity.length)); // For example, increase by 5%

  document.getElementById("buyAEDInput").textContent = buyRate.toFixed(2);
  document.getElementById("buyUSDInput").textContent = (buyRate / 3.67).toFixed(2);

  totalUSDInputValue()
}


// Add an event listener to trigger the calculation when the form values change
document.getElementById("addRowForm").addEventListener("input", calculateRates);

// Event Listener for Buttons
document.getElementById('addCommodityButton').addEventListener('click', addTableRow);
document.getElementById('saveButton').addEventListener('click', saveRow);
document.getElementById('saveChangesButton').addEventListener('click', updateRow);
document.getElementById('confirmedDelete').addEventListener('click', confirmedDelete);
document.getElementById('deleteRowConfirmation').addEventListener('click', deleteRowConfirmation);
//////////////


function addTableRow() {
  document.getElementById('saveButton').style.display = 'block';
  document.getElementById('saveChangesButton').style.display = 'none';
  setGoldValue()
}

function getSelectedCurrency() {
  const currencySelect = document.getElementById("currency");
  const currencySymbol = document.getElementById("currencySymbol");
  const selectedCurrency = currencySelect.value;

  // Update the currency symbol in the table headings
  document.querySelectorAll("#currencySymbol").forEach((element) => {
    element.textContent = selectedCurrency;
  });
}

function deleteRow(iconElement) {
  const row = iconElement.parentElement.parentElement;
  row.remove();
}


// Show Table from Database
async function showTable() {
  try {
    const tableData = await readData();
    console.log('Data read successfully:', tableData);

    const tableBody = document.getElementById('tableBody'); // Replace with your actual table body ID


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
        <td>${sellPremiumInputAED}</td>
        <td>${buyPremiumInputAED}</td>
        <td>
          <button class="btn bg-gradient-primary editRowBtn" data-document-id="${data.id}">
            <i class="fas fa-edit editRowBtn" data-document-id="${data.id}"></i> 
          </button>
          <button class="btn bg-gradient-primary deleteRowConfirmation" data-document-id="${data.id}">
            <i class="fas fa-trash-alt deleteRowConfirmation" data-document-id="${data.id}"></i>
          </button>
        </td>
        `;

      // Append the new row to the table body
      tableBody.appendChild(newRow);

      let goldValue;

      setInterval(() => {
        goldValue = document.getElementById("GoldAEDresult").textContent;
        const bidSpread = document.getElementById("goldSpread").textContent;
        const askSpread = document.getElementById("goldAskSpread").textContent;

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

        const goldSpread = document.getElementById('goldSpread').textContent;

        // console.log(unitMultiplier);
        // console.log(parseFloat(goldValue));

        // Update the sellAED and buyAED values for the current 
        newRow.querySelector("#sellAED").innerText = parseFloat(((parseFloat(goldValue) + parseFloat(goldSpread) + parseFloat(0.5)) * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length)) + parseFloat(sellPremium)).toFixed(4));
        newRow.querySelector("#buyAED").innerText = ((parseFloat(goldValue) + parseFloat(bidSpreadValue)) * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length)) + parseFloat(buyPremium)).toFixed(4);
      }, 1000)
    }
  } catch (error) {
    console.error('Error reading data:', error);
  }
}

// window.onload = function () {
//   plays();
// }

async function saveRow() {
  // Get data from the form
  const metalInput = document.getElementById("metalInput").value;
  const purityInput = document.getElementById("purityInput").value;
  const unitInput = document.getElementById("unitInput").value;
  const weightInput = document.getElementById("weightInput").value;
  const sellAEDInput = document.getElementById("sellAEDInput").textContent; // Updated to use textContent
  const buyAEDInput = document.getElementById("buyAEDInput").textContent; // Updated to use textContent
  const sellPremiumInput = document.getElementById("sellPremiumUSD").value;
  const sellPremiumInputAED = document.getElementById("sellPremiumAED").value;
  const buyPremiumInput = document.getElementById("buyPremiumUSD").value;
  const buyPremiumInputAED = document.getElementById("buyPremiumAED").value;

  // Create a new table row  <td>${sellPremiumInput}</td>         <td>${buyPremiumInput}</td>
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td>${metalInput}</td>
        <td>${purityInput}</td>
        <td>${unitInput} ${weightInput}</td>
        <td>${sellAEDInput}</td>
        <td>${buyAEDInput}</td>
        <td>${sellPremiumInputAED}</td>
        <td>${buyPremiumInputAED}</td>
        <td>
          <button class="btn bg-gradient-primary editRowBtn" >
            <i class="fas fa-edit editRowBtn" ></i>
          </button>
          <button class="btn bg-gradient-primary deleteRowConfirmation" >
            <i class="fas fa-trash-alt deleteRowConfirmation" ></i>
          </button>
        </td>
        `;

  // Add the new row to the table body
  document.getElementById("tableBody").appendChild(newRow);

  // Firebase
  try {
    // Add timestamp to data
    const timestamp = serverTimestamp();

    // Save data to Firestore
    saveDataToFirestore({
      metal: metalInput,
      purity: purityInput,
      unit: unitInput,
      weight: weightInput,
      sellAED: sellAEDInput,
      buyAED: buyAEDInput,
      sellPremiumAED: sellPremiumInputAED,
      buyPremiumAED: buyPremiumInputAED,
      timestamp: timestamp
    }).then((response) => {
      console.log("Document written with ID: ", response.id);
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }


  document.getElementById("addRowModal").addEventListener("show.bs.modal", function () {
    // Check if it's for editing or adding
    const modalTitle = document.getElementById("addRowModalTitle");
    if (modalTitle) {
      modalTitle.textContent = editedRow ? "Edit Commodity" : "Add Commodity";
    }
  });

  resetFormFields();
}


// Function to reset form fields to default values
function resetFormFields() {
  document.getElementById("metalInput").value = "Gold";
  document.getElementById("purityInput").value = "999";
  document.getElementById("unitInput").value = "1";
  document.getElementById("weightInput").value = "GM";
  document.getElementById("sellPremiumUSD").value = "";
  document.getElementById("sellPremiumAED").value = "";
  document.getElementById("buyPremiumUSD").value = "";
  document.getElementById("buyPremiumAED").value = "";
}


function editRow(iconElement) {
  // Get the document ID from the button
  const documentId = iconElement.getAttribute('data-document-id');
  console.log(documentId);

  document.getElementById('saveChangesButton').style.display = 'block';
  document.getElementById('saveButton').style.display = 'none';
  document.getElementById('closeButton').style.display = 'none';

  // Get the row to be edited
  editedRow = iconElement.parentElement.parentElement;

  // Extract data from the row
  const metalInput = editedRow.cells[0].textContent;
  const purityInput = editedRow.cells[1].textContent;
  const unitWeightInput = editedRow.cells[2].textContent.split(' '); // Split unit and weight
  const unitInput = unitWeightInput[0];
  const weightInput = unitWeightInput[1];
  const sellAEDInput = editedRow.cells[3].textContent;
  const buyAEDInput = editedRow.cells[4].textContent;
  const sellPremiumInputAED = editedRow.cells[5].textContent;
  const buyPremiumInputAED = editedRow.cells[6].textContent;

  // Populate the form fields with the data
  document.getElementById("metalInput").value = metalInput;
  document.getElementById("purityInput").value = purityInput;
  document.getElementById("unitInput").value = unitInput;
  document.getElementById("weightInput").value = weightInput;
  document.getElementById("sellAEDInput").textContent = sellAEDInput;
  document.getElementById("buyAEDInput").textContent = buyAEDInput;
  // document.getElementById("sellPremiumUSD").value = sellPremiumInputAED;
  document.getElementById("sellPremiumAED").value = sellPremiumInputAED;
  // document.getElementById("buyPremiumUSD").value = buyPremiumInputAED;
  document.getElementById("buyPremiumAED").value = buyPremiumInputAED;

  // Show the modal for editing
  $('#addRowModal').modal('show');

  document.getElementById("saveChangesButton").addEventListener('click', () => updateRow(documentId));
  document.getElementById("closeModal").addEventListener('click', () => closeModal());
}


function updateRow(documentId) {
  console.log(documentId);
  // Update the content of the edited row
  editedRow.cells[0].textContent = document.getElementById("metalInput").value;
  editedRow.cells[1].textContent = document.getElementById("purityInput").value;
  editedRow.cells[2].textContent = `${document.getElementById("unitInput").value} ${document.getElementById("weightInput").value}`;
  editedRow.cells[3].textContent = document.getElementById("sellAEDInput").textContent;
  editedRow.cells[4].textContent = document.getElementById("buyAEDInput").textContent;
  editedRow.cells[5].textContent = document.getElementById("sellPremiumAED").value;
  editedRow.cells[6].textContent = document.getElementById("buyPremiumAED").value;

  // Prepare the data to be updated in Firestore
  const updatedData = {
    metal: document.getElementById("metalInput").value,
    purity: document.getElementById("purityInput").value,
    unit: document.getElementById("unitInput").value,
    weight: document.getElementById("weightInput").value,
    sellAED: document.getElementById("sellAEDInput").textContent,
    buyAED: document.getElementById("buyAEDInput").textContent,
    sellPremiumAED: document.getElementById("sellPremiumAED").value,
    buyPremiumAED: document.getElementById("buyPremiumAED").value
  };


  // Update the Firestore document
  updateDataInFirestore(documentId, updatedData)
    .then(() => {
      console.log('Document successfully updated in Firestore');
      // Reset the form fields
      resetFormFields();
      // Hide the modal after updating
      $('#addRowModal').modal('hide');

      location.reload();
    })
    .catch((error) => {
      console.error('Error updating document in Firestore: ', error);
    });

  // Hide the modal after updating
  // $('#addRowModal').modal('hide');
  document.getElementById("closeModal").addEventListener('click', () => closeModal());
}

// Function for Closing Modals on Button Click
function closeModal() {
  $('#addRowModal').modal('hide');
  $('#deleteConfirmationModal').modal('hide');
}

function deleteRowConfirmation(iconElement) {
  // Get the document ID from the button
  const documentId = iconElement.getAttribute('data-document-id');
  // Store the row to be deleted
  rowToDelete = iconElement.parentElement.parentElement;
  // Show the delete confirmation modal
  $('#deleteConfirmationModal').modal('show');

  document.getElementById("confirmedDelete").addEventListener('click', () => confirmedDelete(documentId));
  document.getElementById("closeModal2").addEventListener('click', () => closeModal());
  document.getElementById("closeModal3").addEventListener('click', () => closeModal());
}

function confirmedDelete(documentId) {
  console.log(documentId);
  deleteDataFromFirestore(documentId)
  // Delete the stored row
  rowToDelete.remove();
  // Close the delete confirmation modal
  $('#deleteConfirmationModal').modal('hide');
}

//Update Sell and Buy USD Input
function updateBuyUSDInput(value) {
  document.getElementById("buyUSDInput").textContent = value;
  valuesUSDToAED()
}

function updateSellUSDInput(value) {
  document.getElementById("sellUSDInput").textContent = value;
  valuesUSDToAED()
}


// Set Gold value using API call
function setGoldValue(goldValue) {
  // Set the value to elements
  document.getElementById("goldBid").textContent = goldValue;
  const goldSpread = document.getElementById("goldSpread").textContent;
  document.getElementById("goldBiddingPrice").textContent = (goldValue + parseFloat(goldSpread)).toFixed(2);

  document.getElementById("goldAsk").textContent = (goldValue + 0.5 + parseFloat(goldSpread)).toFixed(2);
  const goldAskSpread = document.getElementById("goldAskSpread").textContent;
  document.getElementById("goldAskingPrice").textContent = (goldValue + 0.5 + parseFloat(goldAskSpread) + parseFloat(goldSpread)).toFixed(2);

  // Set Value to Commodity
  updateSellUSDInput(goldValue + 0.5);
  updateBuyUSDInput(goldValue);

  var goldValuegm = goldValue
  var GoldUSDResult = (goldValuegm / 31.1035).toFixed(4);
  var GoldAEDResult = (GoldUSDResult * 3.67).toFixed(4);
  document.getElementById("GoldUSDresult").textContent = GoldUSDResult;
  document.getElementById("GoldAEDresult").textContent = GoldAEDResult;

  //Call calculateRates to update the table values
  calculateRates();
  // buyRate();
}



// // Add an event listener to trigger the setGoldValue function when the input changes
// document.getElementById("getGoldValue").addEventListener("input", setGoldValue);
// Add an event listener to trigger the calculateRates function when the addRowForm input changes
document.getElementById("addRowForm").addEventListener("input", calculateRates);
document.getElementById("addRowForm").addEventListener("input", buyRate);


function setSilverValue(silverValue) {
  //Set the value to elements
  document.getElementById("silverBid").innerHTML = silverValue
  const silverSpread = document.getElementById("silverSpread").textContent;
  document.getElementById("silverBiddingPrice").innerHTML = (silverValue + parseFloat(silverSpread)).toFixed(2);

  document.getElementById("silverAsk").innerHTML = silverValue + 0.05
  const silverAskSpread = document.getElementById("silverAskSpread").textContent;
  document.getElementById("silverAskingPrice").innerHTML = (silverValue + 0.05 + parseFloat(silverAskSpread)).toFixed(2);

  var silverValuegm = silverValue
  var SilverUSDResult = (silverValuegm / 31.1035).toFixed(4);
  var SilverAEDResult = (SilverUSDResult * 3.67).toFixed(4);
  document.getElementById("SilverUSDresult").textContent = SilverUSDResult;
  document.getElementById("SilverAEDresult").textContent = SilverAEDResult;
}

//Margin Value
function setGoldLowMarginValue(goldLowValue) {
  //Set the value to elements
  document.getElementById("goldLowValue").innerHTML = goldLowValue.toFixed(3)
  const goldMargin = document.getElementById("goldLowMargin").textContent;
  document.getElementById("goldNewLowValue").innerHTML = (goldLowValue + parseFloat(goldMargin)).toFixed(3)
}

function setSilverLowMarginValue(silverLowValue) {
  //Set the value to elements
  document.getElementById("silverLowValue").innerHTML = silverLowValue
  const silverMargin = document.getElementById("silverLowMargin").textContent;
  document.getElementById("silverNewLowValue").innerHTML = (silverLowValue + parseFloat(silverMargin)).toFixed(3)
}

function setGoldHighMarginValue(goldHighValue) {
  //Set the value to elements
  document.getElementById("goldHighValue").innerHTML = goldHighValue.toFixed(3)
  const goldMargin = document.getElementById("goldHighMargin").textContent;
  document.getElementById("goldNewHighValue").innerHTML = (goldHighValue + parseFloat(goldMargin)).toFixed(3)
}

function setSilverHighMarginValue(silverHighValue) {
  //Set the value to elements
  document.getElementById("silverHighValue").innerHTML = silverHighValue
  const silverMargin = document.getElementById("silverHighMargin").textContent;
  document.getElementById("silverNewHighValue").innerHTML = (silverHighValue + parseFloat(silverMargin)).toFixed(3)
}

//Convert Values From USD to AED for Sell and Buy
function valuesUSDToAED() {
  const sellValueInUSD = document.getElementById("sellUSDInput");
  const sellValueInUSDToText = sellValueInUSD.textContent.trim();
  const sellValueInUSDToNum = parseFloat(sellValueInUSDToText);

  const buyValueInUSD = document.getElementById("buyUSDInput");
  const buyValueInUSDToText = buyValueInUSD.textContent.trim();
  const buyValueInUSDToNum = parseFloat(buyValueInUSDToText);

  const sellValueInAED = sellValueInUSDToNum * 3.67;
  const buyValueInAED = buyValueInUSDToNum * 3.67;

  document.getElementById("sellAEDInput").innerHTML = sellValueInAED;
  document.getElementById("buyAEDInput").innerHTML = buyValueInAED;
}


// Function to add values to the "spread" collection in Firebase
function addToFirebaseSpreadCollection(editedBidSpreadValue, editedAskSpreadValue, editedBidSilverSpreadValue, editedAskSilverSpreadValue) {
  // Define the data to be added to the collection
  saveSpreadValues({
    editedBidSpreadValue: editedBidSpreadValue,
    editedAskSpreadValue: editedAskSpreadValue,
    editedBidSilverSpreadValue: editedBidSilverSpreadValue,
    editedAskSilverSpreadValue: editedAskSilverSpreadValue
  });
}

// Function to Display Spread Values from Firebase
function displaySpreadValues() {
  readSpreadValues()
    .then((spreadDataArray) => {
      if (spreadDataArray && spreadDataArray.length > 0) {
        // Assuming you want to display data from the latest document
        const latestSpreadData = spreadDataArray[spreadDataArray.length - 1].data;

        // Do something with the retrieved data
        document.getElementById("goldAskSpread").textContent = latestSpreadData.editedAskSpreadValue || 0;
        document.getElementById("goldSpread").textContent = latestSpreadData.editedBidSpreadValue || 0;
        document.getElementById("silverAskSpread").textContent = latestSpreadData.editedAskSilverSpreadValue || 0;
        document.getElementById("silverSpread").textContent = latestSpreadData.editedBidSilverSpreadValue || 0;

        // Assuming you want to track the latest document ID
        spreadDocId = spreadDataArray[spreadDataArray.length - 1].id;
      } else {
        console.log('Spread values not found.');
      }
    })
    .catch((error) => {
      console.error('Error reading spread values: ', error);
    });
}

//Edit Value for Gold on Button Click
function editGoldBid() {
  const getGoldBidValue = document.getElementById("goldBid");
  const bidGoldText = getGoldBidValue.textContent.trim();
  const bidGoldValue = parseFloat(bidGoldText);
  document.getElementById("goldBiddingPrice").innerHTML = bidGoldValue;

  const editGoldSpreadValue = document.getElementById("goldSpread");
  const isEditable = editGoldSpreadValue.getAttribute("contenteditable") === "true";
  editGoldSpreadValue.setAttribute("contenteditable", isEditable ? "false" : "true");

  // Focus on the div to make it easier for the user to start editing
  if (isEditable) {
    editGoldSpreadValue.blur();
  } else {
    editGoldSpreadValue.focus();
  }

  // Update the bidding price whenever the spread value changes
  editGoldSpreadValue.addEventListener("input", function () {
    const editedGoldSpreadText = editGoldSpreadValue.textContent.trim();
    const editedGoldSpreadValue = parseFloat(editedGoldSpreadText);

    var totalGoldSpreadValue = "";
    if (bidGoldValue > 0) {
      totalGoldSpreadValue = bidGoldValue + editedGoldSpreadValue;
    } else {
      totalGoldSpreadValue = bidGoldValue - editedGoldSpreadValue;
    }
    console.log(totalGoldSpreadValue);

    const editedAskSpreadValue = parseFloat(document.getElementById("goldAskSpread").textContent.trim());
    const editedBidSilverSpreadValue = parseFloat(document.getElementById("silverSpread").textContent.trim());
    const editedAskSilverSpreadValue = parseFloat(document.getElementById("silverAskSpread").textContent.trim());


    document.getElementById("goldBiddingPrice").innerHTML = totalGoldSpreadValue;
    document.getElementById("goldAsk").innerHTML = 0.5 + totalGoldSpreadValue;
    document.getElementById("goldAskingPrice").innerHTML = 0.5 + totalGoldSpreadValue;

    // Add the edited spread value to Firebase
    addToFirebaseSpreadCollection(editedGoldSpreadValue, editedAskSpreadValue, editedBidSilverSpreadValue, editedAskSilverSpreadValue);

    // Update Buy USD Value
    updateBuyUSDInput(totalGoldSpreadValue);
  });
}



//Edit Value for Gold on Button Click
function editGoldAsk() {
  const getGoldAskValue = document.getElementById("goldAsk");
  const askGoldText = getGoldAskValue.textContent.trim();
  const askGoldValue = parseFloat(askGoldText);
  document.getElementById("goldAskingPrice").innerHTML = askGoldValue;
  const editGoldAskSpreadValue = document.getElementById("goldAskSpread");
  const isEditable = editGoldAskSpreadValue.getAttribute("contenteditable") === "true";
  editGoldAskSpreadValue.setAttribute("contenteditable", isEditable ? "false" : "true");
  // Focus on the div to make it easier for the user to start editing
  if (isEditable) {
    editGoldAskSpreadValue.blur();
  } else {
    editGoldAskSpreadValue.focus();
  }

  editGoldAskSpreadValue.addEventListener("input", function () {
    // This event handler will be triggered when the content is edited.
    const editedGoldSpreadText = editGoldAskSpreadValue.textContent.trim();
    const editedGoldSpreadValue = parseFloat(editedGoldSpreadText);
    // You can now handle the edited content, e.g., save it to a variable or send it to the server.
    // For example:
    var totalGoldSpreadValue = '';
    if (askGoldValue > 0) {
      totalGoldSpreadValue = askGoldValue + editedGoldSpreadValue;
    } else {
      totalGoldSpreadValue = askGoldValue - editedGoldSpreadValue;
    }
    document.getElementById("goldAskingPrice").innerHTML = totalGoldSpreadValue;

    const editedBidSpreadValue = parseFloat(document.getElementById("goldSpread").textContent.trim());
    const editedBidSilverSpreadValue = parseFloat(document.getElementById("silverSpread").textContent.trim());
    const editedAskSilverSpreadValue = parseFloat(document.getElementById("silverAskSpread").textContent.trim());

    // Add the edited spread value to Firebase
    addToFirebaseSpreadCollection(editedBidSpreadValue, editedGoldSpreadValue, editedBidSilverSpreadValue, editedAskSilverSpreadValue);

    //Update Sell USD Value
    updateSellUSDInput(totalGoldSpreadValue)
  });
}


//Edit Value for Silver on Button Click
function editSilverBid() {
  const getSilverBidValue = document.getElementById("silverBid");
  const bidSilverText = getSilverBidValue.textContent.trim();
  const bidSilverValue = parseFloat(bidSilverText);
  document.getElementById("silverBiddingPrice").innerHTML = bidSilverValue;
  const editSilverSpreadValue = document.getElementById("silverSpread");
  const isEditable = editSilverSpreadValue.getAttribute("contenteditable") === "true";
  editSilverSpreadValue.setAttribute("contenteditable", isEditable ? "false" : "true");
  // Focus on the div to make it easier for the user to start editing
  if (isEditable) {
    editSilverSpreadValue.blur();
  } else {
    editSilverSpreadValue.focus();
  }

  editSilverSpreadValue.addEventListener("input", function () {
    // This event handler will be triggered when the content is edited.
    const editedSilverSpreadText = editSilverSpreadValue.textContent.trim();
    const editedSilverSpreadValue = parseFloat(editedSilverSpreadText);
    // You can now handle the edited content, e.g., save it to a variable or send it to the server.
    // For example:
    var totalSilverSpreadvalue = '';
    if (bidSilverValue > 0) {
      totalSilverSpreadvalue = bidSilverValue + editedSilverSpreadValue;
    } else {
      totalSilverSpreadvalue = bidSilverValue - editedSilverSpreadValue;
    }
    document.getElementById("silverBiddingPrice").innerHTML = totalSilverSpreadvalue;
    document.getElementById("silverAsk").innerHTML = totalSilverSpreadvalue + 0.05;
    document.getElementById("silverAskingPrice").innerHTML = totalSilverSpreadvalue + 0.05;

    const editedBidSpreadValue = parseFloat(document.getElementById("goldSpread").textContent.trim());
    const editedGoldSpreadValue = parseFloat(document.getElementById("goldAskSpread").textContent.trim());
    const editedAskSilverSpreadValue = parseFloat(document.getElementById("silverAskSpread").textContent.trim());

    // Add the edited spread value to Firebase
    addToFirebaseSpreadCollection(editedBidSpreadValue, editedGoldSpreadValue, editedSilverSpreadValue, editedAskSilverSpreadValue);
  });
}

//Edit Value for Silver on Button Click
function editSilverAsk() {
  const getSilverAskValue = document.getElementById("silverAsk");
  const askSilverText = getSilverAskValue.textContent.trim();
  const askSilverValue = parseFloat(askSilverText);
  document.getElementById("silverAskingPrice").innerHTML = askSilverValue;
  const editSilverAskSpreadValue = document.getElementById("silverAskSpread");
  const isEditable = editSilverAskSpreadValue.getAttribute("contenteditable") === "true";
  editSilverAskSpreadValue.setAttribute("contenteditable", isEditable ? "false" : "true");
  // Focus on the div to make it easier for the user to start editing
  if (isEditable) {
    editSilverAskSpreadValue.blur();
  } else {
    editSilverAskSpreadValue.focus();
  }

  editSilverAskSpreadValue.addEventListener("input", function () {
    // This event handler will be triggered when the content is edited.
    const editedSilverSpreadText = editSilverAskSpreadValue.textContent.trim();
    const editedSilverSpreadValue = parseFloat(editedSilverSpreadText);
    // You can now handle the edited content, e.g., save it to a variable or send it to the server.
    // For example:
    var totalSilverSpreadvalue = '';
    if (askSilverValue > 0) {
      totalSilverSpreadvalue = askSilverValue + editedSilverSpreadValue;
    } else {
      totalSilverSpreadvalue = askSilverValue - editedSilverSpreadValue;
    }
    document.getElementById("silverAskingPrice").innerHTML = totalSilverSpreadvalue;

    const editedBidSpreadValue = parseFloat(document.getElementById("goldSpread").textContent.trim());
    const editedGoldSpreadValue = parseFloat(document.getElementById("goldAskSpread").textContent.trim());
    const editedBidSilverSpreadValue = parseFloat(document.getElementById("silverSpread").textContent.trim());

    // Add the edited spread value to Firebase
    addToFirebaseSpreadCollection(editedBidSpreadValue, editedGoldSpreadValue, editedBidSilverSpreadValue, editedSilverSpreadValue);
  });
}


//Edit Gold Margin Values 
function editGoldMarginValue() {
  const goldLowValue = document.getElementById("goldLowValue");
  const goldLowValueToText = goldLowValue.textContent.trim();
  const goldLowValueToNum = parseFloat(goldLowValueToText);
  document.getElementById("goldNewLowValue").innerHTML = goldLowValueToNum;
  const goldLowMargin = document.getElementById("goldLowMargin");
  const isEditable = goldLowMargin.getAttribute("contenteditable") === "true";
  goldLowMargin.setAttribute("contenteditable", isEditable ? "false" : "true");
  // Focus on the div to make it easier for the user to start editing
  if (isEditable) {
    goldLowMargin.blur();
  } else {
    goldLowMargin.focus();
  }
  goldLowMargin.addEventListener("input", function () {
    // This event handler will be triggered when the content is edited.
    const editedgoldLowMarginToText = goldLowMargin.textContent.trim();
    const editedgoldLowMarginToNum = parseFloat(editedgoldLowMarginToText);
    // You can now handle the edited content, e.g., save it to a variable or send it to the server.
    // For example:
    var finalLowMarginValue = '';
    if (goldLowValueToNum > 0) {
      finalLowMarginValue = goldLowValueToNum + editedgoldLowMarginToNum;
    } else {
      finalLowMarginValue = goldLowValueToNum - editedgoldLowMarginToNum;
    }
    document.getElementById("goldNewLowValue").innerHTML = finalLowMarginValue;
  });


  const goldHighValue = document.getElementById("goldHighValue");
  const goldHighValueToText = goldHighValue.textContent.trim();
  const goldHighValueToNum = parseFloat(goldHighValueToText);
  document.getElementById("silverAskingPrice").innerHTML = goldHighValueToNum;
  const goldHighMargin = document.getElementById("goldHighMargin");
  const isHighValueEditable = goldHighMargin.getAttribute("contenteditable") === "true";
  goldHighMargin.setAttribute("contenteditable", isEditable ? "false" : "true");
  // Focus on the div to make it easier for the user to start editing
  if (isHighValueEditable) {
    goldHighMargin.blur();
  } else {
    goldHighMargin.focus();
  }
  goldHighMargin.addEventListener("input", function () {
    // This event handler will be triggered when the content is edited.
    const editedgoldHighMarginToText = goldHighMargin.textContent.trim();
    const editedgoldHighMarginToNum = parseFloat(editedgoldHighMarginToText);
    // You can now handle the edited content, e.g., save it to a variable or send it to the server.
    // For example:
    var finalHighMarginValue = '';
    if (goldHighValueToNum > 0) {
      finalHighMarginValue = goldHighValueToNum + editedgoldHighMarginToNum;
    } else {
      finalHighMarginValue = goldHighValueToNum - editedgoldHighMarginToNum;
    }
    document.getElementById("goldNewHighValue").innerHTML = finalHighMarginValue;
  });
}

//Edit Silver Margin Values 
function editSilverMarginValue() {
  const silverLowValue = document.getElementById("silverLowValue");
  const silverLowValueToText = silverLowValue.textContent.trim();
  const silverLowValueToNum = parseFloat(silverLowValueToText);
  document.getElementById("silverNewLowValue").innerHTML = silverLowValueToNum;
  const silverLowMargin = document.getElementById("silverLowMargin");
  const isEditable = silverLowMargin.getAttribute("contenteditable") === "true";
  silverLowMargin.setAttribute("contenteditable", isEditable ? "false" : "true");
  // Focus on the div to make it easier for the user to start editing
  if (isEditable) {
    silverLowMargin.blur();
  } else {
    silverLowMargin.focus();
  }
  silverLowMargin.addEventListener("input", function () {
    // This event handler will be triggered when the content is edited.
    const editedSilverLowMarginToText = silverLowMargin.textContent.trim();
    const editedSilverLowMarginToNum = parseFloat(editedSilverLowMarginToText);
    // You can now handle the edited content, e.g., save it to a variable or send it to the server.
    // For example:
    var finalLowMarginValue = '';
    if (silverLowValueToNum > 0) {
      finalLowMarginValue = silverLowValueToNum + editedSilverLowMarginToNum;
    } else {
      finalLowMarginValue = silverLowValueToNum - editedSilverLowMarginToNum;
    }
    document.getElementById("silverNewLowValue").innerHTML = finalLowMarginValue;
  });


  const silverHighValue = document.getElementById("silverHighValue");
  const silverHighValueToText = silverHighValue.textContent.trim();
  const silverHighValueToNum = parseFloat(silverHighValueToText);
  document.getElementById("silverNewHighValue").innerHTML = silverHighValueToNum;
  const silverHighMargin = document.getElementById("silverHighMargin");
  const isHighValueEditable = silverHighMargin.getAttribute("contenteditable") === "true";
  silverHighMargin.setAttribute("contenteditable", isEditable ? "false" : "true");
  // Focus on the div to make it easier for the user to start editing
  if (isHighValueEditable) {
    silverHighMargin.blur();
  } else {
    silverHighMargin.focus();
  }
  silverHighMargin.addEventListener("input", function () {
    // This event handler will be triggered when the content is edited.
    const editedSilverHighMarginToText = silverHighMargin.textContent.trim();
    const editedSilverHighMarginToNum = parseFloat(editedSilverHighMarginToText);
    // You can now handle the edited content, e.g., save it to a variable or send it to the server.
    // For example:
    var finalHighMarginValue = '';
    if (silverHighValueToNum > 0) {
      finalHighMarginValue = silverHighValueToNum + editedSilverHighMarginToNum;
    } else {
      finalHighMarginValue = silverHighValueToNum - editedSilverHighMarginToNum;
    }
    document.getElementById("silverNewHighValue").innerHTML = finalHighMarginValue;
  });
}
