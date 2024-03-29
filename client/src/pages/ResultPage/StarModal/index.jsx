import { useState } from "react";
import { useSelector } from "react-redux";
import { API } from "../../../_actions/types";
import axios from "axios";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBTextArea,
  MDBIcon,
} from "mdb-react-ui-kit";

function StarModal({ recordId, starOpen, setStarOpen }) {
  const userData = useSelector((state) => state.user.userData);
  const [star, setStar] = useState(1);
  const [text, setText] = useState("");

  const textHandler = (event) => setText(event.target.value);

  const submitHandler = () => {
    let body = {
      recordId: recordId,
      star: star,
      text: text,
    };
    if (userData.isAuth) body.user = userData._id;

    axios
      .post(API + "/star/save", body, { withCredentials: true })
      .then((response) => {
        if (!response.data.success) return alert("작성 실패, 서버 오류");
        alert("작성 완료!\n소중한 의견 감사합니다❤️");
        setStarOpen(false);
        setText("");
      });
  };

  return (
    <MDBModal
      staticBackdrop
      tabIndex="-1"
      show={starOpen}
      setShow={setStarOpen}
    >
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle className="fw-bold">후기 작성</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={() => setStarOpen(false)}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <div className="m-0">
              <div className="text-center mb-3 text-warning">
                <MDBIcon
                  far={star < 1}
                  fas={star >= 1}
                  onClick={() => setStar(1)}
                  icon="star"
                  size="2x"
                  style={{ cursor: "pointer" }}
                />
                <MDBIcon
                  far={star < 2}
                  fas={star >= 2}
                  onClick={() => setStar(2)}
                  icon="star"
                  size="2x"
                  style={{ cursor: "pointer" }}
                />
                <MDBIcon
                  far={star < 3}
                  fas={star >= 3}
                  onClick={() => setStar(3)}
                  icon="star"
                  size="2x"
                  style={{ cursor: "pointer" }}
                />
                <MDBIcon
                  far={star < 4}
                  fas={star >= 4}
                  onClick={() => setStar(4)}
                  icon="star"
                  size="2x"
                  style={{ cursor: "pointer" }}
                />
                <MDBIcon
                  far={star < 5}
                  fas={star >= 5}
                  onClick={() => setStar(5)}
                  icon="star"
                  size="2x"
                  style={{ cursor: "pointer" }}
                />
              </div>
              <MDBTextArea
                value={text}
                onChange={textHandler}
                label="후기"
                rows={4}
              />
            </div>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn
              color="secondary"
              className="fw-bold"
              onClick={() => setStarOpen(false)}
            >
              취소
            </MDBBtn>
            <MDBBtn className="fw-bold" onClick={submitHandler}>
              완료
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

export default StarModal;
