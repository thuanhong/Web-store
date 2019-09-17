function Collapsing() {
    let reponsive = document.getElementById("reponsive");
    if (reponsive.className.indexOf("w3-show") === -1) {
        reponsive.className += " w3-show"
    } else {
        reponsive.className = reponsive.className.replace(" w3-show", "");
    }
}