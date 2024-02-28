import React, { useEffect, useState } from 'react'
import './style.scss'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Dashboard from './Dashboard'
import Accounts from './Accounts'
import Recipes from './Recipes'


const Admin = () => {
  const { slug } = useParams();

  const navigate = useNavigate();
  const [type, setType] = useState('');
  useEffect(() => {
    setType(slug);
  }, [slug]);

  const [user, setUser] = useState(null);
  const [userTagObj, setUserTagObj] = useState({});

  useEffect(() => {
    const storeUser = localStorage.getItem("user");
    setUser(JSON.parse(storeUser));
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      if (JSON.parse(user)?.role != "admin") {
        navigate('/');
      }
    }
    else {
      navigate('/');
    }
  }, []);

  return (
    <>
      <div className="position-relative bg-white d-flex p-0 container">
        <div className="sidebar pe-4 pb-3">
          <nav className="navbar bg-light navbar-light">
            <Link href="index.html" className="navbar-brand mx-4 mb-3">
              <h3 className="text-primary"><i className="fa fa-hashtag me-2"></i>DASHMIN</h3>
            </Link>
            <div className="d-flex align-items-center ms-4 mb-4">
              <div className="position-relative">
                <img className="rounded-circle" src="https://res.cloudinary.com/sttruyen/image/upload/v1694770029/another/ynkleg4mv9ys1lxs9isl.gif" alt="" style={{ width: "40px", height: "40px" }} />
                <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
              </div>
              <div className="ms-3">
                <h6 className="mb-0">{user?.name}</h6>
                <span>Admin</span>
              </div>
            </div>
            <div style={{ minHeight: "50vh" }} className="navbar-nav w-100">
              <Link to="/admin/manager/dashboard" className={`nav-item nav-link ${type === 'dashboard' && 'active'}`}><i className="fa fa-tachometer-alt me-2"></i>Dashboard</Link>
              <Link to="/admin/manager/accounts" className={`nav-item nav-link ${type === 'accounts' && 'active'}`}><i className="fa fa-users"></i>Tài khoản</Link>
              <Link to="/admin/manager/recipes" className={`nav-item nav-link ${type === 'recipes' && 'active'}`}><i className="fa fa-keyboard me-2"></i>Công thức</Link>
            </div>
          </nav>
        </div>
        <div className="content">
          <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
            <div style={{ marginTop: "10px" }} className="d-none d-md-flex ms-4 align-content-center">
              <div className="input-group">
                <div className="form-outline">
                  <input placeholder='Tìm kiếm' type="search" id="form1" className="form-control" />
                </div>
                <button style={{ height: "45px" }} type="button" className="btn btn-primary">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
            <div className="navbar-nav align-items-center ms-auto">
              <div className="nav-item dropdown">
                <div style={{ cursor: "pointer" }} className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  <img className="rounded-circle me-lg-2" src="https://res.cloudinary.com/sttruyen/image/upload/v1694770081/another/kgxpacycwxq7aqeww2e8.gif" alt="" style={{ width: "40px", height: "40px" }} />
                  <span className="d-none d-lg-inline-flex">{user?.name}</span>
                </div>
                <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
                  <div onClick={() => {
                    navigate(`/${user?._id}/profile`)
                  }} style={{ cursor: "pointer" }} className="drop_item">My Profile</div>
                  <div onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem("user");
                    navigate('/');
                  }} style={{ cursor: "pointer" }} className="drop_item">Log Out</div>
                </div>
              </div>
            </div>
          </nav>
          {type === 'dashboard' && <Dashboard />}
          {type === 'accounts' && <Accounts />}
          {type === 'recipes' && <Recipes />}
        </div>
      </div>
      <div href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="fa fa-arrow-up"></i></div>
    </>
  )
}
export default Admin