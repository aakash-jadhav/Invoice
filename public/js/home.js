$(document).ready(function () {
  console.log("V18");
  $("#search").focus();
  $(".modal").modal({
    onOpenStart: function () {
      $("#invoiceNo").val(Math.floor(Math.random() * 1000000 + 1));
      let today = new Date();
      $(".datepicker").datepicker();
      $("#issueDate").datepicker({
        defaultDate: today,
        setDefaultDate: true,
      });
    },
    onCloseEnd: function () {
      $("input").val("");
      $(".extra").remove();
      $("#status").prop("checked", false);
      $("#totalAmt").text("");
    },
  });
});

const auth = firebase.auth();
const db = firebase.firestore();
let emailId;
function logout() {
  console.log("Logout clicked");
  firebase.auth().signOut();
}

firebase.auth().onAuthStateChanged((firebaseUser) => {
  if (firebaseUser) {
    emailId = firebaseUser.email;
    console.log(emailId);
    const verify = firebaseUser.emailVerified;

    if (!verify) {
      firebase.auth().signOut();
      M.toast({ html: "Email address is not verified" });
    }
    fetchData();
  } else {
    window.location.href = "login.html";
    console.log("No user");
  }
});

function fetchData() {
  db.collection(emailId).onSnapshot((snapshot) => {
    $(".progressbar").remove();
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        display(change.doc.data());
      } else if (change.type == "removed") {
        let id = change.doc.id;
        $(`#${id}`).remove();
      } else if (change.type == "modified") {
        let id = change.doc.id;
        $(`#${id}`).remove();
        display(change.doc.data());
      }
    });
  });
}
//used in create new invoice modal
function addMore() {
  console.log("Add more function");
  const div = document.getElementById("products");
  var html = `
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
//used in edit modal
function add() {
  console.log("Add more function");
  let div = document.getElementById("addProducts");
  var html = `
  <div id="products" class = "extra">
    <div class="row">
      <div class="input-field col s12 m4">
        <input
          type="text"
          class="eproduct"
          placeholder="Product/Service"
        />
      </div>
      <div class="input-field col s12 m4">
        <input type="number" class="equantity" placeholder="Quantity" />
      </div>
      <div class="input-field col s12 m4">
        <input type="number" class="ecost" placeholder="Cost" onkeyup="calculateCost()" />
      </div>
    </div>
  </div>`;

  let wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  div.appendChild(wrapper);
}

//change total amount on enter of value
function calculateCost() {
  let total = 0;

  $(".cost").each(function () {
    total += Number($(this).val());
  });
  $("#totalAmt").text(total);

  $(".ecost").each(function () {
    total += Number($(this).val());
  });
  $(".totalAmt").text(total);
}

function save() {
  let invoice = {
    invoiceNumber: $("#invoiceNo").val(),
    issueDate: $("#issueDate").val(),
    dueDate: $("#dueDate").val(),
    clientName: $("#clientName").val(),
    contactNumber: $("#contactNumber").val(),
    email: $("#email").val(),
    products: [],

    status: $("#status").prop("checked") ? "Paid" : "Unpaid",
    statusColor: $("#status").prop("checked") ? "green-text" : "amber-text",

    totalAmt: $("#totalAmt").text(),
  };

  for (let i = 0; i < $(".product").length; ++i) {
    let product = {};
    $(".product").each(function (index) {
      if (index == i) {
        product.name = $(this).val();
      }
    });
    $(".quantity").each(function (index) {
      if (index == i) {
        product.quantity = $(this).val();
      }
    });
    $(".cost").each(function (index) {
      if (index == i) {
        product.cost = $(this).val();
      }
    });
    // M.toast({ html: product.name });
    invoice.products.push(product);
  }

  console.log(JSON.stringify(invoice));

  firestore(invoice);
}

function firestore(obj) {
  db.collection(emailId)
    .doc(obj.invoiceNumber)
    .set(obj)
    .then(() => {
      console.log("Data saved successfully");
    })
    .catch(() => {
      console.log("Error occurred in saving data");
    });
}

function display(obj) {
  let container = $(".main");
  let code = `
  <div class="col s12 m5 l4"  id="${obj.invoiceNumber}">
  <div class="card-panel">
  <p class="flow-text">
    ${obj.clientName}
  </p>

  <span class="grey-text text-darken-2"
    >Invoice #: ${obj.invoiceNumber}
  </span>
  <p class="grey-text text-darken-2">Issue Date:${obj.issueDate}</p>
  <p class="grey-text text-darken-2">Due Date: ${obj.dueDate}</p>
  <p class="grey-text text-darken-2">Total Amount:${obj.totalAmt}</p>
  <p class="${obj.statusColor}">
    Status:${obj.status} 
  </p>

  <p>
    <a
    href="#editModal"
    id = ${obj.invoiceNumber}
    onclick = "change(id)"
      class="btn-floating blue darken-1 hoverable waves-effect waves-light round modal-trigger"
      ><i class="material-icons">edit</i>Edit</a
    >
    <a 
      
      id = ${obj.invoiceNumber}
      onclick = "remove(id)"
      class="btn-floating red darken-1 hoverable waves-effect waves-light right"
      ><i class="material-icons">delete </i>Remove</a
    >
  </p>
</div>
</div>`;
  $(code).appendTo(container);
}

function remove(id) {
  db.collection(emailId).doc(id).delete();
}
function search(name) {
  console.log("Searching", name);
  if (name === "") {
    location.reload();
  }
  let ref = db.collection(emailId);
  let query = ref.where("clientName", "==", name);
  ref
    .where("clientName", "==", name)
    .get()
    .then(function (docs) {
      docs.forEach((doc) => {
        if (doc.exists) {
          // console.log(doc.id, "=>", doc.data());
          $(".main").empty();
          display(doc.data());
          console.log("Display function called from search");
        }
      });
    });
}

let data;
//edit
function change(id) {
  console.log("change function");
  let docRef = db.collection(emailId).doc(id);
  docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        // console.log(JSON.stringify(doc.data()));
        data = doc.data();
        edit(doc.data());
      } else {
        console.log("No such document");
      }
    })
    .catch(function (e) {
      console.log("Error getting the document", e);
    });
}

function edit(obj) {
  console.log("edit function");
  $("h5").text(obj.clientName);
  $(".iNumber").val(obj.invoiceNumber);
  $(".issueDate").val(obj.issueDate);
  $(".dueDate").val(obj.dueDate);
  $(".clientName").val(obj.clientName);
  $(".contactNumber").val(obj.contactNumber);
  $(".email").val(obj.email);
  let eProducts = "";
  for (x of obj.products) {
    eProducts = `<div class="divider extra"></div>
    <div id="products" class = "extra">
      <div class="row">
        <div class="input-field col s12 m4">
          <input
            type="text"
            class="eproduct"
            placeholder="Product/Service"
            value = "${x.name}"
          />
        </div>
        <div class="input-field col s12 m4">
          <input type="number" class="equantity" placeholder="Quantity" 
          value="${x.quantity}"/>
        </div>
        <div class="input-field col s12 m4">
          <input type="number" class="ecost" placeholder="Cost" onkeyup="calculateCost()"
          value="${x.cost}" />
        </div>
      </div>
    </div>`;
    $("#addProducts").append(eProducts);
  }
  if (obj.status === "Unpaid") {
    $(".status").prop("checked", false);
  } else {
    $(".status").prop("checked", true);
  }

  $(".totalAmt").text(obj.totalAmt);
}

function saveChanges() {
  let invoice = {
    invoiceNumber: $(".iNumber").val(),
    issueDate: $(".issueDate").val(),
    dueDate: $(".dueDate").val(),
    clientName: $(".clientName").val(),
    contactNumber: $(".contactNumber").val(),
    email: $(".email").val(),
    products: [],

    status: $(".status").prop("checked") ? "Paid" : "Unpaid",
    statusColor: $(".status").prop("checked") ? "green-text" : "amber-text",

    totalAmt: $(".totalAmt").text(),
  };

  for (let i = 0; i < $(" #editModal .eproduct").length; ++i) {
    let product = {};
    $(".eproduct").each(function (index) {
      if (index == i) {
        product.name = $(this).val();
      }
    });
    $(".equantity").each(function (index) {
      if (index == i) {
        product.quantity = $(this).val();
      }
    });
    $(".ecost").each(function (index) {
      if (index == i) {
        product.cost = $(this).val();
      }
    });
    // M.toast({ html: product.name });
    invoice.products.push(product);
  }

  console.log(JSON.stringify(invoice));
  firestore(invoice);
}

function generatePDF() {
  let array = [
    [
      { text: "Name", bold: true, alignment: "center" },
      { text: "Quantity", bold: true, alignment: "center" },
      { text: "Cost", bold: true, alignment: "center" },
    ],
  ];
  let source = data.products;
  for (x of source) {
    let row = [];
    row.push(x.name);
    row.push(x.quantity);
    row.push(x.cost);
    array.push(row);
  }
  console.log("Array:" + array);
  var docDefinition = {
    content: [
      {
        text: "Invoice",
        fontSize: 22,
        bold: true,
        alignment: "center",
        lineHeight: 2,
      },
      {
        columns: [
          {
            width: "33.33%",
            text: `Invoice Number: ${data.invoiceNumber} `,
          },
          {
            width: "33.33%",
            text: `Issue Date: ${data.issueDate}`,
          },
          {
            width: "33%.33",
            text: `Due Date: ${data.dueDate}`,
          },
        ],
        // optional space between columns
        columnGap: 10,
      },
      { text: "", margin: [10, 10, 10, 10] },

      {
        table: {
          heights: [20, 20, 20],

          widths: ["auto", "auto"],
          body: [
            [{ text: "Client Name " }, `${data.clientName}`],
            [{ text: "Contact Number " }, `${data.contactNumber}`],
            [{ text: "Email " }, `${data.email}`],
          ],
        },
      },

      { text: "", margin: [10, 10, 10, 10] },

      {
        table: {
          heights: function () {
            return 20;
          },

          headerRows: 1,
          widths: ["*", "*", "*"],

          body: array,
        },
      },
      {
        text: `Total amount: ${data.totalAmt}`,
        bold: true,
        alignment: "right",
        margin: [0, 20],
      },
      {
        text: `Status: ${data.status}`,
        alignment: "right",
      },
    ],
    defaultStyle: {
      fontSize: 14,
      alignment: "center",
    },
  };
  pdfMake.createPdf(docDefinition).open();
}
