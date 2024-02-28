import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './style.scss'
import Swal from 'sweetalert2';
const Header = () => {
  const [wasLogin, setWasLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setWasLogin(false);
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Đăng xuất thành công.',
      showConfirmButton: false,
      timer: 1500
    })
    navigate('/');
  }

  useEffect(() => {
    setWasLogin(window.localStorage.getItem('token') != null);
    setUser(window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')) : null);
  }, []);

  return (
    <>
      <div style={{ backgroundColor: "#E1E4EB" }} className="container-fluid fixed-top px-0 wow fadeIn" data-wow-delay="0.1s">
        <div className="top-bar row gx-0 align-items-center d-none d-lg-flex">
          <div className="col-lg-6 px-5 text-start">
            <small><i className="fa fa-map-marker-alt me-2"></i>FPT University, Hòa Lạc, HN, VN</small>
            <small className="ms-4"><i className="fa fa-envelope me-2"></i>cookingtogether@cooking.com</small>
          </div>
          <div className="col-lg-6 px-5 text-end">
            <small>Follow us:</small>
            <a className="text-body ms-3" href=""><i className="fab fa-facebook-f"></i></a>
            <a className="text-body ms-3" href=""><i className="fab fa-twitter"></i></a>
            <a className="text-body ms-3" href=""><i className="fab fa-linkedin-in"></i></a>
            <a className="text-body ms-3" href=""><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        <nav className="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5 wow fadeIn" data-wow-delay="0.1s">
          <Link to="/" className="navbar-brand ms-4 ms-lg-0">
            <h1 className="fw-bold text-primary m-0">C<span className="text-secondary">oo</span>ky</h1>
          </Link>
          <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto p-4 p-lg-0">
              {!wasLogin && <Link to='/login' className="nav-item nav-link active d-lg-none">Login</Link>}
              {wasLogin && <Link to={`/${user?._id}/profile`} className="nav-item nav-link active d-lg-none">Profile</Link>}
              {wasLogin && <div onClick={handleLogout} style={{cursor:"pointer"}}  className='nav-item nav-link active d-lg-none'>
              Đăng xuất
              </div>}
            </div>
            <div className="d-none d-lg-flex ms-2">
              <Link style={{ textDecoration: "none", color: "black" }} className="btn-sm-square bg-white rounded-circle ms-3" to='/'>
                <i className="fa-solid fa-house"></i>
              </Link>
              <Link style={{ textDecoration: "none", color: "black" }} className="btn-sm-square bg-white rounded-circle ms-3" to='/recipe/search'>
                <small className="fa fa-search text-body"></small>
              </Link>
              <Link style={{ textDecoration: "none", color: "black" }} className="btn-sm-square bg-white rounded-circle ms-3" to={`/${user?._id}/profile`}>
                <i className="fa-regular fa-heart"></i>
              </Link>
              {!wasLogin ?
                <Link style={{ textDecoration: "none", color: "black", padding: "0 10px", borderRadius: "20px", paddingTop: "2.5px" }} className=" bg-white ms-3" to='/login'>
                  <small className="text-body">Đăng nhập</small>
                </Link> :
                <div
                  style={{ textDecoration: 'none', color: 'black', cursor: "pointer" }}
                  className="btn-sm-square bg-white rounded-circle ms-3 position-relative"
                  onClick={toggleMenu}
                >
                  <small className="fa fa-user text-body"></small>
                  {isOpen && <div className='header_user'>
                    <div className='header_user_n'>
                      <p><i>Name: {user?.name}</i></p>
                    </div>
                    <div onClick={() => {
                      if (user?.role == "admin") {
                        navigate(`/admin/manager/dashboard`)
                      }
                      else {
                        navigate(`/${user?._id}/profile`)
                      }
                    }} className='header_user_n'>
                      <p>{user?.role == "admin" ? "Management" : "Profile"}</p>
                    </div>
                    <div onClick={handleLogout} className='header_user_n'>
                      <p>
                        Đăng xuất
                      </p>
                    </div>
                  </div>}
                </div>
              }
            </div>
          </div>
        </nav >
      </div >
    </>
  )
}

export default Header