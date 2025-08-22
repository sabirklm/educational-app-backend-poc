const express = require('express');
const app = express();
const PORT = 3000;

// middleware to parse JSON
app.use(express.json());

// basic route
app.get('/', (req, res) => {
  res.send('Hello, Express is running!');
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
