const { getQuotesByCategory } = require('../services/quoteService');

const fetchQuotesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        
        if (!category) {
            return res.status(400).json({ 
                message: 'Category parameter is required' 
            });
        }
        const data = await getQuotesByCategory(category);
        
        res.json({
            success: true,
            category: category,
            result: data.result,
            specialQuote: data.specialQuote,
            source: data.source,
            total: data.total,
            timestamp: new Date().toISOString()
        });


    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching quotes', 
            error: error.message 
        });
    }
};

module.exports = {
    fetchQuotesByCategory
};