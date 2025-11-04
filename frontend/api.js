
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function fetchProjects({ page = 1, perPage = 10 } = {}) {
    return fetch(`${API_BASE_URL}/compare/projects?page=${page}&per_page=${perPage}`)
        .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch projects");
            return res.json();
        });
}

export function fetchDesignDetails(designId) {
    if (!designId) return Promise.reject(new Error("No designId provided"));
    return fetch(`${API_BASE_URL}/compare/${designId}`)
        .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch design details");
            return res.json();
        });
}

export async function fetchParts ({ page = 1, parts = [] } = {}) {
    const response = await fetch(`${API_BASE_URL}/search?page=${page}&page_size=50${arguments[0]?.search ? `&q=${encodeURIComponent(arguments[0].search)}` : ''}`)
    if (response.ok) {
        const data = await response.json()
        parts = [...parts, ...data.items]
        return { parts, hasMore: data.has_more }
    } else {
        throw new Error ("Failed to fetch parts")
    }
} 