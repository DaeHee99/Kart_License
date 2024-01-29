import { MDBTableHead, MDBTableBody, MDBBadge, MDBBtn } from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { basicProfileImage } from "../../../../global/ProfileImages";

function RecordRow({ _id, license, user, recordCount }) {
  const navigation = useNavigate();
  const [licenseColor, setLicenseColor] = useState("success");

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
        <table className="table mb-0">
          <MDBTableHead>
            <tr>
              <th
                scope="col"
                className="fw-bold"
                style={{ backgroundColor: "rgba(255, 99, 132, 0.5)" }}
              >
                강
              </th>
              <th
                scope="col"
                className="fw-bold"
                style={{ backgroundColor: "rgba(255, 159, 64, 0.5)" }}
              >
                주
              </th>
              <th
                scope="col"
                className="fw-bold"
                style={{ backgroundColor: "rgba(255, 205, 86, 0.5)" }}
              >
                1
              </th>
              <th
                scope="col"
                className="fw-bold"
                style={{ backgroundColor: "rgba(75, 192, 192, 0.5)" }}
              >
                2
              </th>
              <th
                scope="col"
                className="fw-bold"
                style={{ backgroundColor: "rgba(54, 162, 235, 0.5)" }}
              >
                3
              </th>
              <th
                scope="col"
                className="fw-bold"
                style={{ backgroundColor: "rgba(153, 102, 255, 0.5)" }}
              >
                4
              </th>
              <th
                scope="col"
                className="fw-bold"
                style={{ backgroundColor: "rgba(201, 203, 207, 0.5)" }}
              >
                일
              </th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            <tr>
              <th
                scope="row"
                style={{ backgroundColor: "rgba(255, 99, 132, 0.5)" }}
              >
                {recordCount[0]}
              </th>
              <th
                scope="row"
                style={{ backgroundColor: "rgba(255, 159, 64, 0.5)" }}
              >
                {recordCount[1]}
              </th>
              <th
                scope="row"
                style={{ backgroundColor: "rgba(255, 205, 86, 0.5)" }}
              >
                {recordCount[2]}
              </th>
              <th
                scope="row"
                style={{ backgroundColor: "rgba(75, 192, 192, 0.5)" }}
              >
                {recordCount[3]}
              </th>
              <th
                scope="row"
                style={{ backgroundColor: "rgba(54, 162, 235, 0.5)" }}
              >
                {recordCount[4]}
              </th>
              <th
                scope="row"
                style={{ backgroundColor: "rgba(153, 102, 255, 0.5)" }}
              >
                {recordCount[5]}
              </th>
              <th
                scope="row"
                style={{ backgroundColor: "rgba(201, 203, 207, 0.5)" }}
              >
                {recordCount[6]}
              </th>
            </tr>
          </MDBTableBody>
        </table>
      </td>
      <td>
        <MDBBadge color={licenseColor} pill className="fs-6">
          {license}
        </MDBBadge>
      </td>
      <td>
        <MDBBtn
          color="link"
          rounded
          size="lg"
          style={{ whiteSpace: "nowrap" }}
          className="fw-bold"
          onClick={() => navigation(`/result/${_id}`)}
        >
          결과
        </MDBBtn>
      </td>
    </tr>
  );
}

export default RecordRow;
