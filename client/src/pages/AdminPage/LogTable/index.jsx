import { useEffect, useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { API } from "../../../_actions/types";
import Loading from "../../../components/Loading";
import axios from "axios";
import LogRow from "./LogRow";

function LogTable({ tab, page, setDataAllCount, setViewPageNavigation }) {
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tab === "log") {
      axios
        .get(API + "/log/manager/" + page, { withCredentials: true })
        .then((response) => {
          if (!response.data.success) return alert("서버 오류");
          setLogData(response.data.logList);
          setDataAllCount(response.data.count);
          setViewPageNavigation(true);
          setLoading(false);
        });
    }
  }, [tab, page]);

  return loading ? (
    <Loading />
  ) : (
    <MDBTable align="middle" responsive className="text-center">
      <MDBTableHead>
        <tr>
          <th scope="col" className="fw-bold">
            유저
          </th>
          <th scope="col" className="fw-bold">
            시간
          </th>
          <th scope="col" className="fw-bold">
            내용
          </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {logData.map((item) => (
          <LogRow key={item._id} {...item} />
        ))}
      </MDBTableBody>
    </MDBTable>
  );
}

export default LogTable;
