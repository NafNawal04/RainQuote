const axios = require('axios');
const cheerio = require('cheerio');

const goodreadsClient = axios.create({
    timeout: 10000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
});

const categoryTagMapping = {
    motivational: 'motivational',
    funny: 'humor',
    romantic: 'love',
    faith: 'faith'
};

const scrapeGoodreadsQuotes = async (tag) => {
    try {
        const randomPage = Math.floor(Math.random() * 5) + 1;
        const url = `https://www.goodreads.com/quotes/tag/${tag}?page=${randomPage}`;
        
        console.log(`Scraping Goodreads: ${url}`);
        
        const { data } = await goodreadsClient.get(url);
        
        const $ = cheerio.load(data);
        
        const quotes = [];
        
        $('div.quote').each((i, elem) => {
            try {
                const quoteElement = $(elem).find('div.quoteText');
                let quoteText = quoteElement.clone().children().remove().end().text().trim();
                
                quoteText = quoteText.replace(/^"|"$/g, '').replace(/\s+/g, ' ').trim();
                
                let author = 'Unknown';
                const authorElement = $(elem).find('span.authorOrTitle');
                if (authorElement.length > 0) {
                    author = authorElement.text().trim().replace(/,$/, '');
                }
                
                if (author === 'Unknown' || author === '') {
                    const authorLink = $(elem).find('a.authorOrTitle');
                    if (authorLink.length > 0) {
                        author = authorLink.text().trim();
                    }
                }
                
                if (quoteText && quoteText.length > 10) {
                    quotes.push({
                        quote: quoteText,
                        author: author
                    });
                }
            } catch (error) {
                console.error('Error parsing individual quote:', error);
            }
        });
        
        console.log(`Found ${quotes.length} quotes from Goodreads`);
        
        if (quotes.length === 0) {
            throw new Error('No quotes found on the page');
        }
        
        for (let i = quotes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [quotes[i], quotes[j]] = [quotes[j], quotes[i]];
        }
        
        const limitedQuotes = quotes.slice(0, 10);
                
        return {
            success: true,
            quotes: limitedQuotes,
            total: limitedQuotes.length
        };
        
    } catch (error) {
        console.error('Goodreads scraping error:', error.message);
        throw error;
    }
};

const getQuotesByCategory = async (mood) => {
    console.log(`Fetching quotes for category: ${mood}`);
    
    const goodreadsTag = categoryTagMapping[mood];
    
    try {
        const result = await scrapeGoodreadsQuotes(goodreadsTag);
        
        if (result.success && result.quotes.length > 0) {
            return {
                result: result.quotes,
                source: 'goodreads',
                total: result.total
            };
        }
    } catch (error) {
        console.error('Goodreads scraping failed:', error.message);
        console.log('Falling back to local quotes...');
    }
    
    return getFallbackQuotes(mood);
};

const getFallbackQuotes = (category) => {
    const fallbackQuotes = {
        motivational: [
            {
                quote: "The only way to do great work is to love what you do.",
                author: "Steve Jobs"
            },
            {
                quote: "Believe you can and you're halfway there.",
                author: "Theodore Roosevelt"
            }
        ],
        funny: [
            {
                quote: "I'm not arguing, I'm just explaining why I'm right.",
                author: "Unknown"
            },
            {
                quote: "I used to hate facial hair, but then it grew on me.",
                author: "Unknown"
            }
        ],
        romantic: [
            {
                quote: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.",
                author: "Lao Tzu"
            },
            {
                quote: "Love is not about how many days, months, or years you have been together. It's about how much you love each other every day.",
                author: "Unknown"
            }
        ],
        faith: [
            {
                quote: "Faith is taking the first step even when you don't see the whole staircase.",
                author: "Martin Luther King Jr."
            },
            {
                quote: "Prayer is not asking. It is a longing of the soul.",
                author: "Mahatma Gandhi"
            }
        ]
    };

    const quotes = fallbackQuotes[category];

    return {
        result: quotes,
        source: 'fallback',
        total: quotes.length
    };
};

module.exports = { getQuotesByCategory };