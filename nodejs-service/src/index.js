const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Node.js Service!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Node.js service listening at http://localhost:${port}`);
});