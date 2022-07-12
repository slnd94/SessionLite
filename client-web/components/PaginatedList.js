import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Pagination from "./Pagination";
import Loader from "./Loader";

const shouldShowPagination = ({
  items,
  itemsPerPage,
  hidePaginationForSinglePage,
}) => {
  let total;
  if (Array.isArray(items)) {
    total = items.length;
  } else {
    total = items.total;
  }
  return (items && total > itemsPerPage) || !hidePaginationForSinglePage;
};

const shouldShowPaginationTop = ({
  items,
  itemsPerPage,
  hidePaginationForSinglePage,
  showPaginationTop,
}) => {
  return (
    shouldShowPagination({
      items,
      itemsPerPage,
      hidePaginationForSinglePage,
    }) && showPaginationTop
  );
};

const shouldShowPaginationBottom = ({
  items,
  itemsPerPage,
  hidePaginationForSinglePage,
  showPaginationBottom,
}) => {
  return (
    shouldShowPagination({
      items,
      itemsPerPage,
      hidePaginationForSinglePage,
    }) && showPaginationBottom
  );
};

const PaginatedList = (props) => {
  const [pageNumber, setPageNumber] = useState(0);
  const router = useRouter();

  const {
    items,
    itemPropName,
    itemComponentCustomProps,
    itemsListedName,
    showLink,
    itemNavRoute,
    itemOnClick,
    requestingItems,
    showPaginationTop,
    showPaginationBottom,
    hidePaginationForSinglePage,
    itemsPerPage,
    forcePage,
    resetPaginationSignal,
    t,
  } = props;
  const ItemComponent = props.itemComponent;

  const dynamicProps = {};

  let renderItems = {};
  if (Array.isArray(items)) {
    renderItems = {
      data: items.slice(
        pageNumber * itemsPerPage,
        pageNumber * itemsPerPage + itemsPerPage
      ),
      total: items.length,
    };
  } else {
    renderItems = items;
  }

  useEffect(() => {
    if (Number.isInteger(forcePage)) {
      setPageNumber(forcePage);
      if (props.requestItemsFunc) {
        props.requestItemsFunc({
          skip: forcePage * itemsPerPage,
          limit: itemsPerPage,
        });
      }
    }
  }, [forcePage]);

  useEffect(() => {
    // reset to first page
    setPageNumber(0);
    if (props.requestItemsFunc) {
      props.requestItemsFunc({
        skip: 0,
        limit: itemsPerPage,
      });
    }
  }, [resetPaginationSignal]);

  return (
    <>
      {requestingItems && !items.data ? (
        <Loader />
      ) : (
        <>
          {shouldShowPaginationTop({
            items,
            itemsPerPage,
            hidePaginationForSinglePage,
            showPaginationTop,
          }) ? (
            <div className="pagination-container pagination-top">
              <span className="total-count">{`${renderItems.total} ${t(
                "total"
              )}`}</span>
              <Pagination
                pageCount={
                  renderItems.total
                    ? Math.ceil(renderItems.total / itemsPerPage)
                    : 0
                }
                forcePage={pageNumber}
                customContainerClass=""
                onPageChange={(page) => {
                  setPageNumber(page.selected);
                  if (props.requestItemsFunc) {
                    props.requestItemsFunc({
                      skip: page.selected * itemsPerPage,
                      limit: itemsPerPage,
                    });
                  }
                }}
              />
            </div>
          ) : (
            <></>
          )}
          <div style={{ marginBottom: ".6rem" }}>
            {renderItems.data &&
              renderItems.data.map((item, index) => {
                dynamicProps[itemPropName] = item;
                const RenderItemComponent = item.customListComponent
                  ? item.customListComponent
                  : ItemComponent;
                return (
                  <div key={index}>
                    <RenderItemComponent
                      className={showLink ? "list-item-link" : ""}
                      onClick={() => {
                        if (itemNavRoute) {
                          router.push({
                            pathname: `${itemNavRoute}/${item._id}`,
                          });
                        } else if (itemOnClick) {
                          itemOnClick(item);
                        }
                      }}
                      {...dynamicProps}
                      {...itemComponentCustomProps}
                    />
                  </div>
                );
              })}
          </div>

          {shouldShowPaginationBottom({
            items,
            itemsPerPage,
            hidePaginationForSinglePage,
            showPaginationBottom,
          }) ? (
            <div className="pagination-container pagination-bottom">
              <span className="total-count">{`${renderItems.total} ${t(
                "total"
              )}`}</span>
              <Pagination
                pageCount={
                  renderItems.total
                    ? Math.ceil(renderItems.total / itemsPerPage)
                    : 0
                }
                forcePage={pageNumber}
                customContainerClass=""
                onPageChange={(page) => {
                  setPageNumber(page.selected);
                  if (props.requestItemsFunc) {
                    props.requestItemsFunc({
                      skip: page.selected * itemsPerPage,
                      limit: itemsPerPage,
                    });
                  }
                }}
              />
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

PaginatedList.propTypes = {
  items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  itemComponent: PropTypes.func,
  itemComponentCustomProps: PropTypes.object,
  itemPropName: PropTypes.string,
  itemsListedName: PropTypes.string,
  requestItemsFunc: PropTypes.func,
  requestingItems: PropTypes.bool,
  itemsPerPage: PropTypes.number,
  itemOnClick: PropTypes.func,
  itemNavRoute: PropTypes.string,
  showLink: PropTypes.bool,
  showPaginationTop: PropTypes.bool,
  showPaginationBottom: PropTypes.bool,
  hidePaginationForSinglePage: PropTypes.bool,
  t: PropTypes.func,
  onRef: PropTypes.func,
};

PaginatedList.defaultProps = {
  items: {},
  showPaginationTop: false,
  showPaginationBottom: true,
  itemsPerPage: 5,
  itemComponentCustomProps: {},
  showLink: true,
  hidePaginationForSinglePage: true,
};

export default PaginatedList;
