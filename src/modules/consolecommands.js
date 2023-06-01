function saveAnnouncement(className, title, content) {
  // Save the announcement to a JSON file
  const filePath = './src/studentinformation/announcements.json';

  // Read the existing file contents
  let data = [];
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(fileContent);
  } catch (err) {
    console.log('Error reading JSON file:', err);
  }

  // Add the new announcement to the data
  data.push({ className, title, content });

  // Write the updated data to the file
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Announcement saved successfully.');
  } catch (err) {
    console.log('Error writing JSON file:', err);
  }
}

function processCommand(input) {
  if (!input == "") {
    switch (input) {
      case "clear": return 'clearConsole'; break;
      case "help": return "Available commands: clear, help, test"; break;
      case "help 1": return "Available commands: 'clear', help [int], test"; break;
      case "help 2": return "Available commands: clear, 'help [int]', test"; break;
      case "help 3": return "Available commands: clear, help [int], 'test'"; break;
      case "announcements": 'announcements(input)'; break;
      case "test": return "Test command executed."; break;
      default: return "Unknown command: '" + input + "'. Type 'help' for a list of commands."; break;
    }
  }
}

module.exports = { saveAnnouncement, processCommand };