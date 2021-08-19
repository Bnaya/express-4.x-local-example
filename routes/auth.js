var express = require('express');
var passport = require('passport');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../consts");

var router = express.Router();

/* GET users listing. */
router.get('/login', function (req, res, next) {
  res.render('login');
});

router.get('/login-for-token', function (req, res, next) {
  res.render('login-for-token');
});

router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage: true
}));


router.post('/login/password-for-token', function (req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        err,
        message: 'Something is not right',
        user: user
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(user, JWT_SECRET);
      return res.json({ user, token });
    });
  })(req, res);
});

router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
