import { useEffect } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
} from "mdb-react-ui-kit";

function ShareToast({ num, showToast, setShowToast }) {
  useEffect(() => {
    if (!showToast) return;
    navigator.clipboard.writeText(
      `https://kartrush.mylicense.kro.kr/test?track=${num}`
    );
  }, [showToast]);

  return (
    <MDBModal
      animationDirection="bottom"
      show={showToast}
      tabIndex="-1"
      setShow={setShowToast}
    >
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalBody className="p-3 d-flex flex-column align-items-center gap-1">
            <p className="fw-bold">현재 트랙 링크가 복사되었습니다.</p>
            <MDBBtn className="w-100" onClick={() => setShowToast(false)}>
              확인
            </MDBBtn>
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

export default ShareToast;
