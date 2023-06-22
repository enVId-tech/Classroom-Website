let inputHistory = []; // Store input history
let historyIndex = 0; // Track current history index

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("input");

  inputField.value = ">> " + inputField.value.trim(3);

  inputField.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const input = inputField.value.substring(3); // Remove the first 3 characters
      inputField.value = ""; // Clear the input field
      sendConsoleDataToServer(input);
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

  const br = document.createElement("br");
  outputDiv.appendChild(br);

  outputLine.className = "output-line";
  outputLine.textContent = message.slice(1, -1);
  outputDiv.appendChild(outputLine);

  outputDiv.prepend(outputLine);
}

async function sendConsoleDataToServer(input) {
  if (input === "") {
    return;
  } else {
    const response = await fetch("/class/console/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input })
    });
    const data = await response.json();
    writeToConsole(JSON.stringify(data.commandprocess).trimEnd().trimStart());
  }
}