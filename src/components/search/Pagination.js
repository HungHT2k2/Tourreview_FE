import React, { useState } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [currentPageState, setCurrentPageState] = useState(currentPage);

  const handlePageChange = (page) => {
    setCurrentPageState(page);
    onPageChange(page);
  };

  return (
    <div className="d-flex  align-items-center">
      <nav aria-label="Page navigation example inline">
        <ul className="pagination">
          <li
            style={{
              cursor: "pointer",
              pointerEvents: currentPageState === 1 && "none",
            }}
            className="page-item"
            onClick={() => handlePageChange(currentPageState - 1)}
          >
            <div className="page-link" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </div>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            return (
              <li
                key={page}
                style={{ cursor: "pointer" }}
                className={`page-item ${
                  page === currentPageState ? "active" : ""
                }`}
                onClick={() => {
                  handlePageChange(page);
                }}
              >
                <div className="page-link " href="#">
                  {page}
                </div>
              </li>
            );
          })}
          <li
            style={{
              cursor: "pointer",
              pointerEvents: currentPageState === totalPages && "none",
            }}
            className="page-item"
            onClick={() => handlePageChange(currentPageState + 1)}
          >
            <div className="page-link" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
