import React, { useEffect, useRef, useState } from "react";
import "./style.scss";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  reconnection: true,
});
socket.on("connect", () => {
  console.log("WebSocket connected");
});

socket.on("disconnect", () => {
  console.log("WebSocket disconnected");
});
const Recipe = () => {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState({});
  const [user, setUser] = useState({});
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);

  const recipeContentRef = useRef();

  const natigate = useNavigate();
  useEffect(() => {
    const loadUser = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(loadUser));
    }
    axios
      .get(`/recipe/${slug}`)
      .then((res) => {
        let tags = {};
        res.data?.recipe?.tags.forEach((item) => {
          tags = {
            ...tags,
            [item.k]: item.v,
          };
        });
        let ownerTag = {};
        res.data?.recipe?.owner?.tags?.forEach((item) => {
          ownerTag = {
            ...ownerTag,
            [item.k]: item.v,
          };
        });
        setRecipe({
          ...res.data?.recipe,
          tags: tags,
          owner: {
            ...res.data?.recipe?.owner,
            tags: ownerTag,
          },
        });
        
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`/comment/${slug}`)
      .then((res) => {
        const receivedComments = res.data.data;
        if (Array.isArray(receivedComments)) {
          setComments(receivedComments);
        } else {
          console.error("Invalid comments data received:", receivedComments);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [slug]);

  useEffect(() => {
    socket.on("commentAdded", (newComment) => {
      setComments((prevComments) => [...prevComments, newComment]);
    });
  }, []);

  useEffect(() => {
    socket.on("commentDeleted", (deletedCommentId) => {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== deletedCommentId)
      );
    });
  }, []);

  useEffect(() => {
    if(recipe){
      recipeContentRef.current.innerHTML = recipe?.recipes
    }
  },[recipe]);

  useEffect(() => {
    socket.on("commentUpdated", (updatedComment) => {
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment
        )
      );
    });
  }, []);

  useEffect(() => {
    socket.on("commentReported", (reportedComment) => {
      setComments((prevComments) => {
        return prevComments.map((comment) => {
          if (comment._id === reportedComment._id) {
            // update reported field
            return { ...comment, reported: true };
          }
          return comment;
        });
      });
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [defaultStar, setDefaultStar] = useState(5);
  const [rating, setRating] = useState(0);
  const [showIcons, setShowICons] = useState(false);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const handleCancelPost = () => {
    setComment("");
  };

  const handlePostComment = async () => {
    const token = localStorage.getItem("token");

    socket.emit("comment", comment);

    const newCommentObject = {
      content: comment,
      recipeId: recipe._id,
      parentId: null,
    };

    try {
      const response = await axios.post(`/comment`, newCommentObject, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Comment posted successfully", response);

      setComments([...comments, newCommentObject]);

      setComments([...comments, response.data.data]);

      setComment("");
    } catch (error) {
      console.error("Error posting comment", error);
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const renderStars = () => {
    const starIcons = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= defaultStar;
      starIcons.push(
        <i
          style={{ margin: "0 3px", color: filled && "#CF3700" }}
          key={i}
          className={`fa-solid fa-star`}
        ></i>
      );
    }
    return starIcons;
  };

  const handleEditComment = async (commentId, updatedContent) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `/comment/${commentId}`,
        { content: updatedContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setEditingCommentId(null);
        console.log("Comment edited successfully");
      }
    } catch (error) {
      console.error("Error editing comment", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");

    if (!commentId || commentId === "undefined") {
      console.log("Invalid commentId:", commentId);
      return;
    }

    try {
      const response = await axios.delete(`/comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const updatedComments = comments.filter(
          (comment) => comment._id !== commentId
        );

        setComments(updatedComments);

        console.log("Comment deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };

  const handleReportComment = async (commentId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `/comment/${commentId}/report`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Comment reported successfully");
      }
    } catch (error) {
      console.error("Error reporting comment", error);
    }
  };

  return (
    <div className="recipe_bg">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="recipe-img">
              <img
                src={
                  recipe?.tags?.image ||
                  "https://res.cloudinary.com/sttruyen/image/upload/v1694421665/pjcicfq1kncbstai4wbc.jpg"
                }
              />
              <div className="recipe-introduction">
                <p>{recipe?.introduction}</p>
              </div>
              <div className="recipe-name">
                <p style={{ marginBottom: "8px", textAlign: "center" }}>
                  {recipe?.name}
                </p>
                <div className="rating d-flex justify-content-center w-100 flex-row-reverse">
                  {renderStars()}
                </div>
              </div>
              <div className="recipe-owner">
                <div className="recipe-owner-image">
                  <img
                    src={
                      recipe?.owner?.tags?.image
                        ? recipe?.owner?.tags?.image
                        : "https://res.cloudinary.com/sttruyen/image/upload/v1694421664/twfa0a0rxzx2lwtkeryt.jpg"
                    }
                  />
                  <div className="recipe-owner-qr-img">
                    <img
                      src={
                        recipe?.owner?.tags?.qr ||
                        "https://res.cloudinary.com/sttruyen/image/upload/v1695020641/another/sotraosven0w6fdm4mr9.png"
                      }
                    />
                  </div>
                  <div className="recipe-owner-attackment">
                    <i className="fa-solid fa-paperclip"></i>
                  </div>
                </div>
                <div className="recipe-owner-name">
                  <p>{recipe?.owner?.name}</p>
                </div>
                {user?._id == recipe?.owner?._id ? (
                  <div className="recipe-owner-btn">
                    <button
                      onClick={() => {
                        natigate(`/${user?._id}/profile`);
                      }}
                      className="btn btn-primary"
                    >
                      Profile
                    </button>
                  </div>
                ) : (
                  <div className="recipe-owner-btn">
                    <button
                    style={{width:"100px"}}
                      onClick={() => {
                       if(localStorage.getItem("token")){
                        natigate(`/${recipe?.owner?._id}/profile`);
                       }else{
                        natigate(`/login`);
                       }
                      }}
                      className="btn btn-primary"
                    >
                      {localStorage.getItem("token") ? "Theo dõi" : "Đăng nhập"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="recipe_content">
          <div ref={recipeContentRef} className="col-10"></div>
        </div>
        <div className="recipe-comments-rate">
          <section>
            <div style={{ marginTop: "50px" }} className="container text-dark">
              <div className="row d-flex justify-content-center">
                <div className="col-md-10 col-lg-10 col-xl-10">
                  <div className="card">
                    <div className="card-body p-4">
                      <div className="d-flex flex-start w-100">
                        <img
                          className="rounded-circle shadow-1-strong me-3"
                          src={
                            user?.tags?.image ||
                            "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(21).webp"
                          }
                          alt="avatar"
                          width="65"
                          height="65"
                        />
                        <div className="w-100">
                          <h5>{user?.name}</h5>
                          <div className="rating">
                            <input
                              type="radio"
                              id="star1"
                              name="rating"
                              value="1"
                              checked={rating === 1}
                              onChange={() => handleRatingChange(1)}
                            />
                            <label htmlFor="star1">
                              <i className="fa-solid fa-star"></i>
                            </label>

                            <input
                              type="radio"
                              id="star2"
                              name="rating"
                              value="2"
                              checked={rating === 2}
                              onChange={() => handleRatingChange(2)}
                            />
                            <label htmlFor="star2">
                              <i className="fa-solid fa-star"></i>
                            </label>

                            <input
                              type="radio"
                              id="star3"
                              name="rating"
                              value="3"
                              checked={rating === 3}
                              onChange={() => handleRatingChange(3)}
                            />
                            <label htmlFor="star3">
                              <i className="fa-solid fa-star"></i>
                            </label>

                            <input
                              type="radio"
                              id="star4"
                              name="rating"
                              value="4"
                              checked={rating === 4}
                              onChange={() => handleRatingChange(4)}
                            />
                            <label htmlFor="star4">
                              <i className="fa-solid fa-star"></i>
                            </label>

                            <input
                              type="radio"
                              id="star5"
                              name="rating"
                              value="5"
                              checked={rating === 5}
                              onChange={() => handleRatingChange(5)}
                            />
                            <label htmlFor="star5">
                              <i className="fa-solid fa-star"></i>
                            </label>
                          </div>
                          <div className="form-outline">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="recipe-comments">
          <section>
            <div className="container my-5">
              <div className="row d-flex justify-content-center">
                <div className="col-md-12 col-lg-10 col-xl-10">
                  <div className="card">
                    <div className="card-body">
                      <div
                        class="card-footer py-3 border-0"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <div class="d-flex flex-start w-100">
                          <img
                            class="rounded-circle shadow-1-strong me-3"
                            src={
                              user?.tags?.image ||
                              "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp"
                            }
                            alt="avatar"
                            width="40"
                            height="40"
                          />
                          {/* <h4>{user?.name}</h4> */}
                          <div class="form-outline w-100">
                            <textarea
                              placeholder="Bình luận"
                              class="form-control"
                              id="textAreaExample"
                              rows="4"
                              style={{ backgroundColor: "#fff" }}
                              value={comment}
                              onChange={handleCommentChange}
                            ></textarea>
                          </div>
                        </div>
                        <div class="float-end mt-2 pt-1">
                          <button
                            type="button"
                            class="btn btn-primary btn-sm"
                            onClick={handlePostComment}
                          >
                            Post comment
                          </button>
                          <button
                            style={{ marginLeft: "10px" }}
                            type="button"
                            class="btn btn-outline-primary btn-sm"
                            onClick={handleCancelPost}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                      <br />
                      {/*phần render bình luận*/}
                      <div>
                        {comments &&
                          comments.map((comment) => {
                            if (comment.reported) {
                              // Nếu có, render ra thông báo
                              return (
                                <div
                                  className="reported-comment"
                                  key={comment._id}
                                >
                                  <h5>
                                    This comment has been reported and hidden
                                  </h5>
                                </div>
                              );
                            } else {
                              return (
                                <div key={comment._id} className="card mt-4">
                                  <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div className="d-flex flex-start align-items-center">
                                        <img
                                          className="rounded-circle shadow-1-strong me-3"
                                          src={
                                            user?.tags?.image ||
                                            "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp"
                                          }
                                          alt="avatar"
                                          width="60"
                                          height="60"
                                        />
                                        <div>
                                          <h6 className="fw-bold text-primary mb-1">
                                            {user?.name}
                                          </h6>
                                        </div>
                                      </div>
                                      <div>
                                        {editingCommentId === comment._id ? (
                                          <>
                                            <button
                                              className="btn btn-primary btn-sm me-2"
                                              onClick={() =>
                                                handleEditComment(
                                                  comment._id,
                                                  editedCommentContent
                                                )
                                              }
                                            >
                                              Save
                                            </button>
                                            <button
                                              className="btn btn-outline-primary btn-sm me-2"
                                              onClick={() =>
                                                setEditingCommentId(null)
                                              }
                                            >
                                              Cancel
                                            </button>
                                          </>
                                        ) : (
                                          <div className="d-flex">
                                            <button
                                              className="btn btn-danger btn-sm me-2"
                                              onClick={() =>
                                                handleDeleteComment(comment._id)
                                              }
                                            >
                                              Delete
                                            </button>
                                            <button
                                              className="btn btn-warning btn-sm me-2"
                                              onClick={() =>
                                                handleReportComment(comment._id)
                                              }
                                            >
                                              Report
                                            </button>
                                            <button
                                              className="btn btn-info btn-sm"
                                              onClick={() => {
                                                setEditingCommentId(
                                                  comment._id
                                                );
                                                setEditedCommentContent(
                                                  comment.content
                                                );
                                              }}
                                            >
                                              Edit
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <p className="mt-3 mb-4 pb-2">
                                      {editingCommentId === comment._id ? (
                                        <textarea
                                          className="form-control"
                                          value={editedCommentContent}
                                          onChange={(e) =>
                                            setEditedCommentContent(
                                              e.target.value
                                            )
                                          }
                                        ></textarea>
                                      ) : (
                                        comment.content
                                      )}
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                          })}
                      </div>

                      {/* <div className="small d-flex justify-content-start">
                        <div
                          style={{ cursor: "pointer" }}
                          className="d-flex align-items-center me-3"
                        >
                          <i className="far fa-thumbs-up me-2"></i>
                          <p className="mb-0">Like</p>
                        </div>
                        <div
                          style={{ cursor: "pointer" }}
                          className="d-flex align-items-center me-3"
                        >
                          <i className="far fa-comment-dots me-2"></i>
                          <p className="mb-0">Comment</p>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
