const express = require('express');
const { requireAuth, supabase } = require('../middleware/auth');

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) {
    return res.status(error.code === 'PGRST116' ? 404 : 500).json({ error: error.message });
  }

  res.json(data);
});

router.put('/me', requireAuth, async (req, res) => {
  const { full_name, major, graduation_year, coop_cycle, interests, bio } = req.body;

  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name,
      major,
      graduation_year,
      coop_cycle,
      interests,
      bio,
      updated_at: new Date().toISOString(),
    })
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

module.exports = router;
