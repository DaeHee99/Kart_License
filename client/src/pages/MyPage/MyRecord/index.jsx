import { MDBContainer, MDBCard, MDBCardBody, MDBIcon } from "mdb-react-ui-kit";
import RecordCard from "./RecordCard";

function MyRecord({ recordList }) {
  return (
    <MDBContainer className="text-center">
      <MDBCard className="shadow-5 w-100 mb-3">
        <MDBCardBody>
          <b>
            <MDBIcon fas icon="info-circle" /> 각 기록을 누르면 해당 결과
            페이지로 이동합니다.
          </b>
        </MDBCardBody>
      </MDBCard>
      <hr />
      {recordList
        .slice(0)
        .reverse()
        .map((item) => {
          return <RecordCard key={item._id} {...item} />;
        })}
    </MDBContainer>
  );
}

export default MyRecord;
