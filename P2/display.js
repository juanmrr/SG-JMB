function displayEndGame() {
  var EndGame = document.getElementById('EndGame');

  if (EndGame.style.display === "none" || EndGame.style.display === "") {
    EndGame.style.display = "block";
  } else {
    EndGame.style.display = "none";
  }

}
