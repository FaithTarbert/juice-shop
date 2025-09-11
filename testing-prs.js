const express = require('express');
const { exec } = require('child_process');
const app = express();

// A vulnerable endpoint that directly uses user input in a command.
// This is a classic example of a Command Injection vulnerability.
app.get('/search', (req, res) => {
  // SAST tool identifies 'req.query.filename' as an UNTRUSTED SOURCE of data.
  // It is a "taint source".
  const filename = req.query.filename;

  // The 'exec' function from 'child_process' is a KNOWN DANGEROUS SINK.
  // The SAST tool will trace the flow of data from the source to this sink.
  //
  // Because the 'filename' variable is used directly in the 'exec' command,
  // it creates a direct path for a vulnerability.
  //
  // An attacker could send a request like:
  // /search?filename=test.txt;rm%20-rf%20/
  // The tool sees this and flags it as a Command Injection vulnerability.
  exec(`grep "${filename}" *`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send('An error occurred.');
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return res.status(500).send('An error occurred.');
    }
    res.send(stdout);
  });
});