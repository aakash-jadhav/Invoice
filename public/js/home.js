$(document).ready(function () {
  $(".modal").modal({
    onOpenStart: function () {
      $("#invoiceNo").val(Math.floor(Math.random() * 1000000 + 1));
      // M.toast({ html: "Modal open" });
    },
    onCloseEnd: function () {
      $("input").val("");
      $(".extra").remove();
      $("#status").prop("checked", false);
      $("#totalAmt").text("");
    },
  });
  let today = new Date();
  $(".datepicker").datepicker();
  $("#issueDate").datepicker({
    defaultDate: today,
    setDefaultDate: true,
  });
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
        <input type="number" class="cost" placeholder="Cost" onkeyup="calculateCost()" />
      </div>
    </div>
  </div>`;

  var wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  div.appendChild(wrapper);
}

//change total amount on enter of value
function calculateCost() {
  let total = 0;

  $(".cost").each(function () {
    total += Number($(this).val());
  });
  // total += Number($(".cost").val());
  // M.toast({ html: typeof total });
  $("#totalAmt").text(total);
}

function save() {
  console.log("Save button clicked");
  M.toast({ html: $(".product").length });
  let invoice = {
    invoiceNumber: $("#invoiceNo").val(),
    issueDate: $("#issueDate").val(),
    dueDate: $("#dueDate").val(),
    clientName: $("#clientName").val(),
    contactNumber: $("#contactNumber").val(),
    email: $("#email").val(),
    products: [],
    //   product: $(".product").val(),
    //   quantity: $(".quantity").val(),
    //   cost: $(".cost").val(),
    // },
    status: $("#status").prop("checked") ? "Paid" : "Unpaid",
    totalAmt: $("#totalAmt").text(),
  };
  for (let i = 0; i < $(".product").length; ++i) {
    let product = {};
    $(".product").each(function (index) {
      if (index == i) {
        product.name = $(this).val();
      }
    });
    (product.quantity = $(".quantity").val()),
      (product.cost = $(".cost").val());
    invoice.products.push(product);
  }

  console.log(JSON.stringify(invoice));
  console.log(invoice);
}
