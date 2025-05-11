import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
} from "mdb-react-ui-kit";

function ServerErrorModal({ showModal, setModal }) {
  return (
    <MDBModal
      animationDirection="bottom"
      show={showModal}
      tabIndex="-1"
      setShow={setModal}
      staticBackdrop
    >
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalBody className="p-3 d-flex flex-column align-items-center gap-1">
            <p className="fw-bold text-center">
              카러플 군 계산기 서버와 연결이 끊어졌습니다.
              <br />
              잠시 후 다시 이용해주세요.
            </p>
            <div className="w-100">
              <MDBBtn
                color="danger"
                className="w-100"
                onClick={() => {
                  setModal(false);
                }}
              >
                닫기
              </MDBBtn>
            </div>
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

export default ServerErrorModal;
