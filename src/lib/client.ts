export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// export async function apiRequest<T = any>(
//     endpoint: string,
//     method: string = 'GET',
//     body?: any,
//     headers: Record<string, string> = {}
// ): Promise<T> {
//     const url = `${API_BASE_URL}${endpoint}`;
//     const config: RequestInit = {
//         method,
//         headers: {
//             'Content-Type': 'application/json',
//             ...headers,
//         },
//         credentials: 'include',
//     };

//     if (body) {
//         config.body = JSON.stringify(body);
//     }

//     const response = await fetch(url, config);

//     if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || 'Something went wrong');
//     }

//     return response.json();
// }

export async function apiRequest<T = any>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    headers: Record<string, string> = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        credentials: 'include', // This is important for cookies
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
}