$(document).ready(function () {
  $(".modal").modal();
});
console.log("Ready v6");
const auth = firebase.auth();
const lemail = document.getElementById("email");
const lpass = document.getElementById("pass");
const femail = document.getElementById("f-pass");
const fpassword = document.getElementById("remail");
const activeEmail = document.getElementById("active-label");

const sPass = document.getElementById("s-pass");
const cPass = document.getElementById("c-pass");
const sEmail = document.getElementById("s-email");
const sName = document.getElementById("s-name");

fpassword.addEventListener("click", (e) => {
  femail.value = lemail.value;
  activeEmail.classList.add("active");
});

function loginFunction() {
  console.log("login button clicked");
  const promise = auth.signInWithEmailAndPassword(lemail.value, lpass.value);
  promise.then(() => {
    M.toast({ html: "Signing in ", classes: "rounded" });
  });
  promise.catch((e) => {
    console.log(e.message);
    M.toast({ html: e.code, classes: "rounded" });
  });
}

function forgotPassword() {
  console.log("Forget password");
  auth
    .sendPasswordResetEmail(femail.value)
    .then(() => {
      M.toast({ html: "Email sent successfully ", classes: "rounded" });
      console.log("Email sent successfully");
    })
    .catch((e) => {
      M.toast({ html: e.code, classes: "rounded" });
      console.log(e.message);
    });
}

function createAccount() {
  console.log("create account button clicked");
  if (sPass.value && sEmail.value && cPass.value && sName.value) {
    if (sPass.value === cPass.value) {
      console.log("The two passwords are same");
      const promise = auth.createUserWithEmailAndPassword(
        sEmail.value,
        cPass.value
      );
      promise.then((result) => {
        M.toast({ html: "Account created ", classes: "rounded" });
        let user = firebase.auth().currentUser;
        user
          .sendEmailVerification()
          .then(() => {
            M.toast({
              html: "Email sent for verification",
              classes: "rounded",
            });
            console.log("Verify your email");
          })
          .catch((e) => {
            console.log(e.code);
          });

        return result.user.updateProfile({
          displayName: sName.value,
        });
      });
      promise.catch((e) => {
        console.log(e.code);
        M.toast({ html: "Cannot create account", classes: "rounded" });
      });
      //LOGIC
    } else {
      console.log("Passwords must be same");
    }
  } else {
    M.toast({ html: "Values cannot be empty", classes: "rounded" });
  }
}

//Sign in with google
function googleSignin() {
  let provider = new firebase.auth.GoogleAuthProvider();
  const promise = firebase.auth().signInWithPopup(provider);
  promise.catch((e) => {
    console.log(e.code);
  });
}

//realtime listner
firebase.auth().onAuthStateChanged((firebaseUser) => {
  if (firebaseUser) {
    console.log(firebaseUser);
    if (firebaseUser.emailVerified) {
      window.location.href = "home.html";
    } else {
      M.toast({ html: "Email address not verified", classes: "rounded" });
      firebase.auth().signOut();
    }
  } else {
    console.log("not logged in");
  }
});
