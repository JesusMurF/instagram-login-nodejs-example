const passport = require('passport');
const InstagramStrategy = require('passport-instagram').Strategy;
const User = require('../models/User');
const { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } = require('../config.json');

const instaConfig = {
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: CALLBACK_URL
};

const instagramInit = function(accessToken, refreshToken, profile, callback) {
  User.findOne({ 'instagram.id': profile.id }, function(err, user) {
    if (err) return callback(err);

    if (user) {
      return callback(null, user); // Check if user already exists
    }

    const {
      id,
      full_name,
      username,
      profile_picture,
      bio,
      website,
      counts: { media, follows, followed_by }
    } = profile._json.data;

    const new_user = new User({
      instagram: {
        id,
        accessToken,
        full_name,
        username,
        profile_picture,
        bio,
        website,
        counts: {
          media,
          follows,
          followed_by
        }
      }
    });

    new_user.save(function(err, user) {
      if (err) {
        throw err;
      }
      return callback(null, user);
    });
  });
};

passport.use(new InstagramStrategy(instaConfig, instagramInit));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

function ensureAuthenticated(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
  response.redirect('/');
}

module.exports = ensureAuthenticated;
