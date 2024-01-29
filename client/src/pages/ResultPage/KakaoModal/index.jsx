import { useSelector } from "react-redux";
import { API } from "../../../_actions/types";
import { basicProfileImage } from "../../../global/ProfileImages";
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
} from "mdb-react-ui-kit";

function KakaoModal({ recordId, shareOpen, setShareOpen }) {
  const Kakao = window.Kakao;
  const userData = useSelector((state) => state.user.userData);

  if (!Kakao.isInitialized()) {
    Kakao.init("b8190aef6784cd429762070f590774bb");
  }

  const kakaoShare = () => {
    Kakao.Share.sendCustom({
      templateId: 90173,
      templateArgs: {
        RecordId: recordId,
        Name: userData.isAuth ? userData.name : "비로그인 유저",
        Description: userData.isAuth
          ? `${userData.name}님이 카러플 군 계산기 결과를 공유했습니다!`
          : "츄르 클럽에서 제작한 카러플 군 계산기 결과를 공유했습니다!",
        ProfileImage: userData.isAuth ? userData.image : basicProfileImage,
        UserId: userData.isAuth ? userData._id : "0",
      },
    });

    const body = { content: `카카오톡 공유 완료` };
    if (userData.isAuth) body.user = userData._id;

    axios.post(API + "/log/save", body, { withCredentials: true });

    setShareOpen(false);
  };

  return (
    <MDBModal
      staticBackdrop
      tabIndex="-1"
      show={shareOpen}
      setShow={setShareOpen}
    >
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle className="fw-bold">카카오톡 공유하기</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={() => setShareOpen(false)}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <p className="text-center m-0 fw-bold">
              이 결과를 카카오톡으로 공유하시겠습니까?
              <img
                width={"100%"}
                src="https://play-lh.googleusercontent.com/8_0SDfkFXAFm12A7XEqkyChCdGC055J6fC8JR7qynNuO3qNOczIoNHo4U4lad8xYMJOL"
                alt="kakao"
                className="rounded-3 mt-2"
              />
            </p>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn
              color="secondary"
              className="fw-bold"
              onClick={() => setShareOpen(false)}
            >
              취소
            </MDBBtn>
            <MDBBtn onClick={kakaoShare} className="fw-bold">
              공유하기
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

export default KakaoModal;
