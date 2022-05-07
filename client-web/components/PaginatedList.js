import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import Pagination from './Pagination'
import Loader from './Loader';



const shouldShowPagination = ({ items, itemsPerPage, hidePaginationForSinglePage }) => {
  let total;
  if(Array.isArray(items)) {
    total = items.length;
  } else {
    total = items.total;
  }
  return ((items && (total > itemsPerPage)) || !hidePaginationForSinglePage);
}

const shouldShowPaginationTop = ({ items, itemsPerPage, hidePaginationForSinglePage, showPaginationTop }) => {
  return (shouldShowPagination({ items, itemsPerPage, hidePaginationForSinglePage }) && showPaginationTop);
}

const shouldShowPaginationBottom = ({ items, itemsPerPage, hidePaginationForSinglePage, showPaginationBottom }) => {
  return (shouldShowPagination({ items, itemsPerPage, hidePaginationForSinglePage }) && showPaginationBottom);
}


const PaginatedList = props => {
  const [ pageNumber, setPageNumber ] = useState(false);
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
    history
  } = props;
  const ItemComponent = props.itemComponent;

  const dynamicProps = {};

  let renderItems = {};
  if(Array.isArray(items)) {
    renderItems = {
      data: items.slice(pageNumber * itemsPerPage, (pageNumber * itemsPerPage) + itemsPerPage),
      total: items.length
    };
  } else {
    renderItems = items;
  }
  return (
    <>
      {requestingItems && !items.data
        ? <Loader />
        : <>
          {shouldShowPaginationTop({ items, itemsPerPage, hidePaginationForSinglePage, showPaginationTop })
            ? <Pagination
                pageCount={renderItems.total ? Math.ceil(renderItems.total / itemsPerPage) : 0}
                forcePage={pageNumber}
                onPageChange={page => {
                  setPageNumber(page.selected)
                  if(props.requestItemsFunc) {
                    props.requestItemsFunc({
                      skip: (page.selected) * itemsPerPage,
                      limit: itemsPerPage
                    });
                  }
                }}
              />
            : <></>
          }
          <div style={{ marginBottom: '.6rem' }}>
            {renderItems.data && renderItems.data.map((item, index) => {
              dynamicProps[itemPropName] = item;
              return (
                <ItemComponent
                  className={ showLink ? 'list-item-link' : '' }
                  key={item._id || index}
                  onClick={() => {
                    if(itemNavRoute) {
                      history.push(`${itemNavRoute}/${item._id}`);
                    } else if(itemOnClick) {
                      itemOnClick(item);
                    }
                  }}
                  {...dynamicProps}
                  {...itemComponentCustomProps}
                />
              );
            })}
          </div>

          {shouldShowPaginationBottom({ items, itemsPerPage, hidePaginationForSinglePage, showPaginationBottom })
            ? <Pagination
                pageCount={renderItems.total ? Math.ceil(renderItems.total / itemsPerPage) : 0}
                forcePage={pageNumber}
                onPageChange={page => {
                  setPageNumber(page.selected)
                  if(props.requestItemsFunc) {
                    props.requestItemsFunc({
                      skip: (page.selected) * itemsPerPage,
                      limit: itemsPerPage
                    });
                  }
                }}
              />
            : <></>
          }
        </>
      }
    </>
  );
};

PaginatedList.propTypes = {
  icon: PropTypes.string,
  iconContainerClass: PropTypes.string,
  text: PropTypes.string,
  textContainerClass: PropTypes.string,
  style: PropTypes.object
};

export default PaginatedList;
