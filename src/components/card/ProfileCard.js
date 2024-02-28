import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const ProfileCard = ({ image, item, reload }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <section
      style={{
        backgroundColor: "#9de2ff",
        height: "250px",
        borderRadius: "30px",
      }}
    >
      <div class="container custom_py-5 h-100">
        <div class="row d-flex align-items-center">
          <div class="col col-md-9 col-lg-7 col-xl-5">
            <div class="card" style={{ borderRadius: "15px" }}>
              <div style={{ height: "150px" }} class="card-body p-4">
                <div class="d-flex text-black">
                  <Link to="/minhquang/profile" class="flex-shrink-0">
                    <img
                      src={image}
                      alt="Generic placeholder image"
                      class="img-fluid"
                      style={{
                        width: "100px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                  <div class="flex-grow-1 ms-3">
                    <Link
                      style={{
                        textDecoration: "none",
                        color: "rgba(0,0,0,0.6)",
                      }}
                      to="/minhquang/profile"
                    >
                      <h5 class="mb-1">{item?.name}</h5>
                    </Link>
                    <p class="mb-2 pb-1" style={{ color: "#2b2a2a" }}>
                      Chief
                    </p>
                    <div
                      class="d-flex justify-content-start rounded-3 p-2 mb-2"
                      style={{ backgroundColor: "#efefef" }}
                    >
                      <div>
                        <p class="small text-muted mb-1">Recipes</p>
                        <p class="mb-0">{item?.recipe_size}</p>
                      </div>
                      <div class="px-3">
                        <p class="small text-muted mb-1">Followers</p>
                        <p class="mb-0">{item?.followers_size}</p>
                      </div>
                    </div>
                    <div class="d-flex pt-1">
                      <button
                        type="button"
                        class="btn btn-primary flex-grow-1"
                        onClick={async () => {
                          if (!localStorage.getItem(
                            "token"
                          )) {
                            return;
                          }
                          await axios.post(
                            `/user/f_m/${item?._id}`,
                            {},
                            {
                              headers: {
                                authorization: `Bearer ${localStorage.getItem(
                                  "token"
                                )}`,
                              },
                            }
                          );
                          reload();
                        }}
                      >
                        {item?.followers?.find((item) => item === user?._id)
                          ? "Bỏ theo dõi"
                          : "Theo dõi"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
