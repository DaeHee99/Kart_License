import React from "react";
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
import introImage from "../../images/intro.png";

export default function Intro(props) {
  const navigation = useNavigate();

  const start = () => {
    if (!props.isAuth) props.setLoginCheckModal(true);
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
          <MDBCardTitle>
            <b>카러플 군 계산기</b>
          </MDBCardTitle>
          {props.content !== "" ? (
            <MDBCardText style={{ whiteSpace: "pre-wrap" }}>
              {props.content}
            </MDBCardText>
          ) : (
            <MDBCardText>
              제보 및 피드백 항상 감사합니다!
              <br />
              지속해서 개선하도록 노력하겠습니다.
            </MDBCardText>
          )}
          {/* <MDBBtn color='secondary' onClick={()=>window.location.assign('https://open.kakao.com/o/gK80B2tc')}>친선 매칭방</MDBBtn> */}
          <MDBBtn onClick={start} className="w-75">
            시작하기
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}
