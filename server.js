//Dependencies
const express = require('express');
const mongoose = require('mongoose');

//Initialize App
const app = express();

//Configure Settings
require('dotenv').config();
const { PORT, DATABASE_URL } = process.env;

//Connect to MongoDB using Mongoose
mongoose.connect(DATABASE_URL);

//Mount Middleware
mongoose.connection
.on('connected', () => console.log('Connected to MongoDB'))
.on('error', (error) => console.log('MongoDB Error:' + error.message));

//Mount Routes
//test route
app.get("/", (req, res) => {
    res.send("hola record catalog");
});

//Tell App to Listen
app.listen(PORT, () => console.log(`Express is listening on PORT ${PORT}`));