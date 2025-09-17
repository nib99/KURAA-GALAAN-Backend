const express = require('express');

module.exports = ({ db, admin }) => {
  const router = express.Router();

  // register volunteer
  router.post('/', async (req, res) => {
    try {
      const { name, email, phone, skills } = req.body;
      if (!name || !email) return res.status(400).json({ error: 'name and email required' });

      const data = {
        name,
        email,
        phone: phone || '',
        skills: skills || [],
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await db.collection('volunteers').add(data);
      res.status(201).json({ id: docRef.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  // list volunteers
  router.get('/', async (req, res) => {
    try {
      const snap = await db.collection('volunteers').orderBy('createdAt', 'desc').limit(100).get();
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  return router;
};
