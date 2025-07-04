// luzon.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDoijFlD_hJ2mp4FstfSZO4qUPKIzEdmPs",
  authDomain: "hello-e7a6d.firebaseapp.com",
  projectId: "hello-e7a6d",
  storageBucket: "hello-e7a6d.appspot.com",
  messagingSenderId: "693146874206",
  appId: "1:693146874206:web:d37f7a3c823fcba4401fcf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Handle favorites
function setupFavorites() {
  const rows = document.querySelectorAll('.scroll-row');
  rows.forEach((row) => {
    const cards = row.querySelectorAll('.card');
    cards.forEach((card) => {
      if (!card.querySelector('.favorite-btn')) {
        const button = document.createElement('button');
        button.classList.add('favorite-btn');
        card.appendChild(button);

        const spotName = card.querySelector('h3').textContent;

        button.addEventListener('click', async () => {
          const user = auth.currentUser;
          if (!user) {
            alert('You must be logged in to favorite. Redirecting to login...');
            window.location.href = 'login.html';
            return;
          }

          try {
            const userDocRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
              const currentFavorites = userSnap.data().favorites || [];

              if (currentFavorites.includes(spotName)) {
                await updateDoc(userDocRef, {
                  favorites: arrayRemove(spotName),
                });
                button.classList.remove('favorited');
                alert(`${spotName} removed from favorites.`);
              } else {
                await updateDoc(userDocRef, {
                  favorites: arrayUnion(spotName),
                });
                button.classList.add('favorited');
                alert(`${spotName} added to favorites.`);
              }
            } else {
              await setDoc(userDocRef, {
                favorites: [spotName],
              });
              button.classList.add('favorited');
              alert(`${spotName} added to favorites.`);
            }
          } catch (error) {
            console.error('Error saving favorite:', error);
            alert('Failed to save favorite.');
          }
        });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setupFavorites();
    } else {
      console.log('Not logged in');
    }
  });
});
