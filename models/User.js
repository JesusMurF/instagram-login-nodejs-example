const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const User = new Schema({
  instagram: {
    id: String,
    accessToken: String,
    full_name: String,
    username: String,
    profile_picture: String,
    bio: String,
    website: String,
    counts: {
      media: Number,
      follows: Number,
      followed_by: Number
    }
  }
});

module.exports = mongoose.model('User', User);
