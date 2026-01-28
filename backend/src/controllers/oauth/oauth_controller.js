import oauth2Client from '../../config/oauth.js';

export const startYoutubeAuth = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/youtube.upload'],
  });

  res.redirect(url);
};

export const youtubeCallback = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send('Code manquant');

    const { tokens } = await oauth2Client.getToken(code);

    console.log('REFRESH_TOKEN =', tokens.refresh_token);

    res.send(`Token généré : ${tokens.refresh_token}`);

  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur OAuth YouTube');
  }
};
