const axios = require('axios');
const cheerio = require('cheerio');

export default async function handler(req, res) {
  try {
    const { data } = await axios.get('https://www.hirunews.lk', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    const articles = [];

    $('.all-section-tittle').each((i, el) => {
      if (i < 12) {
        const title = $(el).text().trim();
        const link = $(el).find('a').attr('href');
        // Scrape the image from the sibling or parent container
        const img = $(el).closest('.column').find('img').attr('src');
        const time = $(el).closest('.column').find('.time').text().trim();

        articles.push({ title, link, img, time });
      }
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=600'); // Cache for 10 mins
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
