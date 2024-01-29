import { useLocation, useNavigate } from "react-router-dom";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
} from "mdb-react-ui-kit";

function NoRecordCard() {
  const navigation = useNavigate();
  const location = useLocation();

  return (
    <MDBCard alignment="center" className="mt-3">
      <MDBCardBody>
        <MDBCardTitle className="fw-bold">측정 기록 없음</MDBCardTitle>
        <MDBCardText>
          측정 기록이 없습니다.
          <br />
          지금 바로 첫 군 계산을 해보세요~
        </MDBCardText>
        {location.pathname === "/mypage" && (
          <MDBBtn className="fw-bold" onClick={() => navigation("/test")}>
            시작하기
          </MDBBtn>
        )}
      </MDBCardBody>
    </MDBCard>
  );
}

export default NoRecordCard;
