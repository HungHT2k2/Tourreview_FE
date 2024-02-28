import React, { useRef } from 'react'
import './style.scss';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2';
const Login = () => {
  const inputEmail = useRef();
  const inputPass = useRef();
  const navigate = useNavigate();
  const loginAccount = async () => {
    const email = inputEmail.current.value;
    const pass = inputPass.current.value;
    const body = {
      email: email,
      password: pass
    }
    try {

      const user = await axios.post(`http://localhost:5000/user/login`, body);
      const { statusCode, success, data, token } = user.data.data;
      if (success == true) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Login Success',
          showConfirmButton: false,
          timer: 1500,

        })
        localStorage.setItem("token", token)
        let userTag = {};
        data?.tags?.forEach(item => {
          userTag = {
            ...userTag,
            [item?.k]: item?.v
          }
        })
        localStorage.setItem("user", JSON.stringify({
          ...data,
          tags: userTag
        }));
        console.log("=================================");
        const user = JSON.parse(localStorage.getItem('user'));
        console.log(user);
        navigate('/');

      }
      else {

        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: data,
          showConfirmButton: false,
          timer: 1500,
        })

      }
    } catch (error) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: "Error network",
        showConfirmButton: false,
        timer: 1500
      })
    }

  }
  return (
    <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <div className="login100-pic js-tilt">
              <img src="https://res.cloudinary.com/sttruyen/image/upload/v1694770081/another/kgxpacycwxq7aqeww2e8.gif" alt="IMG" />
            </div>
            <div className="login100-form validate-form">
              <span style={{ fontWeight: "600", fontSize: "35px" }} className="login100-form-title">
                Đăng nhập
              </span>
              <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                <input className="input100 input_custom_auth" type="text" name="email" placeholder="Email" ref={inputEmail} required />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div>
              <div style={{ marginTop: "15px" }} className="wrap-input100 validate-input" data-validate="Mật khẩu không được trống">
                <input className="input100 input_custom_auth" type="password" name="pass" placeholder="Mật khẩu" ref={inputPass} />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>
              <div className="container-login100-form-btn" onClick={loginAccount}>
                <button className="login100-form-btn custom_btn_auth">
                  Đăng nhập
                </button>
              </div>
              <div className="text-center p-t-12">
                <span className="txt1">
                  Quên
                </span>
                <Link style={{ marginLeft: "10px" }} className="txt2 link_auth" to="/forgot">
                  tài khoản/mật khẩu?
                </Link>
              </div>
              <div className='w-100 d-flex justify-content-center'>
                <div className='circle_border'>
                  <form action="http://localhost:5000/login/facebook" method="GET">
                    <button type="submit" style={{ backgroundColor: 'rgba(0,0,0,0)', border: 'none', padding: '5px' }}>
                      <i className="fa-brands fa-facebook-f"></i>
                    </button>
                  </form>
                </div>
                <div className='circle_border'>
                  <form action="http://localhost:5000/auth/google" method="GET">
                    <button type="submit" style={{ backgroundColor: 'rgba(0,0,0,0)', border: 'none', padding: '5px' }}>
                      <i className="fa-brands fa-google"></i>
                    </button>
                  </form>
                </div>
              </div>
              <div className="text-center p-t-136">
                <Link className="txt2 link_auth" to="/register">
                  Tạo tài khoản mới ?
                  <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div></>
  )
}

export default Login