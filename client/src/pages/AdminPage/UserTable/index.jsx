import { useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { API } from "../../../_actions/types";
import axios from "axios";
import Loading from "../../../components/Loading";
import UserRow from "./UserRow";

const UserTable = forwardRef((props, ref) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  const userSearch = (userSearchName) => {
    if (userSearchName === "") return alert("검색어를 입력해주세요.");
    else {
      setLoading(true);
      axios
        .get(API + "/user/manager/find/" + userSearchName, {
          withCredentials: true,
        })
        .then((response) => {
          if (!response.data.success) return alert("서버 오류");
          setUserData(response.data.userList);
          props.setDataAllCount(response.data.count);
          props.setViewPageNavigation(false);
          setLoading(false);
        });
    }
  };

  useImperativeHandle(ref, () => ({ userSearch }));

  useEffect(() => {
    if (props.tab === "user") {
      axios
        .get(API + "/user/manager/" + props.page, { withCredentials: true })
        .then((response) => {
          if (!response.data.success) return alert("서버 오류");
          setUserData(response.data.userList);
          props.setDataAllCount(response.data.count);
          props.setViewPageNavigation(true);
          setLoading(false);
        });
    }
  }, [props.tab, props.page]);

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
            군
          </th>
          <th scope="col" className="fw-bold">
            최근 접속
          </th>
          <th scope="col" className="fw-bold">
            유저 정보
          </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {userData.map((item) => (
          <UserRow key={item._id} {...item} />
        ))}
      </MDBTableBody>
    </MDBTable>
  );
});

export default UserTable;
