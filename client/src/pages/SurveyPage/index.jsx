import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { API } from "../../_actions/types";
import {
  MDBContainer,
  MDBBadge,
  MDBCollapse,
  MDBIcon,
  MDBBtn,
  MDBTypography,
} from "mdb-react-ui-kit";
import { season as nowSeason } from "../../global/mapData";
import axios from "axios";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import SurveyTable from "../StatisticsPage/SurveyTable";
import SurveyChart from "../StatisticsPage/SurveyChart";
import AdminSurveyTable from "../AdminPage/SurveyTable";
import Pagination from "./Pagination";

function SurveyPage() {
  const tableRef = useRef();
  const user = useSelector((state) => state.user);
  const navigation = useNavigate();
  const [searchParams] = useSearchParams();
  const [page] = useState(Number(searchParams.get("page")) || 1);
  const [today] = useState(new Date());
  const [open, setOpen] = useState("angle-up");
  const [showShow, setShowShow] = useState(true);
  const [loading, setLoading] = useState(true);
  const [seasonDataCount, setSeasonDataCount] = useState(0);
  const [dataAllCount, setDataAllCount] = useState(0);
  const [viewPageNavigation, setViewPageNavigation] = useState(false);
  const [surveyData, setSurveyData] = useState({
    level: [0, 0, 0, 0, 0],
    balance: [0, 0, 0, 0, 0],
  });

  const clickHandler = () => {
    if (open === "angle-down") setOpen("angle-up");
    else setOpen("angle-down");
    setShowShow(!showShow);
  };

  useEffect(() => {
    if (!user.userData?.role || user.userData?.role < 1) {
      navigation("/", { replace: true });
      return;
    }
    axios
      .get(API + "/survey/manager/all", { withCredentials: true })
      .then((response) => {
        if (!response.data.success)
          return alert("데이터를 불러오는데 실패했습니다.");
        else {
          const seasonSurveyList = response.data.surveyList?.filter(
            ({ season }) => season === nowSeason
          );

          const survey = seasonSurveyList.reduce(
            (acc, val) => {
              acc.level[val.level - 1]++;
              acc.balance[val.balance - 1]++;
              return acc;
            },
            { level: [0, 0, 0, 0, 0], balance: [0, 0, 0, 0, 0] }
          );
          setSurveyData(survey);
          setSeasonDataCount(seasonSurveyList.length);
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    if (!searchParams.get("page") || !page || !tableRef.current) return;
    const containerRect = tableRef.current.getBoundingClientRect();
    const scrollY = containerRect.top + containerRect.height / 2;
    window.scrollTo({ top: scrollY });
  }, [page, tableRef.current]);

  if (loading) return <Loading />;
  return (
    <>
      <MDBContainer className="mb-7">
        <h1>
          <MDBBadge color="primary" light className="w-100 fw-bold">
            S{nowSeason} 군표 피드백
            <MDBIcon
              fas
              icon={open}
              onClick={clickHandler}
              style={{ float: "right", cursor: "pointer" }}
            />
          </MDBBadge>
        </h1>

        <MDBCollapse show={showShow}>
          <div className="text-center fw-bold mb-0">
            <div className="text-secondary fw-bold">
              {today.getFullYear()}/{("00" + (today.getMonth() + 1)).slice(-2)}/
              {("00" + today.getDate()).slice(-2)}{" "}
              {("00" + today.getHours()).slice(-2)}:
              {("00" + today.getMinutes()).slice(-2)}:
              {("00" + today.getSeconds()).slice(-2)} 기준
              <br />총{" "}
              <span className="text-success fw-bold">{seasonDataCount}</span>
              개의 피드백을 성공적으로 불러왔습니다.
              <br />
            </div>
            이번 시즌에 유저분들이 작성해주신 결과입니다.
          </div>
        </MDBCollapse>

        <div className="my-3 d-lg-flex flex-row justify-content-around gap-2">
          <div className="col-lg-6 col-12 mb-2">
            <SurveyTable
              data={[
                { name: "매우 쉬움", count: surveyData.level[0] },
                { name: "쉬움", count: surveyData.level[1] },
                { name: "보통", count: surveyData.level[2] },
                { name: "어려움", count: surveyData.level[3] },
                { name: "매우 어려움", count: surveyData.level[4] },
              ]}
              title={"이번 시즌 군표 난이도는 어떠셨나요?"}
            />
            <SurveyChart
              data={[
                { name: "매우 쉬움", count: surveyData.level[0] },
                { name: "쉬움", count: surveyData.level[1] },
                { name: "보통", count: surveyData.level[2] },
                { name: "어려움", count: surveyData.level[3] },
                { name: "매우 어려움", count: surveyData.level[4] },
              ]}
              title={"이번 시즌 군표 난이도는 어떠셨나요?"}
            />
          </div>
          <div className="col-lg-6 col-12 mb-2">
            <SurveyTable
              data={[
                { name: "매우 좋음", count: surveyData.balance[0] },
                { name: "좋음", count: surveyData.balance[1] },
                { name: "보통", count: surveyData.balance[2] },
                { name: "나쁨", count: surveyData.balance[3] },
                { name: "매우 나쁨", count: surveyData.balance[4] },
              ]}
              title={"이번 시즌 맵 별로 군표 밸런스 어떠셨나요?"}
            />
            <SurveyChart
              data={[
                { name: "매우 좋음", count: surveyData.balance[0] },
                { name: "좋음", count: surveyData.balance[1] },
                { name: "보통", count: surveyData.balance[2] },
                { name: "나쁨", count: surveyData.balance[3] },
                { name: "매우 나쁨", count: surveyData.balance[4] },
              ]}
              title={"이번 시즌 맵 별로 군표 밸런스 어떠셨나요?"}
            />
          </div>
        </div>

        <hr />

        {dataAllCount > 0 && (
          <MDBTypography listUnStyled className="mb-0 text-end" ref={tableRef}>
            <MDBIcon icon="check-circle" className="me-2 text-success" />
            모든 시즌 {dataAllCount}개의 피드백 데이터가 있습니다!
          </MDBTypography>
        )}

        <AdminSurveyTable
          tab="survey"
          page={page}
          setDataAllCount={setDataAllCount}
          setViewPageNavigation={setViewPageNavigation}
        />

        {viewPageNavigation && (
          <Pagination page={page} lastPage={Math.ceil(dataAllCount / 20)} />
        )}

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
      </MDBContainer>
      <Footer />
    </>
  );
}

export default SurveyPage;
