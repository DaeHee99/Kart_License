import React from 'react';
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';

export default function Pagination(props) {
  const start = props.page - (((props.page % 5) || 5) - 1);

  const rendering = () => {
    const pages = [];
    for (let i = start; i < start + 5; i++) {
      if(i == props.lastPage + 1) break;
      pages.push(
      <MDBPaginationItem key={i} active={props.page === i}>
        <MDBPaginationLink href={`/manager?tab=${props.tab}&page=${i}`}>{i}</MDBPaginationLink>
      </MDBPaginationItem>
      );
    }
    return pages;
  };

  return (
    <nav aria-label='page navigation'>
      <MDBPagination center className='mb-0 mt-4'>
        <MDBPaginationItem disabled={start == 1}>
          <MDBPaginationLink href={`/manager?tab=${props.tab}&page=${start-1}`}>이전</MDBPaginationLink>
        </MDBPaginationItem>
          {rendering()}
        <MDBPaginationItem disabled={props.lastPage - start < 5}>
          <MDBPaginationLink href={`/manager?tab=${props.tab}&page=${start+5}`}>다음</MDBPaginationLink>
        </MDBPaginationItem>
      </MDBPagination>
    </nav>
  );
}