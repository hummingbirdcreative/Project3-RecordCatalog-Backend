//Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

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

//Define Models
const Schema = mongoose.Schema;

const recordSchema = new Schema({
    image: { 
        type: String,
        default: "https://www.pngitem.com/pimgs/m/518-5189438_vinyl-record-png-vinyl-transparent-background-png-download.png"
    },
    bandName: String,
    albumTitle: String,
    vinylSize: String,
    description: String
}, { timestamps: true });

const Record = mongoose.model('Record', recordSchema);

//Mount Routes
//test route
app.get("/", (req, res) => {
    res.send("hola record catalog");
});

//Routes/Controller actions
//Index Route
app.get('/records', async (req, res) => {
    try{
        res.status(200).json(await Record.find({}));
    } catch (error) {
        res.status(400).json({ message: 'bad request' });
    }
});

//Create Route
app.post('/records', async (req, res) => {
    try {
        res.status(201).json(await Record.create(req.body))
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Delete Route
app.delete("/records/:id", async (req, res) => {
    try {
      res.status(200).json(await Record.findByIdAndDelete(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });

//Tell App to Listen
app.listen(PORT, () => console.log(`Express is listening on PORT ${PORT}`));