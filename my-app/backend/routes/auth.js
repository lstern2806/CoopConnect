const express = require('express');
const { Resend } = require('resend');
const { supabase } = require('../middleware/auth');

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

const NU_DOMAINS = ['northeastern.edu', 'husky.neu.edu'];

function isNuEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  return NU_DOMAINS.includes(domain);
}

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const TEST_EMAILS = ['nucoopconnect@gmail.com'];
  if (!isNuEmail(email) && !TEST_EMAILS.includes(email.toLowerCase())) {
    return res.status(400).json({ error: 'Only @northeastern.edu and @husky.neu.edu emails are allowed.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
  });

  if (error) {
    console.error('Signup error:', error);
    return res.status(400).json({ error: error.message });
  }

  // Create profile row manually (no trigger)
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: data.user.id, email });

  if (profileError) {
    console.error('Profile creation error:', profileError);
  }

  // Generate confirmation link, then send via Resend
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'signup',
    email,
    password,
  });

  if (linkError) {
    console.error('Generate link error:', linkError);
    return res.json({ message: 'Account created, but we could not send a confirmation email. Contact support.' });
  }

  const confirmUrl = linkData?.properties?.action_link;

  try {
    await resend.emails.send({
      from: 'CoopConnect <onboarding@resend.dev>',
      to: email,
      subject: 'Confirm your CoopConnect account',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #C8102E;">Welcome to CoopConnect!</h2>
          <p>Click the button below to confirm your email and activate your account.</p>
          <a href="${confirmUrl}" style="display: inline-block; padding: 12px 24px; background: #C8102E; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Confirm Email
          </a>
          <p style="margin-top: 24px; font-size: 13px; color: #666;">
            If the button doesn't work, copy and paste this link:<br/>
            <a href="${confirmUrl}">${confirmUrl}</a>
          </p>
        </div>
      `,
    });
    console.log('Confirmation email sent to', email);
  } catch (emailErr) {
    console.error('Resend email error:', emailErr);
  }

  res.json({ message: 'Account created! Check your email to confirm before signing in.' });
});

router.post('/resend-confirmation', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const { data: { users } } = await supabase.auth.admin.listUsers();
  const matchedUser = users?.find(u => u.email === email);

  if (!matchedUser) {
    return res.json({ message: 'If that account exists, a new confirmation email has been sent.' });
  }

  if (matchedUser.email_confirmed_at) {
    return res.json({ message: 'Email is already confirmed. You can sign in.' });
  }

  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'signup',
    email,
    password: 'placeholder',
  });

  if (linkError) {
    console.error('Resend link error:', linkError);
    return res.status(500).json({ error: 'Failed to generate confirmation link.' });
  }

  const confirmUrl = linkData?.properties?.action_link;

  try {
    await resend.emails.send({
      from: 'CoopConnect <onboarding@resend.dev>',
      to: email,
      subject: 'Confirm your CoopConnect account',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #C8102E;">Confirm your email</h2>
          <p>Click the button below to confirm your email and activate your account.</p>
          <a href="${confirmUrl}" style="display: inline-block; padding: 12px 24px; background: #C8102E; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Confirm Email
          </a>
          <p style="margin-top: 24px; font-size: 13px; color: #666;">
            If the button doesn't work, copy and paste this link:<br/>
            <a href="${confirmUrl}">${confirmUrl}</a>
          </p>
        </div>
      `,
    });
    console.log('Resent confirmation email to', email);
  } catch (emailErr) {
    console.error('Resend email error:', emailErr);
    return res.status(500).json({ error: 'Failed to send confirmation email.' });
  }

  res.json({ message: 'Confirmation email sent! Check your inbox.' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Check if email is confirmed before allowing login
  const { data: { users }, error: lookupError } = await supabase.auth.admin.listUsers();
  const matchedUser = users?.find(u => u.email === email);

  if (matchedUser && !matchedUser.email_confirmed_at) {
    return res.status(403).json({ error: 'Please confirm your email before signing in. Check your inbox.' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.json({
    user: data.user,
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    },
  });
});

router.post('/magic-link', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  if (!isNuEmail(email)) {
    return res.status(400).json({ error: 'Only @northeastern.edu and @husky.neu.edu emails are allowed.' });
  }

  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: 'Check your email for the login link!' });
});

router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh token is required.' });
  }

  const { data, error } = await supabase.auth.refreshSession({ refresh_token });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.json({
    user: data.user,
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    },
  });
});

router.post('/logout', async (req, res) => {
  res.json({ message: 'Logged out.' });
});

router.get('/me', async (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const token = header.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  res.json({ user: { id: user.id, email: user.email } });
});

module.exports = router;
