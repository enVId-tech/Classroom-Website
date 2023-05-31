document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("input");

  inputField.value = ">> " + inputField.value.trim(3);

  inputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const input = inputField.value.substring(3); // Remove the '>> ' prefix
      inputField.value = ""; // Clear the input field
      processCommand(input);
      inputField.value = ">> "; // Restore the '>> ' prefix
    }
  

    // Prevent deleting the '>> ' prefix
    if (event.key === "Backspace" && inputField.selectionStart <= 3) {
      event.preventDefault();
    }
  });

  inputField.addEventListener("input", function () {
    // Ensure the '>> ' prefix is always at the start
    if (!inputField.value.startsWith(">> ")) {
      inputField.value = ">> " + inputField.value;
    }
  });
});

function writeToConsole(message) {
  const outputDiv = document.getElementById("output");
  const outputLine = document.createElement("div");
  outputLine.className = "output-line";
  outputLine.textContent = message;
  outputDiv.appendChild(outputLine);

  outputDiv.prepend(outputLine);
  outputDiv.scrollTop = outputDiv.scrollHeight; // Scroll to the bottom
}

function processCommand(input) {
  // Example: Echo the command back to the console
  writeToConsole(input);
}
