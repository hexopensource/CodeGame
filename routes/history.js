var async = require('async');

var app = module.exports = require('express')();

app.get('/:id', function(req, res) {
  History.find({
    where: { id: req.params.id },
    include: [{ model: Result }]
  }).then(function(history) {
    history.Result.getMap().then(function(map) {
      res.locals.map = map;
      async.map([history.challenger, history.host], function(userId, next) {
        User.find(userId).done(next);
      }, function(err, users) {
        res.render('history', { history: history, users: users.map(function(user) { return user.name; }) });
      });
    });
  });
});