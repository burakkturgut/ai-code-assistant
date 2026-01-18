// API Service - Backend ile iletişim

const API_BASE_URL = 'http://localhost:8000';

export interface CodeAnalysisRequest {
    code: string;
    language: string;
    action: 'explain' | 'find_bugs' | 'improve';
}

export interface CodeAnalysisResponse {
    success: boolean;
    response: string;
    action: string;
    language: string;
}

export class APIError extends Error {
    statusCode?: number;

    constructor(message: string, statusCode?: number) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
    }
}

// Kod analizi yap
export async function analyzeCode(
    request: CodeAnalysisRequest
): Promise<CodeAnalysisResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...request,
                use_mock: true  // ← Bunu ekle (test için)
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new APIError(
                errorData.detail || `HTTP error! status: ${response.status}`,
                response.status
            );
        }

        const data: CodeAnalysisResponse = await response.json();
        return data;
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }

        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new APIError(
                'Cannot connect to backend. Make sure the backend server is running on port 8000.'
            );
        }

        throw new APIError(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
}

// Backend sağlık kontrolü
export async function checkBackendHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/`);
        return response.ok;
    } catch {
        return false;
    }
}