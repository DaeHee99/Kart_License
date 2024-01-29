import { MDBContainer, MDBCard, MDBCardBody, MDBIcon } from "mdb-react-ui-kit";
import RecordCard from "./RecordCard";
import NoRecordCard from "./NoRecordCard";

function MyRecord({ recordList }) {
  return (
    <MDBContainer className="text-center min-vh-100">
      <MDBCard className="shadow-5 w-100 mb-3">
        <MDBCardBody className="fw-bold">
          <MDBIcon fas icon="info-circle" /> 각 기록을 누르면 해당 결과 페이지로
          이동합니다.
        </MDBCardBody>
      </MDBCard>
      <hr />
      {recordList
        .slice(0)
        .reverse()
        .map((item) => {
          return <RecordCard key={item._id} {...item} />;
        })}
      {recordList.length === 0 && <NoRecordCard />}
    </MDBContainer>
  );
}

export default MyRecord;
