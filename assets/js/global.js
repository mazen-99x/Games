let user = document.querySelector(".user");
let button = document.querySelector(".header .button");
let buttons = document.querySelector("#header .buttons");
let signout = document.querySelector(".signout");
let open_btn = document.querySelector(".btn_open_menu");
let header = document.querySelector(".header");
const confirmModal = document.getElementById("confirmModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmMessage = document.getElementById("confirmMessage");
open_btn.addEventListener("click", function () {
  header.classList.toggle("active");
});
buttons.style.display = "none";
if (localStorage.getItem("userName") != null) {
  button.style.display = "none";
  buttons.style.display = "flex";

  user.innerHTML = `welcome ${localStorage.getItem("userName")}`;
}

// Function to show the confirmation modal
function showConfirmModal(message, onConfirm, onCancel) {
  // Set the confirmation message
  confirmMessage.innerText = message;

  // Display the modal
  confirmModal.classList.add("show");

  // Handle confirmation
  confirmYes.onclick = function () {
    confirmModal.classList.remove("show"); // Hide modal
    if (onConfirm) onConfirm(); // Execute confirm action
  };

  // Handle cancellation
  confirmNo.onclick = function () {
    confirmModal.classList.remove("show"); // Hide modal
    if (onCancel) onCancel(); // Execute cancel action
  };
}

// Example usage
document.querySelector(".signout").addEventListener("click", function () {
  showConfirmModal(
    "Are you sure you want to Signout?",
    function () {
      Signout();
    },
    function () {
      // Cancellation action
      return;
    }
  );
});
function Signout() {
  localStorage.removeItem("userName");
  button.style.display = "block";
  buttons.style.display = "none";
  window.location.href = "index.html";
}

$("#gototop").on("click", function () {
  $("body,html").animate({ scrollTop: 0 }, 2000);
});

$(document).ready(function () {
  $(".loading").fadeOut(2000, function () {
    $(".loading").css("display", "none");
    ("");
  });
});
