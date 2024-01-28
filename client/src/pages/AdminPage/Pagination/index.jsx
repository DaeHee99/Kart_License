import {
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";

function Pagination({ page, lastPage, tab }) {
  const start = page - ((page % 5 || 5) - 1);

  const rendering = () => {
    const pages = [];
    for (let i = start; i < start + 5; i++) {
      if (i == lastPage + 1) break;
      pages.push(
        <MDBPaginationItem key={i} active={page === i}>
          <MDBPaginationLink href={`/admin?tab=${tab}&page=${i}`}>
            {i}
          </MDBPaginationLink>
        </MDBPaginationItem>
      );
    }
    return pages;
  };

  return (
    <nav aria-label="page navigation">
      <MDBPagination center className="mb-0 mt-4">
        <MDBPaginationItem disabled={start == 1}>
          <MDBPaginationLink href={`/admin?tab=${tab}&page=${start - 1}`}>
            이전
          </MDBPaginationLink>
        </MDBPaginationItem>
        {rendering()}
        <MDBPaginationItem disabled={lastPage - start < 5}>
          <MDBPaginationLink href={`/admin?tab=${tab}&page=${start + 5}`}>
            다음
          </MDBPaginationLink>
        </MDBPaginationItem>
      </MDBPagination>
    </nav>
  );
}

export default Pagination;
