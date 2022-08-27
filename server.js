//Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('./firebase-private-key.json');
const recordRouter = require('./controllers/records');

//Initialize App
const app = express();

//Configure Settings
require('dotenv').config();
const { PORT, DATABASE_URL } = process.env;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

//Connect to MongoDB using Mongoose
mongoose.connect(DATABASE_URL);

//Mount Middleware
app.use(express.json());
app.use(cors());
app.use(logger('dev'));

//authorization middleware
app.use(async function(req, res, next) {
    try {
    const token = req.get('Authorization');
    if(token) {
    const user =  await getAuth().verifyIdToken(token.replace('Bearer ', ''));
    req.user = user;
    } else {
        req.user = null;
    }
    } catch (error) {
    }
    next();
});

function isAuthenticated(req, res, next) {
    if(req.user) return next();
    res.status(401).json({
        message: 'you must login first'
    });
}

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