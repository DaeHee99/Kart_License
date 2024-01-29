import { useNavigate } from "react-router-dom";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
  MDBContainer,
} from "mdb-react-ui-kit";
import introImage from "../../../assets/images/intro.png";

function Intro({ isAuth, content, setLoginCheckModal }) {
  const navigation = useNavigate();

  const startHandler = () => {
    if (!isAuth) setLoginCheckModal(true);
    else navigation("/test");
  };

  return (
    <MDBContainer>
      <MDBCard
        alignment="center"
        style={{ maxWidth: "1320px" }}
        className="shadow-5"
      >
        <MDBCardImage src={introImage} position="top" alt="Intro" />
        <MDBCardBody>
          <MDBCardTitle className="fw-bold">카러플 군 계산기</MDBCardTitle>
          {content !== "" ? (
            <MDBCardText style={{ whiteSpace: "pre-wrap" }}>
              {content}
            </MDBCardText>
          ) : (
            <MDBCardText>
              제보 및 피드백 항상 감사합니다!
              <br />
              지속해서 개선하도록 노력하겠습니다.
            </MDBCardText>
          )}
          <MDBBtn onClick={startHandler} className="w-75">
            시작하기
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Intro;
