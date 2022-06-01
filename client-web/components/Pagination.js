import React from "react";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";

const Pagination = (props) => {
  const { pageCount, forcePage, onPageChange } = props;
  return (
    <>
      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        breakLabel={<span>...</span>}
        breakClassName={"break"}
        breakLinkClassName={"page-link"}
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={4}
        // initialPage={0}
        containerClassName={`pagination ${props.customContainerClass}`}
        subContainerClassName={"pages pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        activeClassName={"active"}
        disabledClassName={"disabled"}
        forcePage={forcePage}
        disableInitialCallback={true}
        onPageChange={(page) => {
          onPageChange(page);
        }}
      />
    </>
  );
};

Pagination.propTypes = {
  pageCount: PropTypes.number,
  forcePage: PropTypes.number,
  onPageChange: PropTypes.func,
  t: PropTypes.func,
};

export default Pagination;
