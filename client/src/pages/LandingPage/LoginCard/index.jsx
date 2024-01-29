import { useNavigate } from "react-router-dom";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardLink,
  MDBContainer,
} from "mdb-react-ui-kit";

function LoginCard() {
  const navigation = useNavigate();

  return (
    <MDBContainer>
      <MDBCard style={{ maxWidth: "900px" }} className="shadow-5">
        <MDBCardBody>
          <MDBCardTitle className="fw-bold">로그인</MDBCardTitle>
          <MDBCardText>
            로그인을 하면 더 다양한 기능을
            <br />
            이용할 수 있습니다.
            <br />
            <br />내 기록을 저장하고 쉽게 관리하세요!
          </MDBCardText>
          <MDBCardLink
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigation("/login")}
          >
            로그인 하기
          </MDBCardLink>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default LoginCard;
