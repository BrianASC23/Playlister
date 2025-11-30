const mongoose = require('mongoose')
const Schema = mongoose.Schema

const songSchema = new Schema({
    title: { type: String, required: true},
    artist: { type: String, required: true },
    year: { type: String, required: true },
    youTubeId: { type: String, required: true},
    ownerEmail: { type: String, required: true}
    }, {
        timestamps: true
    }
)

module.exports = mongoose.model('Songs', (songSchema))