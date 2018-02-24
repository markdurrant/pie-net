'use strict'

var http = require('http');
var port = process.env.PORT || 3000;
var request = require('request');
var qs = require('querystring');
var util = require('util');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var app = express();
var QuickBooks = require('node-quickbooks');
var Tokens = require('csrf');
var csrf = new Tokens();

QuickBooks.setOauthVersion('2.0');

// Generic Express config
app.set('port', port);
app.set('views', 'views');
app.use(express.static('../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('brad'));
app.use(session({ resave: false, saveUninitialized: false, secret: 'smith' }));

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

// INSERT YOUR CONSUMER_KEY AND CONSUMER_SECRET HERE

var consumerKey = 'Q08S3YjYPJlP3hpGFW9kP6bid17baXPM0hXg0WD7rWGQt3qSoN';
var consumerSecret = 'vaVSWWmhhtg2s4eC3bcoXu8PZGWAdICKUbG7k03f';

app.get('/', function (req, res) {
  res.redirect('/start');
});

app.get('/start', function (req, res) {
  res.render('intuit.ejs', { port: port, appCenter: QuickBooks.APP_CENTER_BASE });
});

// OAUTH 2 makes use of redirect requests
function generateAntiForgery (session) {
  session.secret = csrf.secretSync();
  return csrf.create(session.secret);
};

app.get('/requestToken', function (req, res) {
  var redirecturl = QuickBooks.AUTHORIZATION_URL +
    '?client_id=' + consumerKey +
    '&redirect_uri=' + encodeURIComponent('http://localhost:' + port + '/callback') +  //Make sure this path matches entry in application dashboard
    '&scope=com.intuit.quickbooks.accounting' +
    '&response_type=code' +
    '&state=' + generateAntiForgery(req.session);

  res.redirect(redirecturl);
});

app.get('/callback', function (req, res) {
  var auth = (new Buffer(consumerKey + ':' + consumerSecret).toString('base64'));

  var postBody = {
    url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + auth,
    },
    form: {
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: 'http://localhost:' + port + '/callback'  //Make sure this path matches entry in application dashboard
    }
  };

  request.post(postBody, function (e, r, data) {
    var accessToken = JSON.parse(r.body);

    // save the access token somewhere on behalf of the logged in user
    var qbo = new QuickBooks(consumerKey,
                             consumerSecret,
                             accessToken.access_token, /* oAuth access token */
                             false, /* no token secret for oAuth 2.0 */
                             req.query.realmId,
                             true, /* use a sandbox account */
                             true, /* turn debugging on */
                             4, /* minor version */
                             '2.0', /* oauth version */
                            accessToken.refresh_token /* refresh token */);

    qbo.updateItem({
      "Id": "19",
      "SyncToken": "2",
      "PurchaseCost": 15
    },
      function(){}
    );
  });

  res.send('<!DOCTYPE html><html lang="en"><head></head><body><script>window.opener.location.reload(); window.close();</script></body></html>');
});

