import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBContainer,
} from "mdb-react-ui-kit";
import { API } from "../../_actions/types";
import axios from "axios";
import Loading from "../../components/Loading";
import MyRecord from "../MyPage/MyRecord";
import Main from "./Main";

function UserPage() {
  const { id } = useParams();
  const [tab, setTab] = useState("UserInformation");
  const [loading, setLoading] = useState(true);
  const [recordList, setRecordList] = useState([]);
  const [userData, setUserData] = useState([]);
  const navigation = useNavigate();

  useEffect(() => {
    if (id === "0") return navigation("/", { replace: true });
    else {
      axios
        .get(API + `/user/userData/${id}`, { withCredentials: true })
        .then((response) => {
          if (!response.data.success)
            return alert("유저 정보를 불러오는데 실패했습니다.");
          setUserData(response.data);

          axios
            .get(API + `/record/userRecord/${id}`, { withCredentials: true })
            .then((response) => {
              if (!response.data.success)
                return alert("유저 정보를 불러오는데 실패했습니다.");

              setRecordList(response.data.recordList);
              setLoading(false);
            });
        });
    }
  }, [id, navigation]);

  if (loading) return <Loading />;
  return (
    <MDBContainer>
      <MDBTabs justify className="mb-3">
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => setTab("UserInformation")}
            active={tab === "UserInformation"}
            className="fw-bold"
          >
            유저 정보
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => setTab("UserRecord")}
            active={tab === "UserRecord"}
            className="fw-bold"
          >
            기록
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={tab === "UserInformation"}>
          <Main recordList={recordList} userData={userData} />
        </MDBTabsPane>
        <MDBTabsPane show={tab === "UserRecord"}>
          <MyRecord recordList={recordList} />
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
  );
}

export default UserPage;
