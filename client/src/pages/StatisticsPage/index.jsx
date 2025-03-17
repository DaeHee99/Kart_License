import { useEffect, useState } from "react";
import { API } from "../../_actions/types";
import {
  MDBContainer,
  MDBBadge,
  MDBCollapse,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";
import { season as nowSeason } from "../../global/mapData";
import axios from "axios";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import BarChart from "../ResultPage/BarChart";
import SurveyTable from "./SurveyTable";
import SurveyChart from "./SurveyChart";

function StatisticsPage() {
  const [today] = useState(new Date());
  const [open, setOpen] = useState("angle-up");
  const [showShow, setShowShow] = useState(true);
  const [open2, setOpen2] = useState("angle-up");
  const [showShow2, setShowShow2] = useState(true);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [userLicense, setUserLicense] = useState([]);
  const [sum, setSum] = useState(0);
  const [surveySum, setSurveySum] = useState(0);
  const [surveyData, setSurveyData] = useState({
    level: [0, 0, 0, 0, 0],
    balance: [0, 0, 0, 0, 0],
  });

  const clickHandler = () => {
    if (open === "angle-down") setOpen("angle-up");
    else setOpen("angle-down");
    setShowShow(!showShow);
  };

  const clickHandler2 = () => {
    if (open2 === "angle-down") setOpen2("angle-up");
    else setOpen2("angle-down");
    setShowShow2(!showShow2);
  };

  useEffect(() => {
    axios
      .get(API + "/record/all", { withCredentials: true })
      .then((response) => {
        if (!response.data.success)
          return alert("데이터를 불러오는데 실패했습니다.");
        else {
          setData(response.data.recordData);
          setSum(response.data.recordSum);

          axios
            .get(API + "/record/all/user/license", { withCredentials: true })
            .then((response) => {
              if (!response.data.success)
                return alert("데이터를 불러오는데 실패했습니다.");
              else {
                setUserLicense(response.data.licenseData);

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
                      setSurveySum(seasonSurveyList.length);
                      setLoading(false);
                    }
                  });
              }
            });
        }
      });
  }, []);

  if (loading) return <Loading />;
  return (
    <>
      <MDBContainer className="mb-7">
        <h1>
          <MDBBadge color="primary" light className="w-100 fw-bold">
            전체 유저 기록 통계
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
              <br />총 <span className="text-success fw-bold">{sum}</span>개의
              기록을 성공적으로 불러왔습니다.
              <br />
            </div>
            전체 유저의 기록을 통해 분석된 결과입니다.
          </div>
        </MDBCollapse>

        <div className="my-3 d-lg-flex flex-row justify-content-around gap-2">
          <div className="col-lg-6 col-12 mb-2">
            <SurveyTable
              data={[
                { name: "강주력", count: data[0] },
                { name: "주력", count: data[1] },
                { name: "1군", count: data[2] },
                { name: "2군", count: data[3] },
                { name: "3군", count: data[4] },
                { name: "4군", count: data[5] },
                { name: "일반", count: data[6] },
              ]}
              title={"누적 측정 결과"}
              type="result"
            />
            <BarChart data={data} name={"누적 측정 결과"} />
          </div>
          <div className="col-lg-6 col-12 mb-2">
            <SurveyTable
              data={[
                { name: "강주력", count: userLicense[0] },
                { name: "주력", count: userLicense[1] },
                { name: "1군", count: userLicense[2] },
                { name: "2군", count: userLicense[3] },
                { name: "3군", count: userLicense[4] },
                { name: "4군", count: userLicense[5] },
                { name: "일반", count: userLicense[6] },
              ]}
              title={"유저 군 분포 결과 (로그인 유저 최신 기록 기준)"}
              type="result"
            />
            <BarChart data={userLicense} name={"유저 군 분포 결과"} />
          </div>
        </div>

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

        <hr style={{ marginTop: 25, marginBottom: 25 }} />

        <h1>
          <MDBBadge color="primary" light className="w-100 fw-bold">
            S{nowSeason} 군표 피드백
            <MDBIcon
              fas
              icon={open2}
              onClick={clickHandler2}
              style={{ float: "right", cursor: "pointer" }}
            />
          </MDBBadge>
        </h1>

        <MDBCollapse show={showShow2}>
          <div className="text-center fw-bold mb-0">
            <div className="text-secondary fw-bold">
              {today.getFullYear()}/{("00" + (today.getMonth() + 1)).slice(-2)}/
              {("00" + today.getDate()).slice(-2)}{" "}
              {("00" + today.getHours()).slice(-2)}:
              {("00" + today.getMinutes()).slice(-2)}:
              {("00" + today.getSeconds()).slice(-2)} 기준
              <br />총 <span className="text-success fw-bold">{surveySum}</span>
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
              type="survey"
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
              type="survey"
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
      </MDBContainer>
      <Footer />
    </>
  );
}

export default StatisticsPage;
