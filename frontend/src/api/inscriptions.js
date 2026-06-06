const API_URL = import.meta.env.VITE_API_URL

const headers = (token) => ({
    'Authorization': `Bearer ${token}`
})

export const getInscriptions = async (token, params = {}) => {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${API_URL}/inscriptions?${query}`, {
        headers: headers(token)
    })
    return response.json()
}

export const getInscription = async (token, id) => {
    const response = await fetch(`${API_URL}/inscriptions/${id}`, {
        headers: headers(token)
    })
    return response.json()
}

export const createInscription = async (formData) => {
    const response = await fetch(`${API_URL}/inscriptions`, {
        method: 'POST',
        body: formData
    })
    return response.json()
}

export const deleteInscription = async (token, id) => {
    const response = await fetch(`${API_URL}/inscriptions/${id}`, {
        method: 'DELETE',
        headers: headers(token)
    })
    return response.json()
}

export const getDesinscription = async (token) => {
    const response = await fetch(`${API_URL}/desinscription/${token}`)
    return response.json()
}

export const desinscription = async (token) => {
    const response = await fetch(`${API_URL}/desinscription/${token}`, {
        method: 'DELETE'
    })
    return response.json()
}