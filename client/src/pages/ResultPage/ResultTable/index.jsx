import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";

function ResultTable({ name, data }) {
  return (
    <MDBTable small className="text-center border border-dark">
      <MDBTableHead>
        <tr>
          <th scope="col" className="fw-bold">
            군
          </th>
          <th scope="col" className="fw-bold">
            {name}
          </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr style={{ backgroundColor: "rgba(255, 99, 132, 0.5)" }}>
          <th scope="row" className="fw-bold">
            강주력
          </th>
          <td className="fw-bold">{data[0]}</td>
        </tr>
        <tr style={{ backgroundColor: "rgba(255, 159, 64, 0.5)" }}>
          <th scope="row" className="fw-bold">
            주력
          </th>
          <td className="fw-bold">{data[1]}</td>
        </tr>
        <tr style={{ backgroundColor: "rgba(255, 205, 86, 0.5)" }}>
          <th scope="row" className="fw-bold">
            1군
          </th>
          <td className="fw-bold">{data[2]}</td>
        </tr>
        <tr style={{ backgroundColor: "rgba(75, 192, 192, 0.5)" }}>
          <th scope="row" className="fw-bold">
            2군
          </th>
          <td className="fw-bold">{data[3]}</td>
        </tr>
        <tr style={{ backgroundColor: "rgba(54, 162, 235, 0.5)" }}>
          <th scope="row" className="fw-bold">
            3군
          </th>
          <td className="fw-bold">{data[4]}</td>
        </tr>
        <tr style={{ backgroundColor: "rgba(153, 102, 255, 0.5)" }}>
          <th scope="row" className="fw-bold">
            4군
          </th>
          <td className="fw-bold">{data[5]}</td>
        </tr>
        <tr style={{ backgroundColor: "rgba(201, 203, 207, 0.5)" }}>
          <th scope="row" className="fw-bold">
            일반
          </th>
          <td className="fw-bold">{data[6]}</td>
        </tr>
        {data[7] > 0 && (
          <tr style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
            <th scope="row" className="fw-bold">
              선택 안함
            </th>
            <td className="fw-bold">{data[7]}</td>
          </tr>
        )}
      </MDBTableBody>
    </MDBTable>
  );
}

export default ResultTable;
