const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Possibly add
// - Listeners count default 0
// - InPlaylists count default 0


const songSchema = new Schema({
    title: { type: String, required: true},
    artist: { type: String, required: true },
    year: { type: String, required: true },
    youTubeId: { type: String, required: true},
    ownerEmail: { type: String, required: true},
    numListeners: { type: Number, default: 0 },
    inPlaylists: { type: Number, default: 0 }

    }, {
        timestamps: true
    }
)

module.exports = mongoose.model('Songs', (songSchema))