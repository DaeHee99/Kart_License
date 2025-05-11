import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
} from "mdb-react-ui-kit";

function NewVersionModal({ showModal, setModal }) {
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
              카러플 군 계산기가 업데이트 되었습니다.
              <br />
              새로운 버전으로 업데이트 합니다.
            </p>
            <div className="w-100 d-flex flex-column gap-1">
              <MDBBtn
                className="w-100"
                onClick={() => {
                  location.reload();
                }}
              >
                네
              </MDBBtn>
              <MDBBtn
                color="tertiary"
                className="w-100"
                onClick={() => {
                  setModal(false);
                }}
              >
                아니오
              </MDBBtn>
            </div>
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

export default NewVersionModal;
