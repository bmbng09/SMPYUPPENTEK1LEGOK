module.exports = async function handler(req, res) {
  const siteUrl = 'https://smpyuppentek-1-legok.vercel.app';
  const id = req.query.id;
  let news = null;

  try {
    const html = await fetch(`${siteUrl}/news.html`).then(r => r.text());
    const match = html.match(/const\s+newsData\s*=\s*(\[[\s\S]*?\]);/);
    if (match) {
      const newsData = new Function('return ' + match[1])();
      news = newsData.find(n => String(n.id) === String(id));
    }
  } catch (e) {}

  const title = news ? news.title : 'SMP Yuppentek 1 Legok';
  const description = news ? news.excerpt : 'Berita dan informasi terbaru SMP Yuppentek 1 Legok.';
  const image = news
    ? (news.image.startsWith('http') ? news.image : `${siteUrl}/${news.image}`)
    : `${siteUrl}/logosmp.png`;
  const targetUrl = `${siteUrl}/news.html${id ? '?id=' + id : ''}`;

  const isBot = /facebookexternalhit|WhatsApp|Twitterbot|TelegramBot|LinkedInBot|Slackbot|Discordbot/i.test(req.headers['user-agent'] || '');

  if (isBot) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<title>${title}</title>
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="${targetUrl}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${image}">
</head><body></body></html>`);
  }

  res.writeHead(302, { Location: targetUrl });
  res.end();
};