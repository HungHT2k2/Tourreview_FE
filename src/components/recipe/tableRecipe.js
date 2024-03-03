import { useEffect, useState } from 'react'
import './style.scss'
import axios from 'axios';
import { getOwnRecipe, getRecipe } from './recipeService';
import { useNavigate } from 'react-router-dom';
const TableRecipe = () => {
    const navigate = useNavigate();
    const [dataRecipe, setDataRecipe] = useState([]);
    console.log(dataRecipe);
    useEffect(() => {
        getOwnRecipe().then(data => {setDataRecipe(data.data.recipe)})
    }, [])
    const handleDelete = (id) => {
        const token = localStorage.getItem('token');

        axios.delete(`http://localhost:5000/recipe/${id}`,{
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(() => {
            // Xóa thành công, cập nhật lại state dataRecipe
            setDataRecipe(prevData => prevData.filter(data => data._id !== id));
        })
        .catch(error => {
            // Xử lý lỗi khi xóa không thành công
            console.log(error);
        });
    }
    const handleEdit = (id) => {
        console.log(id);
        navigate(`/recipe/edit/${id}`);
    }
    return (<div className='list-recipe'>
        <h2>Your Recipes</h2>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Date created</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                
                    {
                        dataRecipe.map((data,index) => {
                            return (
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{data.name}</td>
                                    <td>{data.createdAt}</td>
                                    <td><button className='btn btn-outline-danger' onClick={() =>  handleEdit(data._id)}>Edit </button><button onClick={() => handleDelete(data._id)} className='btn btn-outline-danger'>Delete </button></td>
                                    </tr>
                            )
                        })
                    }

                


            </tbody>
        </table>
    </div>
    )
}
export default TableRecipe