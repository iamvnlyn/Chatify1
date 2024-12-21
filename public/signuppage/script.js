import { auth, database, ref, set } from '../firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const signupButton = document.getElementById('signup-button');
  const errorMessage = document.getElementById('error-message');  // Display error message

  signupButton.addEventListener('click', (event) => {
    event.preventDefault();
    
    // Clear previous error message
    errorMessage.textContent = '';

    // Get form values
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // Validate input
    if (!username || !email || !password || !confirmPassword) {
      errorMessage.textContent = 'All fields are required.';
      return;
    }

    if (password !== confirmPassword) {
      errorMessage.textContent = 'Passwords do not match.';
      return;
    }

    if (password.length < 6) {
      errorMessage.textContent = 'Password must be at least 6 characters long.';
      return;
    }

    // Firebase Signup
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Update user profile with username
        return updateProfile(user, { displayName: username }).then(() => {
          // Save additional user data in Firebase Realtime Database
          const userRef = ref(database, `users/${user.uid}`);
          set(userRef, {
            username: username,
            email: email,
            createdAt: new Date().toISOString(),
          }).then(() => {
            // Auto login after successful signup
            return signInWithEmailAndPassword(auth, email, password);
          });
        });
      })
      .then(() => {
        // Redirect after successful signup and login
        alert('Signup and login successful! Redirecting...');
        window.location.href = '../message/index.html'; // Adjust path as needed
      })
      .catch((error) => {
        console.error('Signup failed:', error.message);
        errorMessage.textContent = `Signup failed: ${error.message}`;
      });
  });
});
