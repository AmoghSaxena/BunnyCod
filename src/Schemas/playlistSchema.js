const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  playlists: [
    {
      playlistName: {
        type: String,
        required: true,
      },
      songs: {
        type: [String], 
        default: [],
      },
      songCount: {
        type: Number,
        default: 0,
      },
    },
  ],
});

playlistSchema.pre('save', function (next) {
  this.playlists.forEach((playlist) => {
    playlist.songCount = playlist.songs.length;
  });
  next();
});

module.exports = mongoose.model('Playlist', playlistSchema);
