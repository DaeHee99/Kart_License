import { useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
} from "mdb-react-ui-kit";

function LoginCheckModal({ showModal, setModal }) {
  const navigation = useNavigate();

  return (
    <MDBModal
      animationDirection="bottom"
      show={showModal}
      tabIndex="-1"
      setShow={setModal}
    >
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalBody className="p-3 d-flex flex-column align-items-center gap-1">
            <p className="fw-bold">
              [비로그인 상태] 로그인 없이 그냥 진행할까요?
            </p>
            <div className="w-100 d-flex gap-2">
              <MDBBtn
                color="success"
                className="w-100"
                onClick={() => {
                  navigation("/test");
                }}
              >
                바로 시작
              </MDBBtn>
              <MDBBtn
                className="w-100"
                onClick={() => {
                  navigation("/login");
                }}
              >
                로그인
              </MDBBtn>
            </div>
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

export default LoginCheckModal;
