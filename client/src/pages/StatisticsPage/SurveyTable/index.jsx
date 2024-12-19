import { memo, useMemo } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";

function SurveyTable({ title, data, type }) {
  const color = useMemo(
    () =>
      type === "survey"
        ? [
            "rgba(153, 102, 255, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(201, 203, 207, 0.5)",
            "rgba(255, 159, 64, 0.5)",
            "rgba(255, 99, 132, 0.5)",
          ]
        : [
            "rgba(255, 99, 132, 0.5)",
            "rgba(255, 159, 64, 0.5)",
            "rgba(255, 205, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(201, 203, 207, 0.5)",
            "rgba(0, 0, 0, 0.3)",
          ],
    []
  );

  return (
    <MDBTable small className="text-center border border-dark">
      <MDBTableHead>
        <tr>
          <th scope="col" className="fw-bold" colSpan="2">
            {title}
          </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {data.map((item, index) => (
          <tr style={{ backgroundColor: color[index] }} key={item.name}>
            <th scope="row" className="fw-bold w-50">
              {item.name}
            </th>
            <td className="fw-bold w-50">{item.count}</td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
}

export default memo(SurveyTable);
