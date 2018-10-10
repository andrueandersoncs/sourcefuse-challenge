const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

const express = require('express');
const app = express();

const Uber = require('node-uber');
const uber = new Uber({
  client_id: '4NhtSj9qZnL-JM3h-UqfMeUhLqorAL-y',
  client_secret: '4sbT7bq6EbBYGhBfPmDL2t-_FcyejpfzRW4KvY2X',
  server_token: 'mFy_nIlpkSLmyzzh8rVJlEAvSmIKVDevrynGyXwu',
  redirect_uri: 'https://us-central1-sourcefuse-challenge-2.cloudfunctions.net/api/callback',
  name: 'SourceFuse Challenge'
});

const axios = require('axios');

const authenticate = function(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }

  if (req.query.code) {
    return next();
  }

  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(403).send('Unauthorized: missing authorization header.');
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  admin.auth().verifyIdToken(idToken)
    .then(function(decodedIdToken) {
      req.user = decodedIdToken;
      next();
    })
    .catch(function() {
      res.status(403).send('Unauthorized.');
    });
};
app.use(authenticate);

const cors = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
};
app.use(cors);

app.get('/login', function(req, res) {
  const url = uber.getAuthorizeUrl(['history']);
  res.status(200).json({ location: `${url}&state=${req.user.uid}` });
});

app.get('/callback', function(req, res) {
  uber.authorizationAsync({ authorization_code: req.query.code })
    .spread(function(access_token, refresh_token, authorizedScopes, tokenExpiration) {

      // get the user by the req.user attribute
      const docRef = db.collection('userTokens').doc(req.query.state);
      docRef.set({
        access_token,
        refresh_token,
        authorizedScopes,
        tokenExpiration
      });

      res.redirect('https://sourcefuse-challenge-2.firebaseapp.com/history');
    })
    .error(function(err) {
      console.error(err);
      res.status(500);
      res.redirect('https://sourcefuse-challenge-2.firebaseapp.com/login');
    });
});

app.get('/sync', function(req, res) {
  const docRef = db.collection('userTokens').doc(req.user.uid);
  docRef.get()
    .then(function(snapshot) {

      if (!snapshot.exists) {
        res.redirect('https://us-central1-sourcefuse-challenge-2.cloudfunctions.net/api/login');
        return;
      }

      const data = snapshot.data();
      axios({
        method: 'GET',
        url: 'https://api.uber.com/v1.2/history?limit=50&offset=0',
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
          'Accept-Language': 'en_US',
          'Content-Type': 'application/json'
        }
      })
        .then(function(resp) {
          db.collection("uberHistories").doc(req.user.uid).set(resp.data);
          res.status(200).send('Sync successful.');
        })
        .catch(function(err) {

          // access_token is incorrect or something like that, delete the invalid data.
          docRef.delete()
            .then(resp => {
              res.redirect('https://us-central1-sourcefuse-challenge-2.cloudfunctions.net/api/login');
              return;
            })
            .catch(deleteError => {

              // just ignore it if for whatever reason the doc no longer exists.
              console.log(deleteError);
            });
          res.status(500).send('Could not get uber history.');
        });
    })
    .catch(function(err) {
      res.status(500).send('Failed to sync uber history.');
    });
});

exports.api = functions.https.onRequest(app);
