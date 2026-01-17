// 🔴 FIREBASE CONFIG (PASTE YOUR OWN)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const database = firebase.database();

const gallery = document.getElementById("gallery");

// Upload wallpaper
function uploadPhoto() {
  const file = document.getElementById("photoInput").files[0];
  const status = document.getElementById("status");

  if (!file) {
    status.innerText = "Please select an image";
    return;
  }

  const ref = storage.ref("wallpapers/" + Date.now() + "_" + file.name);
  const task = ref.put(file);

  status.innerText = "Uploading...";

  task.on(
    "state_changed",
    null,
    () => status.innerText = "Upload failed ❌",
    () => {
      task.snapshot.ref.getDownloadURL().then(url => {
        database.ref("wallpapers").push({ url: url });
        status.innerText = "Upload successful ✅";
      });
    }
  );
}

// Load wallpapers
database.ref("wallpapers").on("value", snapshot => {
  if (!gallery) return;

  gallery.innerHTML = "";
  snapshot.forEach(child => {
    const data = child.val();
    const key = child.key;

    gallery.innerHTML += `
      <div class="card">
        <img src="${data.url}">
        <button onclick="deleteWallpaper('${key}','${data.url}')">Delete</button>
      </div>
    `;
  });
});

// Delete wallpaper
function deleteWallpaper(key, url) {
  if (!confirm("Delete this wallpaper?")) return;

  const ref = storage.refFromURL(url);
  ref.delete().then(() => {
    database.ref("wallpapers/" + key).remove();
  });
}