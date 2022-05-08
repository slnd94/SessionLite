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
  const [ pageNumber, setPageNumber ] = useState(0);
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
                customContainerClass="pagination-top"
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
              const ItemCustomComponent = item.customListComponent;
              return (
                <>
                  {ItemCustomComponent
                    ? <ItemCustomComponent
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
                    :  <ItemComponent
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
                  }
                </>
                
              );
            })}
          </div>

          {shouldShowPaginationBottom({ items, itemsPerPage, hidePaginationForSinglePage, showPaginationBottom })
            ? <Pagination
                pageCount={renderItems.total ? Math.ceil(renderItems.total / itemsPerPage) : 0}
                forcePage={pageNumber}
                customContainerClass="pagination-bottom"
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
  items: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
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
  history: PropTypes.object,
  t: PropTypes.func,
  onRef: PropTypes.func
};

PaginatedList.defaultProps = { 
  items: {},
  showPaginationTop: false,
  showPaginationBottom: true,
  itemsPerPage: 5,
  itemComponentCustomProps: {},
  showLink: true,
  hidePaginationForSinglePage: true
};

export default PaginatedList;
