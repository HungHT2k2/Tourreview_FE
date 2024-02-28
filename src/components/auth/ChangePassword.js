import React, { useRef } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2';
import { AwaitProps, useNavigate, useParams } from 'react-router-dom';
const ChangePassword = () => {
  let { id, token } = useParams();
  const inputPass = useRef();
  const navigate = useNavigate();
  const changePassword = async () => {
    // lấy token, id user bên kia gửi sang
    // lấy mật khẩu mới 

    const newPass = inputPass.current.value;
    try {

      const body = {
        password: newPass
      }
      const tk = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      const res = await axios.put(`/user/${id}`, body, tk);
      console.log(res);
      const { success } = res.data.data;
      if (success == true) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Change Password Successfully',
          showConfirmButton: false,
          timer: 1500
        })
        navigate('/')
      }
      else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: "Change Password Failed",
          showConfirmButton: false,
          timer: 1500
        })
        navigate('/forgot')
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
                Forgot Password
              </span>
              {/* <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                <input className="input100 input_custom_auth" type="text" name="email" placeholder="Email" ref={inputEmail} />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div> */}
              <div style={{ marginTop: "15px" }} className="wrap-input100 validate-input alert-validate" data-validate="Mật khẩu không được trống">
                <input className="input100 input_custom_auth" type="password" name="pass" placeholder="Mật khẩu mới" ref={inputPass} />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>
              <div className="container-login100-form-btn" onClick={changePassword}>
                <button className="login100-form-btn custom_btn_auth">
                  Send
                </button>
              </div>
              {/* <div className="text-center p-t-12">
                <span className="txt1">
                  Quên
                </span>
                <Link style={{ marginLeft: "10px" }} className="txt2 link_auth" to="/forgot">
                  tài khoản/mật khẩu?
                </Link>
              </div> */}
              {/* <div className='w-100 d-flex justify-content-center'>
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
              </div> */}
            </div>
          </div>
        </div>
      </div></>
  )
}

export default ChangePassword