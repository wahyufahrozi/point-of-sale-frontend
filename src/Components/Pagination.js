import React from "react";
import "../Style/pagination.css";

const PaginationPage = ({
  postsPerPage,
  totalPosts,
  paginate,
  currentPage
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  console.log("ini current page", currentPage);

  return (
    <ul className="pagination">
      {pageNumbers.map(number => (
        //   console.log("ini Number", number),
        <li key={number} active>
          <a
            onClick={() => paginate(number)}
            href="#!"
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default PaginationPage;
