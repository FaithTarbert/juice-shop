// A simple function that takes user input and uses it in a hypothetical command.
function searchProducts(userInput) {
  // SAST tools will flag this line because the 'userInput' variable
  // is a potential source of untrusted data (a "taint source")
  // and it's being concatenated directly into a command string (a "sink").
  // This pattern could be exploited if this were a real OS command or SQL query.
  //
  // In a real application, an attacker could inject malicious commands here.
  // For example, if this were an OS command, a user could input "query; rm -rf /"
  // to run a second, malicious command.
  const command = `find . -name "${userInput}"`;

  // The actual dangerous operation is not performed here for safety.
  // The goal is just to show the pattern that a SAST tool would detect.
  console.log('SAST tool would detect a vulnerability here:', command);
  return command;
}

// Example usage that you could test with your SAST tool
// to see if it flags the 'searchProducts' function.
// The input is a hardcoded string here to be safe.
const untrustedData = 'test_item.txt';
searchProducts(untrustedData);