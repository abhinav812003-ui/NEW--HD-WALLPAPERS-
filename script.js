// 🔴 FIREBASE CONFIG (PASTE YOUR OWN)
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

/* ---------- LOGIN ---------- */
function login(){
  const email = email.value;
  const password = password.value;

  auth.signInWithEmailAndPassword(email, password)
    .then(()=>loginStatus.innerText="Login success ✅")
    .catch(err=>loginStatus.innerText=err.message);
}

/* ---------- ADMIN UPLOAD ---------- */
auth.onAuthStateChanged(user=>{
  if(user && user.email === "admin@gmail.com"){
    document.getElementById("uploadBox")?.style.display="block";
  }
});

function uploadWallpaper(){
  const file = photoInput.files[0];
  const type = document.getElementById("type").value;
  const price = document.getElementById("price").value || 0;

  const ref = storage.ref("wallpapers/"+Date.now()+"_"+file.name);
  ref.put(file).then(snap=>{
    snap.ref.getDownloadURL().then(url=>{
      db.ref("wallpapers").push({
        url:url,
        type:type,
        price:price
      });
      status.innerText="Uploaded ✅";
    });
  });
}

/* ---------- LOAD WALLPAPERS ---------- */
db.ref("wallpapers").on("value", snap=>{
  const gallery = document.getElementById("gallery");
  const premiumGallery = document.getElementById("premiumGallery");

  if(gallery) gallery.innerHTML="";
  if(premiumGallery) premiumGallery.innerHTML="";

  snap.forEach(child=>{
    const d = child.val();

    if(d.type==="free" && gallery){
      gallery.innerHTML+=`
      <div class="card">
        <img src="${d.url}">
        <a href="${d.url}" download>Download</a>
      </div>`;
    }

    if(d.type==="premium" && premiumGallery){
      premiumGallery.innerHTML+=`
      <div class="card">
        <img src="${d.url}" class="lock">
        <p>₹${d.price}</p>
        <button onclick="buy()">Buy</button>
      </div>`;
    }
  });
});

function buy(){
  alert("Pay via UPI\nupi-id@bank\nAfter payment admin will unlock");
}