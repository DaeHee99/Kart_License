import { useState } from "react";
import { MDBIcon, MDBBtn } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { basicProfileImage } from "../../../../global/ProfileImages";

function StarRow({ updatedAt, user, recordId, star, text }) {
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
          style={{ whiteSpace: "nowrap" }}
        >
          <MDBIcon far={star < 1} fas={star >= 1} icon="star" size="lg" />
          <MDBIcon far={star < 2} fas={star >= 2} icon="star" size="lg" />
          <MDBIcon far={star < 3} fas={star >= 3} icon="star" size="lg" />
          <MDBIcon far={star < 4} fas={star >= 4} icon="star" size="lg" />
          <MDBIcon far={star < 5} fas={star >= 5} icon="star" size="lg" />
        </div>
        {text}
      </td>
    </tr>
  );
}

export default StarRow;
