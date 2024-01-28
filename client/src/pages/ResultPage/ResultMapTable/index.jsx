import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBIcon,
} from "mdb-react-ui-kit";

function ResultMapTable({ mapCount, record }) {
  const mapColor = (n) => {
    if (n < mapCount.Rookie) return "rgba(255, 205, 86, 0.5)";
    if (n < mapCount.Rookie + mapCount.L3) return "rgba(142, 255, 61, 0.5)";
    if (n < mapCount.Rookie + mapCount.L3 + mapCount.L2)
      return "rgba(54, 162, 235, 0.4)";
    return "rgba(255, 159, 64, 0.6)";
  };

  return (
    <MDBTable
      small
      align="middle"
      responsive
      className="text-center border border-dark"
    >
      <MDBTableHead>
        <tr>
          <th className="p-0" scope="col" style={{ width: "65%" }}>
            <b>맵 이름</b>
          </th>
          <th
            className="p-0"
            scope="col"
            style={{ width: "5%", backgroundColor: "rgba(255, 99, 132, 0.5)" }}
          >
            <b>강</b>
          </th>
          <th
            className="p-0"
            scope="col"
            style={{ width: "5%", backgroundColor: "rgba(255, 159, 64, 0.5)" }}
          >
            <b>주</b>
          </th>
          <th
            className="p-0"
            scope="col"
            style={{ width: "5%", backgroundColor: "rgba(255, 205, 86, 0.5)" }}
          >
            <b>1</b>
          </th>
          <th
            className="p-0"
            scope="col"
            style={{ width: "5%", backgroundColor: "rgba(75, 192, 192, 0.5)" }}
          >
            <b>2</b>
          </th>
          <th
            className="p-0"
            scope="col"
            style={{ width: "5%", backgroundColor: "rgba(54, 162, 235, 0.5)" }}
          >
            <b>3</b>
          </th>
          <th
            className="p-0"
            scope="col"
            style={{ width: "5%", backgroundColor: "rgba(153, 102, 255, 0.5)" }}
          >
            <b>4</b>
          </th>
          <th
            className="p-0"
            scope="col"
            style={{ width: "5%", backgroundColor: "rgba(201, 203, 207, 0.5)" }}
          >
            <b>일</b>
          </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {record.map((item, index) => (
          <tr key={index}>
            <td className="p-0" style={{ backgroundColor: mapColor(index) }}>
              <b>{item.mapName}</b>
            </td>
            <td
              className="p-0"
              style={{ backgroundColor: "rgba(255, 99, 132, 0.5)" }}
            >
              {item.select === 0 && <MDBIcon fas icon="check" />}
            </td>
            <td
              className="p-0"
              style={{ backgroundColor: "rgba(255, 159, 64, 0.5)" }}
            >
              {item.select === 1 && <MDBIcon fas icon="check" />}
            </td>
            <td
              className="p-0"
              style={{ backgroundColor: "rgba(255, 205, 86, 0.5)" }}
            >
              {item.select === 2 && <MDBIcon fas icon="check" />}
            </td>
            <td
              className="p-0"
              style={{ backgroundColor: "rgba(75, 192, 192, 0.5)" }}
            >
              {item.select === 3 && <MDBIcon fas icon="check" />}
            </td>
            <td
              className="p-0"
              style={{ backgroundColor: "rgba(54, 162, 235, 0.5)" }}
            >
              {item.select === 4 && <MDBIcon fas icon="check" />}
            </td>
            <td
              className="p-0"
              style={{ backgroundColor: "rgba(153, 102, 255, 0.5)" }}
            >
              {item.select === 5 && <MDBIcon fas icon="check" />}
            </td>
            <td
              className="p-0"
              style={{ backgroundColor: "rgba(201, 203, 207, 0.5)" }}
            >
              {item.select === 6 && <MDBIcon fas icon="check" />}
            </td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
}

export default ResultMapTable;
