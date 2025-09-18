const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

// modular routes
const donationsRouter = require('./routes/donations');
const volunteersRouter = require('./routes/volunteers');
const eventsRouter = require('./routes/events');

app.use('/api/donations', donationsRouter({ db, admin }));
app.use('/api/volunteers', volunteersRouter({ db, admin }));
app.use('/api/events', eventsRouter({ db, admin }));

// export cloud function named "app" (matches firebase.json rewrites)
exports.app = functions
  .runWith({ memory: '512MB', timeoutSeconds: 60 })
  .https.onRequest(app);
