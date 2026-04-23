const express = require('express');
const { requireAuth, supabase } = require('../middleware/auth');
const { generateAnonymousName } = require('../lib/anonymousName');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const { company, rating, cycle, search } = req.query;

  let query = supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (company) {
    query = query.ilike('company_name', `%${company}%`);
  }
  if (rating) {
    query = query.eq('overall_rating', parseInt(rating));
  }
  if (cycle) {
    query = query.eq('coop_cycle', cycle);
  }
  if (search) {
    query = query.or(`company_name.ilike.%${search}%,role_title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Fetch reviews error:', error);
    return res.status(500).json({ error: 'Failed to fetch reviews.' });
  }

  res.json(data);
});

router.post('/', requireAuth, async (req, res) => {
  const {
    company_name,
    role_title,
    department,
    coop_cycle,
    overall_rating,
    description,
    skills_learned,
    tools_used,
    culture_tags,
    would_recommend,
  } = req.body;

  if (!company_name || !description || !overall_rating) {
    return res.status(400).json({ error: 'Company name, description, and rating are required.' });
  }

  if (overall_rating < 0.5 || overall_rating > 5 || (overall_rating * 2) % 1 !== 0) {
    return res.status(400).json({ error: 'Rating must be between 0.5 and 5 in half-star increments.' });
  }

  if (description.length > 2000) {
    return res.status(400).json({ error: 'Description must be 2000 characters or fewer.' });
  }

  if (company_name.length > 50) {
    return res.status(400).json({ error: 'Company name must be 50 characters or fewer.' });
  }

  if (role_title && role_title.length > 50) {
    return res.status(400).json({ error: 'Role title must be 50 characters or fewer.' });
  }

  if (department && department.length > 50) {
    return res.status(400).json({ error: 'Department must be 50 characters or fewer.' });
  }

  const display_name = await generateAnonymousName(supabase);

  const { data, error } = await supabase.from('reviews').insert({
    display_name,
    company_name: company_name.trim(),
    role_title: role_title?.trim() || null,
    department: department?.trim() || null,
    coop_cycle: coop_cycle || null,
    overall_rating,
    description: description.trim(),
    skills_learned: skills_learned || [],
    tools_used: tools_used || [],
    culture_tags: culture_tags || [],
    would_recommend: would_recommend ?? null,
  }).select().single();

  if (error) {
    console.error('Insert review error:', error);
    return res.status(500).json({ error: 'Failed to submit review.' });
  }

  res.status(201).json(data);
});

module.exports = router;
