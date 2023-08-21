import React from 'react';
import ReactPaginate from 'react-paginate';

import styles from './Pagination.module.scss';
import classNames from 'classnames';

export const Pagination = ({ page, pageCount, handlePageClick }) => {
  return (
    <>
      <ReactPaginate
        className={styles.pagination}
        pageClassName={styles.pagination__page}
        previousClassName={classNames(
          styles.pagination__button,
          styles.pagination__button_previous,
        )}
        nextClassName={classNames(styles.pagination__button, styles.pagination__button_next)}
        disabledClassName={styles.pagination__page_disabled}
        activeClassName={styles.pagination__page_active}
        breakLabel='...'
        nextLabel='>'
        onPageChange={(event) => handlePageClick(event.selected + 1)}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        forcePage={page - 1}
        previousLabel='<'
        renderOnZeroPageCount={null}
      />
    </>
  );
};

export default Pagination;
