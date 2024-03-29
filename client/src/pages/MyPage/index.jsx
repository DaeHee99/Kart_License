import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
import Footer from "../../components/Footer";
import Main from "./Main";
import MyRecord from "./MyRecord";
import InformationChange from "./InformationChange";

function MyPage() {
  const userData = useSelector((state) => state.user.userData);
  const [tab, setTab] = useState("MyInformation");
  const [loading, setLoading] = useState(true);
  const [recordList, setRecordList] = useState([]);

  useEffect(() => {
    axios
      .get(API + `/record/userRecord/${userData._id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setRecordList(response.data.recordList);
        setLoading(false);
      });
  }, [userData._id]);

  if (loading) return <Loading />;
  return (
    <>
      <MDBContainer className="mb-7">
        <MDBTabs justify className="mb-3">
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => setTab("MyInformation")}
              active={tab === "MyInformation"}
              className="fw-bold"
            >
              내 정보
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => setTab("MyRecord")}
              active={tab === "MyRecord"}
              className="fw-bold"
            >
              기록
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => setTab("ChangeInformation")}
              active={tab === "ChangeInformation"}
              className="fw-bold"
            >
              정보 수정
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>
          <MDBTabsPane show={tab === "MyInformation"}>
            <Main recordList={recordList} />
          </MDBTabsPane>
          <MDBTabsPane show={tab === "MyRecord"}>
            <MyRecord recordList={recordList} />
          </MDBTabsPane>
          <MDBTabsPane show={tab === "ChangeInformation"}>
            <InformationChange />
          </MDBTabsPane>
        </MDBTabsContent>
      </MDBContainer>
      {tab !== "ChangeInformation" && <Footer />}
    </>
  );
}

export default MyPage;
