//Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const recordRouter = require('./controllers/records');

//Initialize App
const app = express();

//Configure Settings
require('dotenv').config();
const { PORT, DATABASE_URL } = process.env;

//Connect to MongoDB using Mongoose
mongoose.connect(DATABASE_URL);

//Mount Middleware
app.use(express.json());
app.use(cors());
app.use(logger('dev'));

mongoose.connection
.on('connected', () => console.log('Connected to MongoDB'))
.on('error', (error) => console.log('MongoDB Error:' + error.message));

//Mount Routes
//test route
app.get("/", (req, res) => {
    res.send("hola record catalog");
});

app.use('/api/records', recordRouter);

app.get('/*', (req, res) => {
    res.status(404).json({ message: 'not found' })
});

//Tell App to Listen
app.listen(PORT, () => {
    console.log(`Express is listening on PORT ${PORT}`)
});