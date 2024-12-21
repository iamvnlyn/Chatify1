import { 
  collection, addDoc, setDoc, doc, getDocs, serverTimestamp, query, orderBy, onSnapshot, where 
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { auth, firestoreDb } from "../firebase-config.js";

let selectedConversationId = null;

// ** Add User to Firestore on Signup/Login **
async function addUserToFirestore(user) {
  try {
    await setDoc(doc(firestoreDb, "users", user.uid), {
      displayName: user.displayName || user.email.split("@")[0], // Use email prefix as fallback
      email: user.email,
      createdAt: serverTimestamp(),
    });
    console.log("User added to Firestore");
  } catch (error) {
    console.error("Error adding user to Firestore:", error.message);
  }
}

// ** Send Message **
async function sendMessage(messageText) {
  if (!selectedConversationId) {
    alert("Please select a chat first.");
    return;
  }

  try {
    await addDoc(collection(firestoreDb, "messages", selectedConversationId, "messages"), {
      senderId: auth.currentUser.uid,
      text: messageText,
      timestamp: serverTimestamp(),
    });
    console.log("Message sent!");
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
}

// ** Load Messages **
function loadMessages(conversationId) {
  selectedConversationId = conversationId;
  const messagesContainer = document.querySelector(".chat-messages");

  const q = query(
    collection(firestoreDb, "messages", conversationId, "messages"),
    orderBy("timestamp", "asc")
  );

  onSnapshot(q, (snapshot) => {
    messagesContainer.innerHTML = "";
    snapshot.forEach((doc) => {
      const message = doc.data();
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message", message.senderId === auth.currentUser.uid ? "sent" : "received");
      messageDiv.innerHTML = `
        <p>${message.text}</p>
        <span class="time">${new Date(message.timestamp?.toDate()).toLocaleTimeString()}</span>
      `;
      messagesContainer.appendChild(messageDiv);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
}

// ** Load Chat List **
function loadChatList() {
  const chatListContainer = document.querySelector(".nav-menu");
  const q = query(collection(firestoreDb, "conversations"), where("participants", "array-contains", auth.currentUser.uid));

  onSnapshot(q, (snapshot) => {
    chatListContainer.innerHTML = "";
    snapshot.forEach((doc) => {
      const conversation = doc.data();
      const chatItem = document.createElement("li");
      chatItem.classList.add("nav-item");
      chatItem.innerHTML = `
        <i class="fa-solid fa-comments"></i>
        <span>${conversation.name || "Unnamed Chat"}</span>
      `;
      chatItem.addEventListener("click", () => {
        loadMessages(doc.id);
      });
      chatListContainer.appendChild(chatItem);
    });
  });
}

// ** Load Contacts List ** 
async function loadContacts() {
  const contactsContainer = document.querySelector(".contacts-list"); // Adjust based on your HTML structure
  const q = query(collection(firestoreDb, "users"));

  try {
    const querySnapshot = await getDocs(q);
    contactsContainer.innerHTML = ""; // Clear existing contacts
    querySnapshot.forEach((doc) => {
      const user = doc.data();
      if (user.uid !== auth.currentUser.uid) { // Don't show the logged-in user as a contact
        const contactDiv = document.createElement("div");
        contactDiv.classList.add("contact");
        contactDiv.innerHTML = `
          <span>${user.displayName || user.email}</span>
          <button class="start-chat-btn" data-contact-id="${doc.id}">Message</button>
        `;
        contactsContainer.appendChild(contactDiv);
      }
    });

    // Add event listeners to all "Message" buttons after they are created
    const messageButtons = document.querySelectorAll(".start-chat-btn");
    messageButtons.forEach(button => {
      button.addEventListener("click", (event) => {
        const contactUid = event.target.getAttribute("data-contact-id");
        startChat(contactUid);
      });
    });

  } catch (error) {
    console.error("Error loading contacts:", error.message);
  }
}

// ** Start a Chat **
async function startChat(contactUid) {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    alert("You must be logged in to start a chat.");
    return;
  }

  try {
    // Add new conversation with both users as participants
    const conversationRef = await addDoc(collection(firestoreDb, "conversations"), {
      participants: [currentUser.uid, contactUid], // Ensure both users are participants
      createdAt: serverTimestamp(),
    });
    console.log("Chat started with conversation ID:", conversationRef.id);
    loadMessages(conversationRef.id); // Load messages in the chat view
  } catch (error) {
    console.error("Error starting chat:", error.message);
  }
}

// ** Logout **
document.querySelector("#logout-tab").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "../index.html";
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
});

// ** Authentication State Listener **
onAuthStateChanged(auth, (user) => {
  if (user) {
    addUserToFirestore(user);
    loadChatList();
    loadContacts();
  } else {
    window.location.href = "../index.html";
  }
});

// ** Send Button Listener **
document.querySelector(".send").addEventListener("click", () => {
  const messageInput = document.querySelector(".chat-input input");
  const messageText = messageInput.value.trim();
  if (messageText) {
    sendMessage(messageText);
    messageInput.value = "";
  }
});
