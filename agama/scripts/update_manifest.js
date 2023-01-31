const fs = require('fs');
const strftime = require('strftime');

// Define the JSON object
const jsonData = {
  integrationVersion: '3.0',
  buildDate: strftime('%Y-%m-%d %H:%M:%S')
};

// Convert the JSON object to a string
const jsonString = JSON.stringify(jsonData, null, 2);

// Write the JSON string to a file
fs.writeFile('manifest.json', jsonString, 'utf8', (err) => {
  if (err) {
    console.error('Error writing JSON file:', err);
  } else {
    console.log('Manifest file created');
  }
});
