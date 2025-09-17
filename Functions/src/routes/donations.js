const express = require('express');

module.exports = ({ db, admin }) => {
  const router = express.Router();

  // create a donation record
  router.post('/', async (req, res) => {
    try {
      const { donorName, amount, message, method } = req.body;
      if (!amount) return res.status(400).json({ error: 'amount required' });

      const data = {
        donorName: donorName || 'anonymous',
        amount,
        method: method || 'manual',
        message: message || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await db.collection('donations').add(data);
      return res.status(201).json({ id: docRef.id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'server error' });
    }
  });

  // list recent donations
  router.get('/', async (req, res) => {
    try {
      const snap = await db.collection('donations').orderBy('createdAt', 'desc').limit(50).get();
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  // get single donation
  router.get('/:id', async (req, res) => {
    try {
      const doc = await db.collection('donations').doc(req.params.id).get();
      if (!doc.exists) return res.status(404).json({ error: 'not found' });
      res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  return router;
};
