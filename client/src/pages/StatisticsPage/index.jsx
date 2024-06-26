import { useEffect, useState } from "react";
import { API } from "../../_actions/types";
import {
  MDBContainer,
  MDBBadge,
  MDBCollapse,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";
import axios from "axios";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ResultTable from "../ResultPage/ResultTable";
import PieChart from "../ResultPage/PieChart";
import BarChart from "../ResultPage/BarChart";

function StatisticsPage() {
  const [today] = useState(new Date());
  const [open, setOpen] = useState("angle-up");
  const [showShow, setShowShow] = useState(true);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [sum, setSum] = useState(0);

  const clickHandler = () => {
    if (open === "angle-down") setOpen("angle-up");
    else setOpen("angle-down");
    setShowShow(!showShow);
  };

  useEffect(() => {
    axios
      .get(API + "/record/all", { withCredentials: true })
      .then((response) => {
        if (!response.data.success)
          return alert("데이터를 불러오는데 실패했습니다.");
        else {
          let tempData = [0, 0, 0, 0, 0, 0, 0];
          response.data.recordList.map((item) => {
            switch (item.license) {
              case "강주력":
                return ++tempData[0];
              case "주력":
                return ++tempData[1];
              case "1군":
                return ++tempData[2];
              case "2군":
                return ++tempData[3];
              case "3군":
                return ++tempData[4];
              case "4군":
                return ++tempData[5];
              case "일반":
                return ++tempData[6];
              default:
                return 0;
            }
          });
          setData(tempData);
          setSum(response.data.recordList.length);
          setLoading(false);
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

        <div className="my-3 d-lg-flex flex-row justify-content-around">
          <div className="col-lg-6 col-12 mb-2">
            <ResultTable data={data} name={"산출 횟수"} />
            <BarChart data={data} name={"산출 횟수"} />
          </div>
          <div className="col-lg-6 col-12 d-flex align-items-center justify-content-center">
            <PieChart data={data} name={"산출 횟수"} />
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
      </MDBContainer>
      <Footer />
    </>
  );
}

export default StatisticsPage;
