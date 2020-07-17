$(document).ready(function () {
  $(".sidenav").sidenav();
  //   $(".materialboxed").materialbox();
  $(".slider").slider({
    fullWidth: true,
  });
  $(".scrollspy").scrollSpy();
  $(".parallax").parallax();
  $(".materialboxed").materialbox();
  $("textarea#message").characterCounter();
  $(".carousel").carousel({
    numVisible: 5,
    shift: 55,
    padding: 10,
  });
});

console.log("Mic check");
const txtName = document.getElementById("name");
const txtEmail = document.getElementById("email");
const txtMessage = document.getElementById("message");
const btnSubmit = document.getElementById("submit");

const db = firebase.firestore();

btnSubmit.addEventListener("click", (e) => {
  if (txtName.value && txtEmail.value && txtMessage.value) {
    console.log("Submit button clicked");
    db.collection("contact us").doc(txtName.value).set({
      name: txtName.value,
      email: txtEmail.value,
      message: txtMessage.value,
    });
    txtName.value = "";
    txtEmail.value = "";
    txtMessage.value = "";
    M.toast({ html: "Data sent successfully", classes: "rounded" });
  } else {
    M.toast({ html: "Values cannot be empty", classes: "rounded" });
  }
});
