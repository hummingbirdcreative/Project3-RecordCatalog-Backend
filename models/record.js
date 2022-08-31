const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
    image: { 
        type: String,
        default: "https://www.pngitem.com/pimgs/m/518-5189438_vinyl-record-png-vinyl-transparent-background-png-download.png"
    },
    bandName: String,
    albumTitle: String,
    vinylSize: String,
    description: String, 
    createdBy: String
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);