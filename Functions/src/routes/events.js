const express = require('express');

module.exports = ({ db, admin }) => {
  const router = express.Router();

  // create event (admin)
  router.post('/', async (req, res) => {
    try {
      // This route should be protected in production via custom claims (admin)
      const { title, description, date, location } = req.body;
      if (!title) return res.status(400).json({ error: 'title required' });

      const data = {
        title,
        description: description || '',
        date: date || '',
        location: location || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await db.collection('events').add(data);
      res.status(201).json({ id: docRef.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  // list events
  router.get('/', async (req, res) => {
    try {
      const snap = await db.collection('events').orderBy('createdAt', 'desc').limit(50).get();
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  return router;
};
