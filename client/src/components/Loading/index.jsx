import { MDBSpinner } from "mdb-react-ui-kit";

function Loading() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "85vh" }}
    >
      <MDBSpinner color="primary" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </MDBSpinner>
    </div>
  );
}

export default Loading;
