if (!document.getElementById("my-circle-button")) { // if already open, do nothing
  const btn = document.createElement("div"); 
  btn.id = "my-circle-button"; // used for styling in game-panel.css (and other detections)
  btn.className = "my-circle-button";
  btn.textContent = "GG";

  
  btn.addEventListener("click", () => {
    console.log("Circle button clicked");
    openGamePanel();
  });

  document.body.appendChild(btn);
}

function openGamePanel() { 
  if (document.getElementById("game-panel-frame")){
    closeGamePanel(); // this will oporate as a toggle, if the panel is open, close it
    return; // don't continue and open a new one, duh, lol
  }
  const panelUrl = chrome.runtime.getURL("hidden-panel.html"); //connect the panel to HTML, this will setup the structure/look of the panel
  console.log("Opening panel:", panelUrl);

  const iframe = document.createElement("iframe");
  iframe.id = "game-panel-frame"; //by adding this ID, game-panel.css will style it
  iframe.src = panelUrl;
  iframe.className = "game-panel-frame"; 

  document.body.appendChild(iframe); //add the iframe to the body of the page
}

function closeGamePanel() {
  // const iframe = document.getElementById("game-panel-frame");
  // if (iframe) {
  //   iframe.remove();
  // }
  swtichpage("page2.html");
}

function swtichpage(newPgaeUrl) { 
  const iframe = document.getElementById("game-panel-frame");
  if (iframe.srcdoc === chrome.runtime.getURL(newPgaeUrl)) {
    console.log("Already on the desired page");
    return; // already on the desired page
  }

  if (iframe) {
    iframe.src = chrome.runtime.getURL(newPgaeUrl);
  } else {
    console.log("Panel is not open");
  }
}
