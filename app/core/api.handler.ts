export const FetchApi = async (url: string, method: string, body?: {}) => {
    try {
        const response = await fetch(url, {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        if (response.status === 401) {
            return 'JWT_EXPIRED'
        }
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (e) {
        throw e
    }
}
