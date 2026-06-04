const API_URL = import.meta.env.VITE_API_URL

const headers = (token) => ({
    'Authorization': `Bearer ${token}`
})

export const getCategories = async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${API_URL}/categories?${query}`)
    return response.json()
}

export const getCategorie = async (id) => {
    const response = await fetch(`${API_URL}/categories/${id}`)
    return response.json()
}

export const createCategorie = async (token, formData) => {
    const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: headers(token),
        body: formData
    })
    return response.json()
}

export const updateCategorie = async (token, id, formData) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'POST',
        headers: { ...headers(token), 'X-HTTP-Method-Override': 'PUT' },
        body: formData
    })
    return response.json()
}

export const deleteCategorie = async (token, id) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: headers(token)
    })
    return response.json()
}