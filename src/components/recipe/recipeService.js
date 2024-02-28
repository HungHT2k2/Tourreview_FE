import axios from "axios"

export const getRecipe = async () => {
    return await axios.get(`http://localhost:5000/recipe`)
}

export const getOwnRecipe = async () => {
    
    const token = localStorage.getItem('token');
    return await axios.get(`http://localhost:5000/recipe/myrecipe`, {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
}