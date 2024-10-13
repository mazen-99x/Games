let loginEmail = document.getElementById("loginemail");
let loginPassword = document.getElementById("loginpassword");
let loginBtn = document.getElementById("loginBtn");
let alert = document.getElementById("alert");
let userList = [];
if (localStorage.getItem("users") != null) {
  userList = JSON.parse(localStorage.getItem("users"));
}
document.title = "GamesReaper " + "Login";
function login() {
  if (emptyInputs() == true) {
    getalert("All inputs required.", "red");
  } else {
    if (checkLogin() == true) {
      window.location.href = "index.html";
    } else {
      // Incorrect login details
      getalert("Email or Password is wrong.", "red");
    }
  }
}

function getalert(text, color) {
  alert.style.display = "block";
  alert.innerHTML = text;
  alert.style.color = color;
}
function checkLogin() {
  for (let index = 0; index < userList.length; index++) {
    if (
      userList[index].email == loginEmail.value &&
      userList[index].password == loginPassword.value
    ) {
      localStorage.setItem("userName", userList[index].name);
      return true;
    }
  }
}
function emptyInputs() {
  if (loginEmail.value == "" || loginPassword.value == "") {
    return true;
  } else {
    return false;
  }
}
loginBtn.addEventListener("click", function (event) {
  event.preventDefault();
  login();
});
