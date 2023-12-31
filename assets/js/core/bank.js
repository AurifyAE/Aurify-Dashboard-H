

function displayBankLogo() {
    var selectedBank = document.getElementById("bankName").value;
    var bankLogo = document.getElementById("bank-logo");

    // Define image sources for each bank
    var bankImageMap = {
        "bank1": "../../img/bank/FBAB.jpg",
        "bank2": "path/to/bank2-logo.png",
        "bank3": "path/to/bank3-logo.png",
        "bank4": "path/to/bank1-logo.png",
        "bank5": "path/to/bank1-logo.png",
        "bank6": "path/to/bank1-logo.png",
        "bank7": "path/to/bank1-logo.png",
        "bank8": "path/to/bank1-logo.png",
        "bank9": "path/to/bank1-logo.png",
        "bank10": "path/to/bank1-logo.png",
        "bank11": "path/to/bank1-logo.png",
        "bank12": "path/to/bank1-logo.png",
        "bank13": "path/to/bank1-logo.png",
        "bank14": "path/to/bank1-logo.png",
        "bank15": "path/to/bank1-logo.png",
        "bank16": "path/to/bank1-logo.png",
        "bank17": "path/to/bank1-logo.png",
        "bank18": "path/to/bank1-logo.png",
        "bank19": "path/to/bank1-logo.png",
        "bank20": "path/to/bank1-logo.png",
        "bank21": "path/to/bank1-logo.png",
        "bank22": "path/to/bank1-logo.png",
        "bank23": "path/to/bank1-logo.png",
        "bank24": "path/to/bank1-logo.png",
        "bank25": "path/to/bank1-logo.png",
        "bank26": "path/to/bank1-logo.png",
        "bank27": "path/to/bank1-logo.png",
        "bank28": "path/to/bank1-logo.png",
        "bank29": "path/to/bank1-logo.png",
        "bank30": "path/to/bank1-logo.png",
        "bank31": "path/to/bank1-logo.png",
        "bank32": "path/to/bank1-logo.png",
        "bank33": "path/to/bank1-logo.png",
        "bank34": "path/to/bank1-logo.png",
        "bank35": "path/to/bank1-logo.png",
        "bank36": "path/to/bank1-logo.png",
        "bank37": "path/to/bank1-logo.png",
        "bank38": "path/to/bank1-logo.png",
        "bank39": "path/to/bank1-logo.png",
        "bank40": "path/to/bank1-logo.png",
        "bank41": "path/to/bank1-logo.png",
        "bank42": "path/to/bank1-logo.png",
        "bank43": "path/to/bank1-logo.png",
        "bank44": "path/to/bank1-logo.png",
        "bank45": "path/to/bank1-logo.png",
        "bank46": "path/to/bank1-logo.png",
        "bank47": "path/to/bank1-logo.png",
        "bank48": "path/to/bank1-logo.png",
        "bank49": "path/to/bank1-logo.png",
        "bank50": "path/to/bank1-logo.png",
        "bank51": "path/to/bank1-logo.png",
        "bank52": "path/to/bank1-logo.png",
        "bank53": "path/to/bank1-logo.png",
        "bank54": "path/to/bank1-logo.png",
        "bank55": "path/to/bank1-logo.png",
        "bank56": "path/to/bank1-logo.png",
        // Add more entries as needed
    }; "path/to/bank1-logo.png"
    "path/to/bank1-logo.png"
    if (selectedBank !== "select") {
        // Display the selected bank's logo
        bankLogo.src = bankImageMap[selectedBank];
        bankLogo.style.display = "block";
    } else {
        // If "Select a Bank" is chosen, hide the logo
        bankLogo.style.display = "none";
    }
}