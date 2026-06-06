const API_URL = import.meta.env.VITE_API_URL

const headers = (token) => ({
    'Authorization': `Bearer ${token}`
})

export const getOrganisateurs = async (token, params = {}) => {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${API_URL}/organisateurs?${query}`, {
        headers: headers(token)
    })
    return response.json()
}

export const getOrganisateur = async (token, id) => {
    const response = await fetch(`${API_URL}/organisateurs/${id}`, {
        headers: headers(token)
    })
    return response.json()
}

export const createOrganisateur = async (token, formData) => {
    const response = await fetch(`${API_URL}/organisateurs`, {
        method: 'POST',
        headers: headers(token),
        body: formData
    })
    return response.json()
}

export const updateOrganisateur = async (token, id, formData) => {
    const response = await fetch(`${API_URL}/organisateurs/${id}`, {
        method: 'POST',
        headers: { ...headers(token), 'X-HTTP-Method-Override': 'PUT' },
        body: formData
    })
    return response.json()
}

export const deleteOrganisateur = async (token, id) => {
    const response = await fetch(`${API_URL}/organisateurs/${id}`, {
        method: 'DELETE',
        headers: headers(token)
    })
    return response.json()
}