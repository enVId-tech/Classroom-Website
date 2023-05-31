const outputDiv = document.getElementById("output");
const inputField = document.getElementById("input");

function writeToConsole(message) {
  const outputLine = document.createElement("div");
  outputLine.textContent = message;
  outputDiv.appendChild(outputLine);
}

function processCommand(input) {
  // Process the command entered by the user
  writeToConsole(">> " + input);

  // Example: Echo the command back to the console
  writeToConsole(input);
}

inputField.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const input = inputField.value;
    inputField.value = "";
    processCommand(input);
  }
});