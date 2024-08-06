import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { app } from '../../../config/db.js';


const db = getFirestore(app);
const auth = getAuth(app);

// DOM elements
const spreadInput = document.getElementById('spreadInput');
const addSpreadBtn = document.getElementById('addSpreadBtn');
const spreadTable = document.getElementById('spreadTable');


// Add spread button click event
addSpreadBtn.addEventListener('click', function () {
    const spreadValue = parseFloat(spreadInput.value);

    // Get the UID of the authenticated user
    const uid = sessionStorage.getItem('uid');

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    const dataToSave = {
        value: spreadValue
    };

    // Reference to the user's profile collection
    const userCollectionRef = collection(db, `users/${uid}/customSpread`);

    if (userCollectionRef) {
        // Create a new document
        addDoc(userCollectionRef, dataToSave)
            .then((docRef) => {
                console.log('Data successfully added to Firestore');

                displaySpreads()
                spreadInput.value = '';
            })
            .catch((error) => {
                console.error('Error adding data to Firestore: ', error);
            });
    }
});


//
function displaySpreads() {
    // Get the UID of the authenticated user
    const uid = sessionStorage.getItem('uid');

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    // Reference to the user's spreads collection
    const userCollectionRef = collection(db, `users/${uid}/customSpread`);

    // Get all documents in the collection
    getDocs(userCollectionRef)
        .then((querySnapshot) => {
            // Clear existing table rows
            spreadTable.innerHTML = '';

            // Counter for numbering rows
            let index = 1;

            // Display the data
            querySnapshot.forEach((doc) => {
                const spreadData = doc.data();

                // Document ID
                const documentId = doc.id;

                // Create a table row
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <th scope="row">${index}</th>
                    <td>${spreadData.value}</td>
                    <td>
                        <button class="btn btn-danger delete-btn" data-id="${documentId}">Delete</button>
                    </td>
                `;

                // Add event listener to the delete button
                const deleteButton = tr.querySelector('.delete-btn');
                deleteButton.addEventListener('click', () => {
                    const documentId = deleteButton.getAttribute('data-id');
                    deleteSpread(documentId);
                });

                // Append row to the table
                spreadTable.appendChild(tr);

                // Increment index
                index++;
            });
        })
        .catch((error) => {
            console.error('Error reading data from Firestore: ', error);
        });
}

// Function to delete a news item
function deleteSpread(documentId) {
    const uid = sessionStorage.getItem('uid');
    const userCollectionRef = collection(db, `users/${uid}/customSpread`);

    // Delete the document with the specified ID
    deleteDoc(doc(userCollectionRef, documentId))
        .then(() => {
            console.log('Document successfully deleted!');
            // Update the UI to reflect the deletion
            displaySpreads()
        })
        .catch((error) => {
            console.error('Error deleting document: ', error);
        });
}

displaySpreads()