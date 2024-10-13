let userName = document.getElementById("userName");
let userEmail = document.getElementById("userEmail");
let userPassword = document.getElementById("userPassword");
let signUpBtn = document.getElementById("signUpBtn");
let alert = document.getElementById("alert");
let userList = [];
if (localStorage.getItem("users") != null) {
  userList = JSON.parse(localStorage.getItem("users"));
}
document.title = "GamesReaper " + "Signup";
function SignUp() {
  let data = {
    name: userName.value,
    email: userEmail.value,
    password: userPassword.value,
  };
  if (emptyInputs() == true) {
    getalert("All inputs required.", "red");
  } else {
    if (emailExist() == true) {
      getalert("Email already exist.", "red");
    } else {
      if (!validateEmail() == true) {
        getalert("in-valid Email", "red");
      } else {
        userList.push(data);
        localStorage.setItem("users", JSON.stringify(userList));
        clearForm();
        getalert("Success", "#0fcd0f");
        window.location.href = "login.html";
      }
    }
  }
  console.log(userList);
}
function getalert(text, color) {
  alert.style.display = "block";
  alert.innerHTML = text;
  alert.style.color = color;
}
function clearForm() {
  (userEmail.value = ""), (userName.value = ""), (userPassword.value = "");
}
function emptyInputs() {
  if (
    userEmail.value == "" ||
    userName.value == "" ||
    userPassword.value == ""
  ) {
    return true;
  } else {
    return false;
  }
}
function emailExist() {
  for (let i = 0; i < userList.length; i++) {
    if (userList[i].email == userEmail.value) {
      return true;
    }
  }
}
function validateEmail() {
  let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  let isValid = emailRegex.test(userEmail.value);

  if (!isValid) {
    userEmail.style.borderColor = "red";
  } else {
    userEmail.style.borderColor = "green";
  }

  return isValid;
}

signUpBtn.addEventListener("click", function (event) {
  event.preventDefault();
  SignUp();
});
