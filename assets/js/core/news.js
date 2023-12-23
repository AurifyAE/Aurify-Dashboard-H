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

const firestore = getFirestore(app);
const auth = getAuth(app);



const addNewsBtn = document.getElementById('addNewsBtn');
const newsModal = document.getElementById('newsModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const latestNewsArea = document.getElementById('latestNewsArea');
const deleteButtons = document.querySelectorAll('.delete-btn');

addNewsBtn.addEventListener('click', () => {
    newsModal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
    newsModal.style.display = 'none';
});

// Function to handle news submission
function uploadNews(event) {
    event.preventDefault(); // Prevent the form from submitting

    const newsTitle = document.getElementById('newsTitle').value;
    const newsContent = document.getElementById('newsContent').value;

    // Create a news element
    const newsItem = document.createElement('div');
    newsItem.classList.add('news-item');
    newsItem.innerHTML = `
          <h4>${newsTitle}</h4>
          <p>${newsContent}</p>
          <div class="news-item-buttons">
              <button class="btn btn-success">Edit</button>
              <button class="btn btn-danger delete-btn">Delete</button>
          </div>
      `;

    // Add the news element to the latest news area
    latestNewsArea.appendChild(newsItem);

    // Clear the form and close the modal
    document.getElementById('newsTitle').value = '';
    document.getElementById('newsContent').value = '';
    newsModal.style.display = 'none';

    // Add event listener to the new delete button
    const newDeleteButton = newsItem.querySelector('.delete-btn');
    newDeleteButton.addEventListener('click', () => {
        latestNewsArea.removeChild(newsItem);
    });
}

// Add an event listener to the news upload form
const uploadForm = document.querySelector('form');
uploadForm.addEventListener('submit', uploadNews);

// Add event listeners to existing delete buttons
deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const newsItem = button.parentElement.parentElement;
        latestNewsArea.removeChild(newsItem);
    });
});