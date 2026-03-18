export const fetchTokenPrices = async (addresses: string[]) => {
    try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${addresses.join(',')}`);
        if (!response.ok) {
            throw new Error('Failed to fetch prices');
        }
        const data = await response.json();
        return data.pairs || [];
    } catch (error) {
        console.error('Error fetching token prices:', error);
        return [];
    }
};
