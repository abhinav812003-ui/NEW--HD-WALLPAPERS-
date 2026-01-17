/****************************
 🔥 FIREBASE CONFIG
 ****************************/
const firebaseConfig = {
  apiKey: rzp_test_S3moPHj3QE7syA
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

/****************************
 🔐 AUTH STATE CHECK
 ****************************/
auth.onAuthStateChanged(user => {
  const uploadBox = document.getElementById("uploadBox");

  if (uploadBox) {
    if (user && user.email === "admin@gmail.com") {
      uploadBox.style.display = "block"; // admin only
    } else {
      uploadBox.style.display = "none";
    }
  }
});

/****************************
 🔑 LOGIN
 ****************************/
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("loginStatus");

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      status.innerText = "Login successful ✅";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    })
    .catch(error => {
      status.innerText = error.message;
    });
}

/****************************
 ⬆️ UPLOAD WALLPAPER (ADMIN)
 ****************************/
function uploadWallpaper() {
  const fileInput = document.getElementById("photoInput");
  const type = document.getElementById("type").value;
  const price = document.getElementById("price").value || 0;
  const status = document.getElementById("status");

  if (!fileInput.files[0]) {
    status.innerText = "Please select an image ❌";
    return;
  }

  const file = fileInput.files[0];
  const filePath = "wallpapers/" + Date.now() + "_" + file.name;
  const storageRef = storage.ref(filePath);

  status.innerText = "Uploading... ⏳";

  storageRef.put(file).then(snapshot => {
    snapshot.ref.getDownloadURL().then(url => {
      db.ref("wallpapers").push({
        url: url,
        type: type,
        price: price
      });
      status.innerText = "Upload successful ✅";
      fileInput.value = "";
    });
  }).catch(err => {
    status.innerText = "Upload failed ❌";
  });
}

/****************************
 🖼️ LOAD WALLPAPERS
 ****************************/
db.ref("wallpapers").on("value", snapshot => {

  const gallery = document.getElementById("gallery");
  const premiumGallery = document.getElementById("premiumGallery");

  if (gallery) gallery.innerHTML = "";
  if (premiumGallery) premiumGallery.innerHTML = "";

  snapshot.forEach(child => {
    const data = child.val();

    // FREE WALLPAPERS
    if (data.type === "free" && gallery) {
      gallery.innerHTML += `
        <div class="card">
          <img src="${data.url}">
          <a href="${data.url}" download>Download</a>
        </div>
      `;
    }

    // PREMIUM WALLPAPERS
    if (data.type === "premium" && premiumGallery) {
      premiumGallery.innerHTML += `
        <div class="card">
          <img src="${data.url}" class="lock">
          <p>₹${data.price}</p>
          <button onclick="buyPremium()">Buy</button>
        </div>
      `;
    }
  });
});

/****************************
 💰 BUY PREMIUM (UPI MANUAL)
 ****************************/
function buyPremium() {
  alert(
    "Pay via UPI\n\nUPI ID: yourupi@bank\nAmount as shown\n\nAfter payment, admin will unlock manually."
  );
}