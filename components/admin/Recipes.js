import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import RecipeAdminCard from './RecipeAdminCard';
const Recipes = () => {

    const [recipes, setRecipes] = useState([]);

    const [reload,setReload] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get('/admin/recipe', {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setRecipes(res.data?.recipes);
            })
            .catch(err => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: "Error network",
                    showConfirmButton: false,
                    timer: 1500
                })
            })
    }, [reload]);
    return (
        <div>
            <section className="ftco-section">
                <div className="row">
                    <div className="col-md-12">
                        <div className="table-wrap">
                            <table className="table table-responsive-xl">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên món</th>
                                        <th>Người tạo</th>
                                        <th>Status</th>
                                        <th style={{width:'15%'}}>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recipes?.map((item,index) => 
                                    <RecipeAdminCard setReload={setReload} key={item?._id + "a"} item={item} index={index}/>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
            <div style={{ marginTop: "30px" }} className='col-12 d-flex justify-content-center'>
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li style={{ cursor: "pointer" }} className="page-item">
                            <div className="page-link" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                                <span className="sr-only">Previous</span>
                            </div>
                        </li>
                        <li style={{ cursor: "pointer" }} className="page-item"><div className="page-link active" href="#">1</div></li>
                        <li style={{ cursor: "pointer" }} className="page-item"><div className="page-link" href="#">2</div></li>
                        <li style={{ cursor: "pointer" }} className="page-item"><div className="page-link" href="#">3</div></li>
                        <li style={{ cursor: "pointer" }} className="page-item">
                            <div className="page-link" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                                <span className="sr-only">Next</span>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Recipes