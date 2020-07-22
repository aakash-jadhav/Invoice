$(document).ready(function () {
  $(".modal").modal();
});
console.log("Ready v2");
const auth = firebase.auth();
const lemail = document.getElementById("email");
const lpass = document.getElementById("pass");

function loginFunction() {
  console.log("login button clicked");
  const promise = auth.signInWithEmailAndPassword(lemail.value, lpass.value);
  promise.then(() => {
    M.toast({ html: "Signing in " });
  });
  promise.catch((e) => {
    console.log(e.message);
    M.toast({ html: "Something went wrong" });
  });
}
function createAccount() {
  console.log("create account button clicked");
}

//realtime listner
firebase.auth().onAuthStateChanged((firebaseUser) => {
  if (firebaseUser) {
    console.log(firebaseUser);
    window.location.href = "home.html";
  } else {
    console.log("not logged in");
  }
});
