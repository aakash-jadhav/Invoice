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

//TODO:Add more button functionality
function addMore() {
  console.log("Add more button clicked");
  const div = document.getElementById("products");
  var html = `<div class="divider extra"></div>
  <div id="products" class = "extra">
    <div class="row">
      <div class="input-field col s12 m4">
        <input
          type="text"
          class="product"
          placeholder="Product/Service"
        />
      </div>
      <div class="input-field col s12 m4">
        <input type="number" class="quantity" placeholder="Quantity" />
      </div>
      <div class="input-field col s12 m4">
        <input type="number" class="cost" placeholder="Cost" />
      </div>
    </div>
  </div>`;

  var wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  div.appendChild(wrapper);
}

//change total amount on enter of value
let total = 0;
$(".cost").keyup(function () {
  total += $this.val();
  $("span#totalAmt").text(total);
});
// $(".cost").on("change keyup", function (e) {
//   $("#totalAmt").text(e.value);
// });

function save() {
  console.log("Save button clicked");
}

function cancel() {
  $("input").val("");
  $(".extra").remove();
}
