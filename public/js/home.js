$(document).ready(function () {
  $(".modal").modal();
  // M.textareaAutoResize($("#address"));
});

const auth = firebase.auth();

function logout() {
  console.log("Logout clicked");
  firebase.auth().signOut();
}

firebase.auth().onAuthStateChanged((firebaseUser) => {
  if (firebaseUser) {
    console.log("Checking user");
    console.log(firebaseUser);
    const verify = firebaseUser.emailVerified;
    console.log(verify);
    if (!verify) {
      firebase.auth().signOut();
      M.toast({ html: "Email address is not verified" });
    }
  } else {
    window.location.href = "login.html";
    console.log("No user");
  }
});
