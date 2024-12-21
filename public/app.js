import { app, auth, database, firestoreDb } from './firebase-config.js';

console.log(app);
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

// Show and hide loading spinner
function showLoadingSpinner() {
  const spinner = document.getElementById('spinner');
  if (spinner) spinner.style.display = 'block';
}

function hideLoadingSpinner() {
  const spinner = document.getElementById('spinner');
  if (spinner) spinner.style.display = 'none';
}

// Wait for the DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-button');
  const forgotPasswordLink = document.getElementById('forgot-password');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // Handle Login
  loginButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    try {
      showLoadingSpinner();
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in');

      // Redirect to the dashboard
      window.location.href = './message/index.html';
    } catch (error) {
      console.error('Login failed:', error.code, error.message);
      if (error.code === 'auth/user-not-found') {
        alert('No user found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        alert('Incorrect password.');
      } else {
        alert('Login failed. Please try again.');
      }
    } finally {
      hideLoadingSpinner();
    }
  });

  // Handle Forgot Password
  forgotPasswordLink.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      alert('Please enter your email to reset your password.');
      return;
    }

    try {
      showLoadingSpinner();
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Error resetting password:', error.code, error.message);
      if (error.code === 'auth/user-not-found') {
        alert('No user found with this email.');
      } else {
        alert('Failed to send password reset email. Try again.');
      }
    } finally {
      hideLoadingSpinner();
    }
  });
});
