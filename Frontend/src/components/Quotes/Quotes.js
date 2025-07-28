import QuoteLayout from './QuoteLayout';
import axios from 'axios';

const Quotes = ({ category, title }) => {
    const fetchQuotes = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/quotes/${category}`);
            console.log(response.data.result);
            
            if (response.data.success && Array.isArray(response.data.result)) {
                return response.data.result.map(quote => ({
                    text: quote.quote,
                    author: quote.author || 'Unknown'
                }));
            } else {
                console.warn('No quotes found in response');
                return [];
            }
            
        } catch (error) {
            console.error('Error fetching quotes:', error);
            return [];
        }
    };

    return (
        <QuoteLayout 
            title={title} 
            fetchQuotes={fetchQuotes}
        />
    );
};

export default Quotes;