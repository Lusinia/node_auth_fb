var express = require('express'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  AuthController = require('./controllers/auth_controller'),
  fs = require('fs');

var app = express();
var router = express.Router();

mongoose.connect('mongodb://user:password1@ds253960.mlab.com:53960/test-rn');


var protectedAction = function (req, res) {
   res.send(req.user);
};

app.options('*', cors());
router.route('/facebook_auth')
  .post(AuthController.facebookAuth);
router.route('/protected')
  .get([AuthController.requireAuth, protectedAction]);

router.route('/data')
  .get(function (req, res) {
    fs.readFile('./public/Data.json', 'utf8', function read(err, data) {
      if (err) {
        throw err;
      }
      res.send(data);
    });
  });

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/v1', router);

app.listen(3000, function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("Listening on port 3000.");
});