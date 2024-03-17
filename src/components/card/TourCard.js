import axios from "axios";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const TourCard = ({ item, image, tour, name, reload }) => {
  //Lấy thông tin người dùng từ localStorage (dựa trên đối tượng "user").
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const tourId = tour?._id;

  //xử lý sự kiện khi người dùng nhấn vào nút "Favorite".
  const handleAddFavorite = async () => {
    const token = localStorage.getItem("user")
    //check đăng nhập(điều hướng)
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(
        `/user/c_m/${item._id}`,
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (reload) {
        reload();
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div style={{ margin: "5px 0" }} className="product-item">
      <div className="position-relative bg-light overflow-hidden">
        <Link to={`/tour/${item?._id}`}>
          <img
            style={{
              height: "200px",
              objectFit: "cover",
            }}
            className="img-fluid w-100"
            src={image || "https://res.cloudinary.com/sttruyen/image/upload/v1694421667/ea4r3uwdjmkobr1mpmkg.jpg"}
            alt={item?.name}
          />
        </Link>
      </div>
      <div className="text-center p-2">
        <Link
          style={{ textDecoration: "none" }}
          className="d-block h5 mb-1"
          to="/tour/id"
        >
          {item?.name || name}
        </Link>
        <span
          style={{ fontSize: "15px", fontStyle: "italic" }}
          className="text-secondary me-2 d-block"
        >
          by {item?.users?.[0].name}
        </span>

        <span className="text-secondary me-1">
          {item?.favorites_size}
          <i style={{ color: "red" }} className="fa-solid fa-heart"></i>
        </span>
        <div className="d-flex border-top">
          <small className="w-50 text-center border-end py-2">
            <Link
              style={{ textDecoration: "none" }}
              className="text-body"
              to={`/tour/${item?._id}`}
            >
              <i className="fa fa-eye text-primary me-2"></i>View detail
            </Link>
          </small>
          <small className="w-50 text-center py-2">
            <div
              style={{ textDecoration: "none", cursor: "pointer" }}
              className="text-body"
              onClick={handleAddFavorite}
            >
              {/* kiểm tra xem user?._id (ID của người dùng hiện tại) 
              có tồn tại trong mảng item?.favorites hay không. 
              Nếu tồn tại (người dùng đã yêu thích), nó hiển thị "Unfavorite" */}
               <i className="fa fa-heart text-primary me-2"></i>
              {item?.favorites?.find((item) => item === user?._id)
                ? "Unfavorite"
                : "Favorite"}
            </div>
          </small>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
