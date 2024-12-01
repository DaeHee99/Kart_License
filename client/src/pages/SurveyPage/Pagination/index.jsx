import {
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

function Pagination({ page, lastPage }) {
  const navigation = useNavigate();
  const start = page - ((page % 5 || 5) - 1);

  const rendering = () => {
    const pages = [];
    for (let i = start; i < start + 5; i++) {
      if (i == lastPage + 1) break;
      pages.push(
        <MDBPaginationItem key={i} active={page === i}>
          <MDBPaginationLink
            onClick={() => navigation(`/survey?page=${i}`)}
            style={{ cursor: "pointer" }}
          >
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
          <MDBPaginationLink
            onClick={() => navigation(`/survey?page=${start - 1}`)}
            style={{ cursor: start == 1 ? "default" : "pointer" }}
          >
            이전
          </MDBPaginationLink>
        </MDBPaginationItem>
        {rendering()}
        <MDBPaginationItem disabled={lastPage - start < 5}>
          <MDBPaginationLink
            onClick={() => navigation(`/survey?page=${start + 5}`)}
            style={{ cursor: lastPage - start < 5 ? "default" : "pointer" }}
          >
            다음
          </MDBPaginationLink>
        </MDBPaginationItem>
      </MDBPagination>
    </nav>
  );
}

export default memo(Pagination);
