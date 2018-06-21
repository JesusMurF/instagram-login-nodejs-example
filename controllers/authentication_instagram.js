const passport = require('passport');
const InstagramStrategy = require('passport-instagram').Strategy;
const User = require('../models/User');

const instaConfig = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
};

if (!instaConfig.clientID) {
  throw new Error("Set the enviroment variables, that's the reason...");
}

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
