//Dependencies
const express = require('express');

//Initialize App
const app = express();

//Configure Settings
require('dotenv').config();
const { PORT, DATABASE_URL } = process.env;

//Connect to MongoDB using Mongoose

//Mount Middleware

//Mount Routes
//test route
app.get("/", (req, res) => {
    res.send("hola record catalog");
});

//Tell App to Listen
app.listen(PORT, () => console.log(`Express is listening on PORT ${PORT}`));