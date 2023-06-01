let inputHistory = []; // Store input history
let historyIndex = 0; // Track current history index

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("input");

  inputField.value = ">> " + inputField.value.trim(3);

  inputField.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const input = inputField.value.substring(3); // Remove the first 3 characters
      inputField.value = ""; // Clear the input field
      processCommand(input);
      inputField.value = ">> "; // Reset the input field
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        inputField.value = ">> " + inputHistory[historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < inputHistory.length - 1) {
        historyIndex++;
        inputField.value = ">> " + inputHistory[historyIndex];
      } else {
        inputField.value = ">> ";
      }
    } else if (inputField.selectionStart < 3 && e.key !== "Backspace" && e.key !== "Delete") {
      e.preventDefault();
    }

    // Prevent deleting the '>> ' prefix
    if (e.key === "Backspace" && inputField.selectionStart <= 3) {
      e.preventDefault();
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

  if (!input == "") {
    inputHistory.push(input);
    switch (input) {
      case "clear": clearConsole(); break;
      case "help": writeToConsole("Available commands: clear, help, test"); break;
      case "help 1": writeToConsole("Available commands: 'clear', help [int], test"); break;
      case "help 2": writeToConsole("Available commands: clear, 'help [int]', test"); break;
      case "help 3": writeToConsole("Available commands: clear, help [int], 'test'"); break;
      case "test": writeToConsole("Test command executed."); break;
      default: writeToConsole("Unknown command: '" + input + "'. Type 'help' for a list of commands."); break;
    }
  }
}

function clearConsole() {
  writeToConsole("Console cleared.");
}