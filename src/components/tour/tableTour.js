import { useEffect, useState } from 'react'
import './style.scss'
import axios from 'axios';
import { getOwnTour, getTour } from './tourService';
import { useNavigate } from 'react-router-dom';
const TableTour = () => {
    const navigate = useNavigate();
    const [dataTour, setDataTour] = useState([]);
    console.log(dataTour);
    useEffect(() => {
        getOwnTour().then(data => {setDataTour(data.data.tour)})
    }, [])
    const handleDelete = (id) => {
        const token = localStorage.getItem('token');

        axios.delete(`http://localhost:9999/tour/${id}`,{
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(() => {
            // Xóa thành công, cập nhật lại state dataTour
            setDataTour(prevData => prevData.filter(data => data._id !== id));
        })
        .catch(error => {
            // Xử lý lỗi khi xóa không thành công
            console.log(error);
        });
    }
    const handleEdit = (id) => {
        console.log(id);
        navigate(`/tour/edit/${id}`);
    }
    return (<div className='list-tour'>
        <h2>Your Tours</h2>
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
                        dataTour.map((data,index) => {
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
export default TableTour