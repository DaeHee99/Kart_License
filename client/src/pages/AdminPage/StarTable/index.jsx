import { useEffect, useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { API } from "../../../_actions/types";
import axios from "axios";
import Loading from "../../../components/Loading";
import StarRow from "./StarRow";

function StarTable({ tab, page, setDataAllCount, setViewPageNavigation }) {
  const [starData, setStarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tab === "star") {
      axios
        .get(API + "/star/manager/" + page, { withCredentials: true })
        .then((response) => {
          if (!response.data.success) return alert("서버 오류");
          setStarData(response.data.starList);
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
          <th scope="col" className="fw-bold w-25">
            유저
          </th>
          <th scope="col" className="fw-bold w-25">
            시간
          </th>
          <th scope="col" className="fw-bold w-50">
            내용
          </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {starData.map((item) => (
          <StarRow key={item._id} {...item} />
        ))}
      </MDBTableBody>
    </MDBTable>
  );
}

export default StarTable;
