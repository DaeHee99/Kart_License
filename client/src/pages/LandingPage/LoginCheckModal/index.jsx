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
          <MDBModalBody className="py-1">
            <div className="d-flex justify-content-around align-items-center my-3">
              <p className="mb-0">
                비로그인 상태입니다.
                <br />
                로그인 없이 그냥 진행할까요?
              </p>
              <MDBBtn
                color="success"
                size="sm"
                className="ms-2 text-nowrap"
                onClick={() => {
                  navigation("/test");
                }}
              >
                그냥 시작
              </MDBBtn>
              <MDBBtn
                size="sm"
                className="ms-2 text-nowrap"
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
