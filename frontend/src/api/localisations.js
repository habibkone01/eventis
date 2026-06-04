const API_URL = import.meta.env.VITE_API_URL

const headers = (token) => ({
    'Authorization': `Bearer ${token}`
})

export const getLocalisations = async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${API_URL}/localisations?${query}`)
    return response.json()
}

export const getLocalisation = async (id) => {
    const response = await fetch(`${API_URL}/localisations/${id}`)
    return response.json()
}

export const createLocalisation = async (token, formData) => {
    const response = await fetch(`${API_URL}/localisations`, {
        method: 'POST',
        headers: headers(token),
        body: formData
    })
    return response.json()
}

export const updateLocalisation = async (token, id, formData) => {
    const response = await fetch(`${API_URL}/localisations/${id}`, {
        method: 'POST',
        headers: { ...headers(token), 'X-HTTP-Method-Override': 'PUT' },
        body: formData
    })
    return response.json()
}

export const deleteLocalisation = async (token, id) => {
    const response = await fetch(`${API_URL}/localisations/${id}`, {
        method: 'DELETE',
        headers: headers(token)
    })
    return response.json()
}