import React, { useState, useEffect } from 'react';

/* eslint-disable */
function Console() {
  const [inputHistory, setInputHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        const inputField = document.getElementById('input');
        const input = inputField.value.substring(3).trim(); // Remove the first 3 characters
        inputField.value = ''; // Clear the input field
        sendConsoleDataToServer(input);
        inputField.value = '>> '; // Reset the input field
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
          setHistoryIndex((prevIndex) => prevIndex - 1);
          const inputField = document.getElementById('input');
          inputField.value = '>> ' + inputHistory[historyIndex - 1];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < inputHistory.length - 1) {
          setHistoryIndex((prevIndex) => prevIndex + 1);
          const inputField = document.getElementById('input');
          inputField.value = '>> ' + inputHistory[historyIndex + 1];
        } else {
          const inputField = document.getElementById('input');
          inputField.value = '>> ';
        }
      } else if (
        e.key !== 'Backspace' &&
        e.key !== 'Delete' &&
        e.target.selectionStart < 3
      ) {
        e.preventDefault();
      }

      // Prevent deleting the '>> ' prefix
      if (e.key === 'Backspace') {
        const inputField = document.getElementById('input');
        if (inputField.selectionStart <= 3) {
          e.preventDefault();
        }
      }
    };

    const handleInput = () => {
      const inputField = document.getElementById('input');
      // Ensure the '>> ' prefix is always at the start
      if (!inputField.value.startsWith('>> ')) {
        inputField.value = '>> ' + inputField.value;
      }
    };

    const inputField = document.getElementById('input');
    inputField.addEventListener('keydown', handleKeyDown);
    inputField.addEventListener('input', handleInput);

    return () => {
      inputField.removeEventListener('keydown', handleKeyDown);
      inputField.removeEventListener('input', handleInput);
    };
  }, [inputHistory, historyIndex]);

  const writeToConsole = (message) => {
    const outputDiv = document.getElementById('output');
    const outputLine = document.createElement('div');
    const br = document.createElement('br');
    outputDiv.appendChild(br);

    outputLine.className = 'output-line';
    outputLine.textContent = message.slice(1, -1);
    outputDiv.appendChild(outputLine);

    outputDiv.prepend(outputLine);
  };

  const sendConsoleDataToServer = async (input) => {
    if (input === '') {
      return;
    } else {
      const response = await fetch('/class/console/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();
      writeToConsole(JSON.stringify(data.commandprocess).trimEnd().trimStart());
    }
  };

  return (
    <div>
      <div id="output"></div>
      <input id="input" type="text" />
    </div>
  );
}

export default Console;
