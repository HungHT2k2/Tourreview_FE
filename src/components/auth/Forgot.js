import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2';
const Forgot = () => {
  const inputEmail = useRef();
  const forgotPassword = async () => {
    const email = inputEmail.current.value;
    console.log(email);
    const body = { email: email };
    try {
      
      const res = await axios.post(`http://localhost:5000/user/forgot-password`, body);
      const { success, data } = res.data;
      if (success == true) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Send Email Successfully',
          showConfirmButton: false,
          timer: 1500
        })
      }
      else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: data,
          showConfirmButton: false,
          timer: 1500
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
                Quên mật khẩu
              </span>
              <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                <input className="input100 input_custom_auth" type="text" name="email" placeholder="Email" ref={inputEmail} />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div>
              <div className="container-login100-form-btn">
                <button className="login100-form-btn custom_btn_auth" onClick={forgotPassword}>
                  Quên mật khẩu
                </button>
              </div>
              <div className="text-center p-t-12">
                <span className="txt1">
                  Đã
                </span>
                <Link style={{ marginLeft: "10px" }} className="txt2 link_auth" to="/login">
                  có tài khoản?
                </Link>
              </div>
              <div className='w-100 d-flex justify-content-center'>
                <div className='circle_border'>
                  <i className="fa-brands fa-facebook-f"></i>
                </div>
                <div className='circle_border'>
                  <i className="fa-brands fa-google"></i>
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

export default Forgot