const API_URL = import.meta.env.VITE_API_URL

const headers = (token) => ({
    'Authorization': `Bearer ${token}`
})

export const getEvenements = async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${API_URL}/evenements?${query}`)
    return response.json()
}

export const getEvenement = async (id) => {
    const response = await fetch(`${API_URL}/evenements/${id}`)
    return response.json()
}

export const createEvenement = async (token, formData) => {
    const response = await fetch(`${API_URL}/evenements`, {
        method: 'POST',
        headers: headers(token),
        body: formData
    })
    return response.json()
}

export const updateEvenement = async (token, id, formData) => {
    const response = await fetch(`${API_URL}/evenements/${id}`, {
        method: 'POST',
        headers: { ...headers(token), 'X-HTTP-Method-Override': 'PUT' },
        body: formData
    })
    return response.json()
}

export const annulerEvenement = async (token, id) => {
    const response = await fetch(`${API_URL}/evenements/${id}/annuler`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    return response.json()
}

export const deleteEvenement = async (token, id) => {
    const response = await fetch(`${API_URL}/evenements/${id}`, {
        method: 'DELETE',
        headers: headers(token)
    })
    return response.json()
}