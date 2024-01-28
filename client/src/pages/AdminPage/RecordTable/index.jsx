import { useEffect, useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { API } from "../../../_actions/types";
import axios from "axios";
import Loading from "../../../components/Loading";
import RecordRow from "./RecordRow";

function RecordTable({ tab, page, setDataAllCount, setViewPageNavigation }) {
  const [recordData, setRecordData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tab === "record") {
      axios
        .get(API + "/record/manager/" + page, { withCredentials: true })
        .then((response) => {
          if (!response.data.success) return alert("서버 오류");
          setRecordData(response.data.recordList);
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
            기록
          </th>
          <th scope="col" className="fw-bold">
            결과
          </th>
          <th scope="col" className="fw-bold">
            상세 결과
          </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {recordData.map((item) => (
          <RecordRow key={item._id} {...item} />
        ))}
      </MDBTableBody>
    </MDBTable>
  );
}

export default RecordTable;
