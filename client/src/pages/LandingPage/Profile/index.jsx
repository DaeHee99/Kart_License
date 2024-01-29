import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../_actions/user_action";
import {
  MDBCard,
  MDBCardTitle,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtn,
} from "mdb-react-ui-kit";

function Profile({ image, name, license, isAdmin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logoutUser()).then((response) => {
      if (response.payload.success) alert("로그아웃 완료");
      else alert("로그아웃 실패");
    });
  };

  return (
    <MDBContainer>
      <MDBCard style={{ maxWidth: "900px" }} className="shadow-5">
        <MDBRow className="g-0">
          <MDBCol
            col="8"
            className="col-lg-12 d-flex align-items-center justify-content-center"
          >
            <MDBCardImage src={image} alt="ProfileImage" fluid />
          </MDBCol>
          <MDBCol col="4">
            <MDBCardBody>
              <MDBCardTitle className="fw-bold">{name}</MDBCardTitle>
              <MDBCardText>
                <small className="text-muted">{license}</small>
                {isAdmin && (
                  <>
                    <br />
                    <small className="text-danger fw-bold">관리자</small>
                  </>
                )}
              </MDBCardText>
              <MDBRow className="g-2">
                <MDBBtn
                  rounded
                  className="col-12"
                  color="secondary"
                  onClick={() => navigate("/mypage")}
                >
                  내 정보
                </MDBBtn>
                <MDBBtn
                  rounded
                  className="col-12"
                  color="danger"
                  onClick={logoutHandler}
                >
                  로그아웃
                </MDBBtn>
              </MDBRow>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default Profile;
