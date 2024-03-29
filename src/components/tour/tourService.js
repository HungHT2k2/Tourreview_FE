import axios from "axios"

export const getTour = async () => {
    return await axios.get(`http://localhost:9999/tour`)
}

export const getOwnTour = async () => {
    
    const token = localStorage.getItem('token');
    return await axios.get(`http://localhost:9999/tour/mytour`, {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
}