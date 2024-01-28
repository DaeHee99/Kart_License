import { useState } from "react";
import { basicProfileImage } from "../../../../global/ProfileImages";

function LogRow({ updatedAt, user, content }) {
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
      </td>
      <td style={{ whiteSpace: "nowrap" }}>{content}</td>
    </tr>
  );
}

export default LogRow;
