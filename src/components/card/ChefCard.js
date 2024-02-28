import React from 'react'
import { Link } from 'react-router-dom'

const ChefCard = () => {
    return (
        <div class="product-item">
            <div class="position-relative bg-light overflow-hidden">
                <Link to='/recipe/id'>
                    <img style={{ height: "350px", objectFit: "cover" }} class="img-fluid w-100" src="https://res.cloudinary.com/sttruyen/image/upload/v1694421667/sggxexjxdyhpygdopgxe.jpg" alt="" />
                </Link>
                <div class="bg-secondary rounded text-white position-absolute start-0 top-0 m-2 py-1 px-3">Đầu bếp hot</div>
            </div>
            <div class="text-center p-2">
                <Link style={{ textDecoration: "none" }} class="d-block h5 mb-1" to="/recipe/id">Minh Quang</Link>
                <span style={{ fontSize: "15px", fontStyle: "italic" }} class="text-secondary me-2 d-block">Đầu bếp mới</span>
                <span class="text-secondary me-1">2000 <i style={{ color: "red" }} class="fa-solid fa-heart"></i></span>
            </div>
            <div class="d-flex border-top">
                <small class="w-100 text-center py-2">
                    <div style={{ textDecoration: "none", cursor: "pointer" }} class="text-body"><i class="fa fa-user text-primary me-2"></i>Theo dõi</div>
                </small>
            </div>
        </div>
    )
}

export default ChefCard