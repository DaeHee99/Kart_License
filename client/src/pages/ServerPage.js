import React, { useState } from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
} from "mdb-react-ui-kit";
import Logo from "../images/logo.png";

function ServerPage() {
  const [showModal, setModal] = useState(true);

  return (
    <MDBContainer className="d-flex justify-content-center">
      <MDBModal
        staticBackdrop
        show={showModal}
        setShow={setModal}
        tabIndex="-1"
      >
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle className="fw-bold">공지사항</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody>
              <p className="text-center" style={{ whiteSpace: "pre-wrap" }}>
                [서버 점검 진행 중]
                <br />
                1월 30일 화요일 오전 0시 ~ 4시
                <br />
                현재 군 계산기 서버 점검이 진행되고 있습니다.
                <br />
                서버 점검이 진행되는 동안 서비스를 이용할 수 없습니다.
                <br />
                서비스 이용에 참고 부탁드립니다. 감사합니다.
              </p>
              <img src={Logo} alt="Logo" className="w-100 rounded-4" />
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </MDBContainer>
  );
}

export default ServerPage;
