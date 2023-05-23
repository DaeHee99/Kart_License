import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import Logo from "../../images/logo.png";

export default function Notice(props) {
  const [noticeCheck, setNoticeCheck] = useState(false);

  useEffect(() => {
    localStorage.setItem("noticeCheck", noticeCheck);
  }, [noticeCheck]);

  return (
    <MDBModal
      staticBackdrop
      show={props.showModal}
      setShow={props.setModal}
      tabIndex="-1"
    >
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle className="fw-bold">공지사항</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={() => props.setModal(false)}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <p className="text-center" style={{ whiteSpace: "pre-wrap" }}>
              {props.content}
            </p>
            <MDBCheckbox
              wrapperClass="d-flex justify-content-center mb-4"
              id="Notice_Check"
              label="이 공지 팝업 다시 안보기"
              value={noticeCheck}
              onChange={() => setNoticeCheck(!noticeCheck)}
            />
            <img src={Logo} alt="Logo" className="w-100 rounded-4" />
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn
              color="secondary"
              onClick={() => props.setModal(false)}
              className="fw-bold w-100"
            >
              닫기
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
