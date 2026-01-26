/* hidden-panel.js is only used by hidden-panel.html*/

document.getElementById("demo").addEventListener("click", myFunction);

function myFunction() {
  document.getElementById("demo").innerHTML = "YOU CLICKED ME!";
  document.getElementById("demo").classList.add("demo-suprise");
}