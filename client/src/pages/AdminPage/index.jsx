import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBContainer,
  MDBBtn,
  MDBIcon,
  MDBTypography,
  MDBInput,
} from "mdb-react-ui-kit";
import Footer from "../../components/Footer";
import UserTable from "./UserTable";
import LogTable from "./LogTable";
import RecordTable from "./RecordTable";
import StarTable from "./StarTable";
import Pagination from "./Pagination";
import NoticeModal from "./NoticeModal";

function AdminPage() {
  const navigation = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab] = useState(searchParams.get("tab") || "record");
  const [page] = useState(Number(searchParams.get("page")) || 1);
  const [dataAllCount, setDataAllCount] = useState(0);
  const [viewPageNavigation, setViewPageNavigation] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  const [userSearchName, setUserSearchName] = useState("");
  const [userSearchResetButton, setUserSearchResetButton] = useState(false);
  const userSearchHangler = (event) => setUserSearchName(event.target.value);
  const userRef = useRef({});
  const userSearch = () => {
    setUserSearchResetButton(true);
    userRef.current.userSearch(userSearchName);
  };
  const userSearchReset = () => window.location.reload();

  const tabToKorean = () => {
    if (tab === "record") return "기록";
    if (tab === "user") return "유저";
    if (tab === "star") return "후기";
    if (tab === "log") return "로그";
  };

  return (
    <>
      <MDBContainer className="mb-7">
        <MDBTabs pills justify className="mb-3">
          <MDBTabsItem>
            <MDBTabsLink
              className="py-3 px-0 fw-bold"
              onClick={() => navigation("/admin?tab=record&page=1")}
              active={tab === "record"}
            >
              실시간 기록
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              className="py-3 px-0 fw-bold"
              onClick={() => navigation("/admin?tab=user&page=1")}
              active={tab === "user"}
            >
              전체 유저
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              className="py-3 px-0 fw-bold"
              onClick={() => navigation("/admin?tab=star&page=1")}
              active={tab === "star"}
            >
              후기
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              className="py-3 px-0 fw-bold"
              onClick={() => navigation("/admin?tab=log&page=1")}
              active={tab === "log"}
            >
              로그
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        {tab === "user" && (
          <div className="d-flex flex-row justify-content-end mb-2">
            <MDBInput
              type="text"
              id="userSearchKeyword"
              label="유저 검색"
              value={userSearchName}
              onChange={userSearchHangler}
            />
            <MDBBtn
              color="primary"
              className="fw-bold"
              style={{ width: "20%", maxWidth: 100, marginLeft: 2 }}
              onClick={userSearch}
            >
              검색
            </MDBBtn>
            {userSearchResetButton && (
              <MDBBtn
                color="secondary"
                className="fw-bold"
                style={{ width: "20%", maxWidth: 100, marginLeft: 2 }}
                onClick={userSearchReset}
              >
                리셋
              </MDBBtn>
            )}
          </div>
        )}

        {dataAllCount > 0 && (
          <MDBTypography listUnStyled className="mb-0 text-end">
            <MDBIcon icon="check-circle" className="me-2 text-success" />
            {dataAllCount}개의 {tabToKorean()} 데이터가 있습니다!
          </MDBTypography>
        )}

        <MDBTabsContent>
          <MDBTabsPane show={tab === "record"}>
            <RecordTable
              tab={tab}
              page={page}
              setDataAllCount={setDataAllCount}
              setViewPageNavigation={setViewPageNavigation}
            />
          </MDBTabsPane>

          <MDBTabsPane show={tab === "user"}>
            <UserTable
              tab={tab}
              page={page}
              setDataAllCount={setDataAllCount}
              setViewPageNavigation={setViewPageNavigation}
              ref={userRef}
            />
          </MDBTabsPane>

          <MDBTabsPane show={tab === "star"}>
            <StarTable
              tab={tab}
              page={page}
              setDataAllCount={setDataAllCount}
              setViewPageNavigation={setViewPageNavigation}
            />
          </MDBTabsPane>

          <MDBTabsPane show={tab === "log"}>
            <LogTable
              tab={tab}
              page={page}
              setDataAllCount={setDataAllCount}
              setViewPageNavigation={setViewPageNavigation}
            />
          </MDBTabsPane>
        </MDBTabsContent>

        {viewPageNavigation && (
          <Pagination
            tab={tab}
            page={page}
            lastPage={Math.ceil(dataAllCount / 20)}
          />
        )}

        <MDBBtn
          size="lg"
          floating
          color="danger"
          style={{
            position: "fixed",
            top: "83%",
            right: "50%",
            marginRight: "-45%",
            zIndex: "99",
          }}
          onClick={() => setNoticeOpen(true)}
        >
          <MDBIcon fas icon="bell" size="lg" />
        </MDBBtn>
        <MDBBtn
          size="lg"
          floating
          style={{
            position: "fixed",
            top: "90%",
            right: "50%",
            marginRight: "-45%",
            zIndex: "99",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <MDBIcon fas icon="angle-up" size="lg" />
        </MDBBtn>

        <NoticeModal noticeOpen={noticeOpen} setNoticeOpen={setNoticeOpen} />
      </MDBContainer>
      <Footer />
    </>
  );
}

export default AdminPage;
