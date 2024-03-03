import React, { useEffect, useState } from 'react'
import AccountCard from '../card/AccountCard'
import axios from 'axios';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
const Accounts = () => {

    const [users,setUsers] = useState([]);

    const [reload,setReload] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get('/admin/user', {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setUsers(res.data?.users);
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

    useEffect(() => {
        const user = localStorage.getItem("user");
        if(user){
            if(JSON.parse(user)?.role != "admin"){
                navigate('/');
            }
        }
        else{
            navigate('/');
        }
    },[]);
    return (
        <div>
            <section className="ftco-section">
                <div className="row">
                    <div className="col-md-12">
                        <div className="table-wrap">
                            <table className="table table-responsive-xl">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Thông tin</th>
                                        <th>Vai trò</th>
                                        <th>Công thức</th>
                                        <th>Theo dõi</th>
                                        <th>Status</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                   {users?.map((item,index) =>  <AccountCard setReload={setReload} index={index} key={item?._id + "user"} user={item}/>)}
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

export default Accounts