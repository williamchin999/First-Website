var error = document.getElementById("error");
function checkUser(){
  let username = document.getElementById("username").value;

  //check A-Z
  if (!username[0].match(/[a-zA-Z]/)) {
    console.log("err beginning char");
    error.innerHTML = ` <span class = "red"> Enter a username that begins with a character<br> </span>` 
  } 
  //check length & alphanumberic
  else if (username.length < 3 && username.match(/[0-9a-z]+/)){
    console.log("err alphanum");
    error.innerHTML = ` <span class = "red"> Enter a username that is 3 or more alphanumeric characters<br> </span>`;
  }
  else{
    return true;
  }

}

function checkPass(){
  let password = document.getElementById("pass").value;
  let cpass = document.getElementById("cpass").value;

  // check length
  if (password.length < 8) {
    console.log("err length");
    error.innerHTML = ` <span class = "red"> Password must be 8 or more characters<br></span>`
  }
  // check number
  else if (!password.match(/[0-9]/)) {
    console.log("err number");
    error.innerHTML = ` <span class = "red"> Password must contain at least one number<br></span>`
  }
  // check uppercase
  else if (!password.match(/[A-Z]/)) {
    console.log("err uppercase");
    error.innerHTML = ` <span class = "red"> Password must contain at least one Uppercase Letter<br></span>`
  }
  // check special character
  else if (!password.match(/[()/*-+!@#$^&*]/)) {
    console.log("err special");
    error.innerHTML = ` <span class = "red"> Password must contain one special character<br></span>`
  }
  // check both password fields are equal or not
  else if (password !== cpass) {
    console.log("err same");
    error.innerHTML = ` <span class = "red"> Both Passwords must be same!<br></span>`
  } 
  else {
    return true;
  }
}

function myValidate(){
  //checking if form input is ok
  if(checkUser() && checkPass()){
    document.getElementById("myForm").submit();
  }
  else {}
}