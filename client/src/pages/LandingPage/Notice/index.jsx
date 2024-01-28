import { useEffect, useState } from "react";
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
import Logo from "../../../assets/images/logo.png";

function Notice({ content, showModal, setModal }) {
  const [noticeCheck, setNoticeCheck] = useState(false);

  useEffect(() => {
    localStorage.setItem("noticeCheck", noticeCheck);
  }, [noticeCheck]);

  return (
    <MDBModal staticBackdrop show={showModal} setShow={setModal} tabIndex="-1">
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle className="fw-bold">공지사항</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={() => setModal(false)}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <p className="text-center" style={{ whiteSpace: "pre-wrap" }}>
              {content}
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
              onClick={() => setModal(false)}
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

export default Notice;
