import React, { useState, useEffect } from "react";
import "./style.scss";
import RecipeCard from "../card/RecipeCard";
import axios from "axios";
import { Link } from "react-router-dom";
import ChefCard from "../card/ChefCard";
import { useLocation } from "react-router-dom";
import Pagination from "./Pagination";

const Searching = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [country, setCountry] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [notFoundMessage, setNotFoundMessage] = useState("");
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [urlApi, setUrlApi] = useState("");
  const[size,setsize]=useState(0);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getRecipe(undefined, page);
  };

  const getRecipe = async (url, page) => {
    const res = await axios.get(url || urlApi, {
      params: { page, limit: 6 },
    });
    if (res?.data?.success) {
      setRecipes(res?.data?.data);
      setsize(res?.data?.size)
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleSearch = async () => {
    const params = {
      name,
      type,
      country,
    };

    try {
      const response = await axios.get("http://localhost:5000/recipe/search", {
        params,
      });
      setRecipes(response.data);

      if (response.data.length === 0) {
        setNotFoundMessage("Không tìm thấy món ăn.");
      } else {
        setNotFoundMessage("");
      }
    } catch (error) {
      console.log(error);
      setNotFoundMessage("Không tìm thấy món ăn .");
    }
  };
  useEffect(() => {
    if (new URLSearchParams(location.search).get("type") === "new") {
      setUrlApi("/recipe/recipe_new");
      getRecipe("/recipe/recipe_new", 1);
    } else {
      setUrlApi("/recipe/recipe_favorite");
      getRecipe("/recipe/recipe_favorite", 1);
    }
  }, []);

  const handleReset = () => {
    setName("");
    setType("");
    setCountry("");
    setRecipes([]);
    setNotFoundMessage("");
  };

  return (
    <div className="searching">
      <div className="s009">
        <div>
          <div className="inner-form">
            <div className="basic-search">
              <div className="input-field">
                <input
                  id="search"
                  type="text"
                  placeholder="Type Keywords"
                  value={name}
                  onChange={handleNameChange}
                />
                <div className="icon-wrap">
                  <svg
                    className="svg-inline--fa fa-search fa-w-16"
                    fill="#ccc"
                    aria-hidden="true"
                    data-prefix="fas"
                    data-icon="search"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="advance-search">
              <span className="desc">ADVANCED SEARCH</span>
              <div className="row">
                <div
                  style={{ marginBottom: "20px" }}
                  className="col-12 col-lg-6"
                >
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    Type
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                    value={type}
                    onChange={handleTypeChange}
                  />
                </div>
                <div
                  style={{ marginBottom: "20px" }}
                  className="col-12 col-lg-6"
                >
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    Country
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                    value={country}
                    onChange={handleCountryChange}
                  />
                </div>
                <div style={{ marginTop: "20px" }} className="row third w-100">
                  <div className="input-field w-100">
                    <div className="group-btn d-flex justify-content-end w-100">
                      <button className="btn-delete" onClick={handleReset}>
                        RESET
                      </button>
                      <button className="btn-search" onClick={handleSearch}>
                        SEARCH
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10">
            <div className="row w-100 search_container">
              {notFoundMessage && (
                <div className="not-found-message">
                  <h3>{notFoundMessage}</h3>
                </div>
              )}
              {recipes.map((recipe) => (
                <div
                  className="col-xl-4 col-lg-4 col-md-6 wow fadeInUp"
                  data-wow-delay="0.1s"
                  key={recipe._id}
                >
                  <Link style={{ textDecoration: "none" }} to={`/recipe/${recipe?._id}`}>
                    <RecipeCard
                      name={recipe.name}
                      image={recipe.tags.find((tag) => tag.k === "image").v}
                      owner={recipe.owner}
                      item={recipe}
                    />
                  </Link>
                </div>
              ))}

              <div
                style={{ marginTop: "30px" }}
                className="col-12 d-flex justify-content-center"
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(size / 6)}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searching;
