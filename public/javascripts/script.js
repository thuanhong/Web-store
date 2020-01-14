function Collapsing() {
    let reponsive = document.getElementById("reponsive");
    if (reponsive.className.indexOf("w3-show") === -1) {
        reponsive.className += " w3-show"
    } else {
        reponsive.className = reponsive.className.replace(" w3-show", "");
    }
}

function changeTab(event, tabId) {
    var x, tablinks;
    x = document.getElementsByClassName('tab')
    for (var i = 0; i < x.length; i++) {
        x[i].style.display = 'none';
    }

    tablinks = document.getElementsByClassName('tablink');
    for (var i = 0;  i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' w3-border-red', '')
    }
    event.className += ' w3-border-red'
    document.getElementById(tabId).style.display = 'block';
}

var password = document.getElementById("password")
  , confirm_password = document.getElementById("confirm_password");

function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;