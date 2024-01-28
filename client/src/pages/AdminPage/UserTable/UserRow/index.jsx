import { MDBBadge, MDBBtn } from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserRow({ _id, image, name, updatedAt, license }) {
  const navigation = useNavigate();
  const [licenseColor, setLicenseColor] = useState("dark");
  const [date] = useState(new Date(updatedAt));

  useEffect(() => {
    if (license === "강주력") setLicenseColor("danger");
    else if (license === "주력") setLicenseColor("warning");
    else if (license === "1군") setLicenseColor("warning");
    else if (license === "2군") setLicenseColor("success");
    else if (license === "3군") setLicenseColor("info");
    else if (license === "4군") setLicenseColor("primary");
    else if (license === "일반") setLicenseColor("secondary");
  }, [license]);

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          <img
            src={image}
            alt="profileImage"
            style={{ width: "45px", height: "45px" }}
          />
          <div className="ms-3" style={{ whiteSpace: "nowrap" }}>
            <p className="fw-bold mb-1">{name}</p>
          </div>
        </div>
      </td>
      <td>
        <MDBBadge color={licenseColor} pill className="fs-6">
          {license !== "" ? license : "기록 없음"}
        </MDBBadge>
      </td>
      <td>
        {date.getFullYear()}/{("00" + (date.getMonth() + 1)).slice(-2)}/
        {("00" + date.getDate()).slice(-2)} {("00" + date.getHours()).slice(-2)}
        :{("00" + date.getMinutes()).slice(-2)}:
        {("00" + date.getSeconds()).slice(-2)}
      </td>
      <td>
        <MDBBtn
          color="link"
          rounded
          size="lg"
          style={{ whiteSpace: "nowrap" }}
          onClick={() => navigation(`/userpage/${_id}`)}
        >
          <b>정보</b>
        </MDBBtn>
      </td>
    </tr>
  );
}

export default UserRow;
