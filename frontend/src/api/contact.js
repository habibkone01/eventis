const API_URL = import.meta.env.VITE_API_URL

export const sendContact = async (formData) => {
    const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        body: formData
    })
    return response.json()
}