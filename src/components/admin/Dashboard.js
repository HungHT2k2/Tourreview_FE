import React, { useEffect, useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import axios from 'axios';
import { Bar } from "react-chartjs-2";
import Swal from 'sweetalert2'
import moment from 'moment'
import {useNavigate} from 'react-router-dom'
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const Dashboard = () => {

    const [dashboard, setDashboard] = useState(null)
    const navigate = useNavigate();

    let date = 31;
    let labels = Array(date)
        .fill(1)
        .map((_, index) => index + 1);
    let options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Thống kê",
            },
        },
    };
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

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get('/admin/dashboard', {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
            .then(res => {

                setDashboard(res.data);
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
    }, [dashboard]);

    const deleteRecipe = async (id) => {
        try{
            await axios.post(`/admin/recipe/${id}`,{
            },{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: "Change status successfully!",
                showConfirmButton: false,
                timer: 1500
            })
        }
        catch(err){
        }
    }
    const blockUser = (id) => {

        console.log(id);
        const token = localStorage.getItem("token");
        axios.put(`/user/block/${id}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Block Success',
                    showConfirmButton: false,
                    timer: 1500
                })
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
    }
    const openUser = (id) => {

        console.log(id);
        const token = localStorage.getItem("token");
        axios.put(`/user/open/${id}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Open Success',
                    showConfirmButton: false,
                    timer: 1500
                })

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
    }
    let data = {
        labels,
        datasets: [
            {
                label: "Tài khoản mới",
                data: dashboard?.newUserCounts || [],
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
            {
                label: "Công thức mới",
                data: dashboard?.newRecipeCounts || [],
                backgroundColor: "rgba(53, 162, 235, 1)",
            },
        ],
    };


    return (
        <>

            <div className="container-fluid pt-4 px-4">
                <div className="row g-4">
                    <div className="col-sm-6 col-xl-4">
                        <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                            <i className="fa fa-chart-line fa-3x text-primary"></i>
                            <div className="ms-3">
                                <p className="mb-2">Tổng tài khoản</p>
                                <h6 className="mb-0">{dashboard?.totalUser}</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-4">
                        <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                            <i className="fa fa-chart-bar fa-3x text-primary"></i>
                            <div className="ms-3">
                                <p className="mb-2">Tổng công thức</p>
                                <h6 className="mb-0">{dashboard?.totalRecipe}</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-4">
                        <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                            <i className="fa fa-chart-area fa-3x text-primary"></i>
                            <div className="ms-3">
                                <p className="mb-2">Tổng đầu bếp</p>
                                <h6 className="mb-0">{dashboard?.totalChief}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {dashboard && <div style={{ marginTop: "20px" }}>
                <Bar options={options} data={data} />
            </div>}
            <div className="container-fluid pt-4 px-4">
                <div className="bg-light text-center rounded p-4">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h6 className="mb-0">Tài khoản mới</h6>
                    </div>
                    <div className="table-responsive">
                        <table className="table text-start align-middle table-bordered table-hover mb-0">
                            <thead>
                                <tr className="text-dark">
                                    <th scope="col"><input className="form-check-input" type="checkbox" /></th>
                                    <th scope="col">Ngày tạo</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Vai trò</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboard?.newUser?.map(item =>
                                    <tr key={item?._id + "newUser"}>
                                        <td><input className="form-check-input" type="checkbox" /></td>
                                        <td>{moment(item?.createdAt).fromNow()}</td>
                                        <td>{item?.email}</td>
                                        <td>{item?.role}</td>
                                        <td>{item?.status == "opened" ? <button className="btn btn-sm btn-primary" href="" onClick={() => blockUser(item?._id)}>Khóa</button> : <button className="btn btn-sm btn-primary" href="" onClick={() => openUser(item?._id)}>Open again</button>}</td>
                                    </tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="container-fluid pt-4 px-4">
                <div className="bg-light text-center rounded p-4">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h6 className="mb-0">Công thức mới</h6>
                    </div>
                    <div className="table-responsive">
                        <table className="table text-start align-middle table-bordered table-hover mb-0">
                            <thead>
                                <tr className="text-dark">
                                    <th scope="col"><input className="form-check-input" type="checkbox" /></th>
                                    <th scope="col">Ngày tạo</th>
                                    <th scope="col">Tên công thức</th>
                                    <th scope="col">Người tạo</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboard?.newRecipe?.map(item =>
                                    <tr key={item?._id + "dashboard"}>
                                        <td><input className="form-check-input" type="checkbox" /></td>
                                        <td>{moment(item?.createdAt).fromNow()}</td>
                                        <td>{item?.name}</td>
                                        <td>Jhon Doe</td>
                                        <td><button className="btn btn-sm btn-primary" href="" onClick={() => deleteRecipe(item?._id)}> Change status</button></td>
                                    </tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div></>
    )
}

export default Dashboard