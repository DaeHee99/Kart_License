import { useState } from "react";
import { MDBIcon, MDBBtn, MDBBadge } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { basicProfileImage } from "../../../../global/ProfileImages";

function SurveyRow({
  updatedAt,
  user,
  recordId,
  season,
  license,
  level,
  balance,
  review,
}) {
  const navigation = useNavigate();
  const [date] = useState(new Date(updatedAt));

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          <img
            src={user?.image || basicProfileImage}
            alt="profileImage"
            style={{ width: "45px", height: "45px" }}
          />
          <div className="ms-3" style={{ whiteSpace: "nowrap" }}>
            <p className="fw-bold mb-1">{user?.name || "비로그인 유저"}</p>
          </div>
        </div>
      </td>
      <td>
        {date.getFullYear()}/{("00" + (date.getMonth() + 1)).slice(-2)}/
        {("00" + date.getDate()).slice(-2)} {("00" + date.getHours()).slice(-2)}
        :{("00" + date.getMinutes()).slice(-2)}:
        {("00" + date.getSeconds()).slice(-2)}
        <br />
        <MDBBtn
          color="link"
          rounded
          size="lg"
          style={{ whiteSpace: "nowrap" }}
          className="fw-bold"
          onClick={() => navigation(`/result/${recordId}`)}
        >
          결과 페이지
        </MDBBtn>
      </td>
      <td style={{ wordBreak: "break-all" }}>
        <div
          className="text-center mb-3 text-warning"
          style={{
            whiteSpace: "nowrap",
            display: "flex",
            gap: 3,
            justifyContent: "center",
          }}
        >
          <MDBBadge color="secondary" light>
            S{season}
          </MDBBadge>
          <MDBBadge>{license}</MDBBadge>
          <MDBBadge color="success" light>{`난이도 ${
            ["매우 쉬움", "쉬움", "보통", "어려움", "매우 어려움"][level - 1]
          }`}</MDBBadge>
          <MDBBadge color="info" light>{`밸런스 ${
            ["매우 좋음", "좋음", "보통", "나쁨", "매우 나쁨"][balance - 1]
          }`}</MDBBadge>
        </div>
        {review || "-"}
      </td>
    </tr>
  );
}

export default SurveyRow;
