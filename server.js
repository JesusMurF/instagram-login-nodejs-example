const express = require('express');
const session = require('express-session');
const passport = require('passport');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
require('./config/db');

const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const ensureAuthenticated = require('./controllers/authentication_instagram');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    saveUninitialized: true,
    resave: true,
    secret: 'secret'
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (request, response) => {
  response.render('home');
});

app.get('/profile', ensureAuthenticated, (request, response) => {
  const { instagram } = request.user;
  response.render('profile', { user: instagram });
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/auth/instagram', passport.authenticate('instagram'));

app.get(
  '/auth/instagram/callback',
  passport.authenticate('instagram', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  })
);

const port = 9000;

app.listen(port);
