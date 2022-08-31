//Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const recordRouter = require('./controllers/records');

//Initialize App
const app = express();

//Configure Settings
require('dotenv').config();
const { PORT, DATABASE_URL, PRIVATE_KEY_ID, PRIVATE_KEY } = process.env;

admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "record-catalog",
        "private_key_id": PRIVATE_KEY_ID,
        "private_key": PRIVATE_KEY.replace(/\\n/g, '\n'),
        "client_email": "firebase-adminsdk-rhm7m@record-catalog.iam.gserviceaccount.com",
        "client_id": "103139671292416566092",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-rhm7m%40record-catalog.iam.gserviceaccount.com"
      })
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
        req.user = null;
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
app.get('/', (req, res) => {
    res.send('hola record catalog');
});

app.use('/api/records', isAuthenticated, recordRouter);

app.get('/*', (req, res) => {
    res.status(404).json({ message: 'not found' })
});

//Tell App to Listen
app.listen(PORT, () => {
    console.log(`Express is listening on PORT ${PORT}`)
});