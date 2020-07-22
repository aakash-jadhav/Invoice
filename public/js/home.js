const auth = firebase.auth();

function logout() {
  console.log("Logout clicked");
  firebase.auth().signOut();
}

firebase.auth().onAuthStateChanged((firebaseUser) => {
  if (firebaseUser) {
    console.log(firebaseUser);
  } else {
    window.location.href = "login.html";
    console.log("No user");
  }
});
