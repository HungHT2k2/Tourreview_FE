import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './style.scss'
import RecipeCard from '../card/RecipeCard';
import ProfileCard from '../card/ProfileCard';
import axios from 'axios';
const Home = () => {
  const [dataFavorite, setDataFavorite] = useState([]);
  const [dataNew, setDataNew] = useState([]);
  const [dataChief, setDataChief] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  //Lấy dữ liệu lưu vào các biến setDataFavorite
  const getRecipeFavorite = async () => {
    const res = await axios.get("/recipe/recipe_favorite", {
      params: { page: 1, limit: 4 },
    });
    if (res.data.success) {
      setDataFavorite(res.data.data);
    }
  };
  //Lấy dữ liệu lưu vào các biến setDataNew
  const getRecipeNew = async () => {
    const res = await axios.get("/recipe/recipe_new", {
      params: { page: 1, limit: 4 },
    });
    if (res.data.success) {
      setDataNew(res.data.data);
    }
  };
    //Lấy dữ liệu lưu vào các biến setDataChief
  const getTopChief = async () => {
    const res = await axios.get("/user/top_chief", {
      params: { page: 1, limit: 9 },
    });

    if (res.data.success) {
      setDataChief(res.data.data);
    }
  };

  useEffect(() => {
    getTopChief();
    getRecipeFavorite()
    getRecipeNew()
  }, []);
  return (
    <>
      <div class="container-fluid p-0 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div id="header-carousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img class="w-100" src="https://res.cloudinary.com/sttruyen/image/upload/v1694747978/pmp5hojav9c8osggx3hn.jpg" alt="Image" />
              <div class="carousel-caption">
                <div class="container">
                  <div class="row justify-content-start">
                    <div style={{ color: "black" }} class="col-lg-7">
                      <h1 class="display-2 mb-5 animated slideInDown">Cùng nhau tạo nên những món ăn ngon</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="carousel-item">
              <img class="w-100" src="https://res.cloudinary.com/sttruyen/image/upload/v1694748169/gwrobojgvpbfyejhb40j.jpg" alt="Image" />
              <div class="carousel-caption">
                <div class="container">
                  <div style={{ color: "black" }} class="row justify-content-start">
                    <div class="col-lg-7">
                      <h1 class="display-2 mb-5 animated slideInDown">Khám phá mọi miền ẩm thực của thế giới</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#header-carousel"
            data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#header-carousel"
            data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <div class="container-xxl py-5">
        <div class="container">
          <div class="row g-0 gx-5 align-items-end">
            <div class="section-header text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "500px" }}>
              <h1 style={{ fontWeight: "700" }} class="display-5 mb-3">Nổi bật</h1>
              <p>Những món ăn nổi bật được nhiều người yêu thích nhất.</p>
            </div>
          </div>
          <div class="tab-content">
            <div class="tab-pane fade show p-0 active">
              <div class="row g-4">
{/* hiển thị danh sách các món ăn yêu thích*/}
                {dataFavorite.map((item) => {
                  const img = item.tags?.find((el) => el.k === "image");
                  return (
                    <div
                      class="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
                      data-wow-delay="0.1s"
                    >
                      <RecipeCard
                        item={item}
                        image={
                          img?.v ||
                          "https://cdnimg.vietnamplus.vn/t620/uploaded/ngtnnn/2022_07_27/2707banhxeo.jpg"
                        }
                        reload={getRecipeFavorite}
                      />
                    </div>
                  );
                })}

                <div class="col-12 text-center">
                  <Link class="btn btn-primary rounded-pill py-3 px-5" to="/recipe/search?type=favorite">Hiển thị thêm</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container-xxl py-5">
        <div class="container">
          <div class="row g-0 gx-5 align-items-end">
            <div class="section-header text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "500px" }}>
              <h1 style={{ fontWeight: "700" }} class="display-5 mb-3">Món mới</h1>
              <p>Những món ăn mới được đưa lên bởi các đầu bếp được yêu thích nhất.</p>
            </div>
          </div>
          <div class="tab-content">
            <div class="tab-pane fade show p-0 active">
              <div class="row g-4">
                {dataNew.map((item) => {
                  const img = item.tags?.find((el) => el.k === "image");
                  return (
                    <div
                      class="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
                      data-wow-delay="0.1s"
                    >
                      <RecipeCard
                        item={item}
                        image={
                          img?.v ||
                          "https://cdnimg.vietnamplus.vn/t620/uploaded/ngtnnn/2022_07_27/2707banhxeo.jpg"
                        }
                        reload={getRecipeNew}
                      />
                    </div>
                  );
                })}

                <div class="col-12 text-center">
                  <Link class="btn btn-primary rounded-pill py-3 px-5" to="/recipe/search?type=new">Hiển thị thêm</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid bg-light bg-icon py-6 mb-5">
        <div class="container">
          <div class="section-header text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "500px" }}>
            <h1 style={{ fontWeight: "700" }} class="display-5 mb-3">Đầu bếp ưa thích</h1>
            <p>Những đầu bếp có số lượng theo dõi lớn nhất với cũng cống hiến vô cùng lớn của họ.</p>
          </div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            loop
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
            }}
          >
            {dataChief.map((item) => {
              if (item?._id === user?._id) {
                return
              }
              console.log(item)
              return (
                <SwiperSlide>
                  <ProfileCard
                    item={item}
                    reload={getTopChief}
                    image={
                      item.tags.find((el) => el.k === "image")?.v ||
                      "https://www.cet.edu.vn/wp-content/uploads/2018/04/nghe-dau-bep-cet.jpg"
                    }
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  )
}

export default Home