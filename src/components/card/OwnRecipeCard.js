import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { getOwnRecipe, getRecipe } from '../recipe/recipeService';

const OwnRecipeCard = ({ item, user }) => {
    const [active, setActive] = useState(true);
    useEffect(() => {
        getOwnRecipe().then(data => { setDataRecipe(data.data.recipe) })
    }, [])


    const [dataRecipe, setDataRecipe] = useState([]);

    const handleChangeStatus = (id) => {
        const token = localStorage.getItem('token');
        const confirmChangStatus = window.confirm('Đổi trạng thái của món ăn này?');
        if (confirmChangStatus) {
            axios.post(`/recipe/changestatus/${id}`, null, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            setActive(!active);
            window.location.reload()
        }
    }
    const handleDelete = (id) => {
        const token = localStorage.getItem('token');
        const confirmDelete = window.confirm('Bạn có muốn xóa product này không?');
        if (confirmDelete) {
            axios.delete(`/recipe/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then(() => {
                // Xóa thành công, cập nhật lại state dataRecipe
                setDataRecipe(prevData => prevData.filter(data => data._id !== id));
                window.location.reload()
            })
                .catch(error => {
                    // Xử lý lỗi khi xóa không thành công
                    console.log(error);
                });
        }
    }
    //
    const [tags, setTags] = useState({});
    useEffect(() => {
        let tag = {};
        item.tags?.forEach(item => {
            tag = {
                ...tag,
                [item?.k]: item?.v
            }
        })
        setTags({ ...tag })
    }, [item]);
    return (
        <div className="product-item">
            <div className="position-relative bg-light overflow-hidden">
                <Link to={`/recipe/${item?._id}`}>
                    <img style={{ height: "200px", objectFit: "cover" }} className="img-fluid w-100" src={tags?.image ? tags.image : "https://res.cloudinary.com/sttruyen/image/upload/v1694421667/ea4r3uwdjmkobr1mpmkg.jpg"} alt="" />
                </Link>
                <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-2 py-1 px-3">{tags?.country}</div>
            </div>
            <div className="text-center p-2">
                <Link style={{ textDecoration: "none" }} className="d-block h5 mb-1" to="/recipe/id">{item?.name}</Link>
                <span style={{ fontSize: "15px", fontStyle: "italic" }} className="text-secondary me-2 d-block">by {user?.name}</span>
                <span className="text-secondary me-1">{item?.favorites?.length} <i style={{ color: "red" }} className="fa-solid fa-heart"></i></span>
            </div>
            <div className="d-flex border-top">
                <small className="w-50 text-center border-end py-2">
                    <Link style={{ textDecoration: "none" }} className="text-body" to={`/recipe/edit/${item?._id}`}><i className="fa fa-eye text-primary me-2"></i>Sửa</Link>
                </small>
                <small className="w-50 text-center py-2 border-end">
                    <Link style={{ textDecoration: "none", cursor: "pointer" }} onClick={() => handleDelete(item?._id)} className="text-body"><i className="fa fa-shopping-bag text-primary me-2"></i>Xóa</Link>
                </small>
                <small className="w-50 text-center py-2 border-end">
                    <Link style={{ textDecoration: "none", cursor: "pointer" }} onClick={() => handleChangeStatus(item?._id)} className="text-body"><i className="fa fa-shopping-bag text-primary me-2"></i>{item?.status}</Link>
                </small>
            </div>
        </div>
    )
}

export default OwnRecipeCard