var express = require('express');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var db = require('../db');
var passport = require('passport');

var router = express.Router();

/* GET users listing. */
router.get('/',
  ensureLoggedIn(),
  function (req, res, next) {
    db.get('SELECT rowid AS id, username, name FROM users WHERE rowid = ?', [req.user.id], function (err, row) {
      if (err) { return next(err); }

      // TODO: Handle undefined row.

      var user = {
        id: row.id.toString(),
        username: row.username,
        displayName: row.name
      };
      res.render('profile', { user: user });
    });
  });

router.get('/with-token',
  function (req, res, next) {
    res.render('profile-with-token');
  });

router.get('/me',
  passport.authenticate('jwt', { session: false }),
  function (req, res, next) {
    db.get('SELECT rowid AS id, username, name FROM users WHERE rowid = ?', [req.user.id], function (err, row) {
      if (err) { return next(err); }

      // TODO: Handle undefined row.

      var user = {
        id: row.id.toString(),
        username: row.username,
        displayName: row.name
      };
      res.json(user);
    });
  });

module.exports = router;
