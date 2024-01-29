import {
  MDBCard,
  MDBCardTitle,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBadge,
} from "mdb-react-ui-kit";

function UserProfile({ lastRecord, userData }) {
  let lastRecordDate;
  if (lastRecord) lastRecordDate = new Date(lastRecord.createdAt);

  return (
    <MDBContainer>
      <MDBCard className="shadow-5 w-100">
        <MDBRow className="g-0">
          <MDBCol className="col-4 col-lg-3 d-flex align-items-center justify-content-center">
            <MDBCardImage src={userData.image} alt="ProfileImage" fluid />
          </MDBCol>
          <MDBCol className="col-8">
            <MDBCardBody>
              <MDBCardTitle className="fw-bold">{userData.name}</MDBCardTitle>
              <MDBCardText>
                <MDBBadge style={{ fontSize: 14 }} light>
                  {userData.license}
                </MDBBadge>
                {userData.isAdmin && (
                  <MDBBadge
                    style={{ fontSize: 14 }}
                    className="mx-2"
                    color="danger"
                    light
                  >
                    관리자
                  </MDBBadge>
                )}
              </MDBCardText>
              <MDBCardText>
                <small className="text-muted">
                  최근 측정 기록
                  <br />
                  {lastRecordDate === undefined ? (
                    <>측정 기록이 없습니다.</>
                  ) : (
                    <>
                      {lastRecordDate.getFullYear()}/
                      {("00" + (lastRecordDate.getMonth() + 1)).slice(-2)}/
                      {("00" + lastRecordDate.getDate()).slice(-2)}{" "}
                      {("00" + lastRecordDate.getHours()).slice(-2)}:
                      {("00" + lastRecordDate.getMinutes()).slice(-2)}:
                      {("00" + lastRecordDate.getSeconds()).slice(-2)} (S
                      {lastRecord.season})
                    </>
                  )}
                </small>
              </MDBCardText>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default UserProfile;
