require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;
// middleware to parse JSON
app.use(express.json());


// basic route
app.get('/', (req, res) => {
    console.log(`DB url ${DB_URL}`);
    res.send({
        'data': {
            'id': "Hi "
        }
    });
});

// start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
