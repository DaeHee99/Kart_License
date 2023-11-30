import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { API } from "../_actions/types";
import axios from "axios";
import {
  MDBContainer,
  MDBBadge,
  MDBCollapse,
  MDBIcon,
  MDBCardImage,
  MDBBtn,
  MDBBtnGroup,
} from "mdb-react-ui-kit";
import Loading from "../components/layout/Loading";
import ResultTable from "../components/ResultPage/ResultTable";
import PieChart from "../components/ResultPage/PieChart";
import BarChart from "../components/ResultPage/BarChart";
import ResultMapTable from "../components/ResultPage/ResultMapTable";
import KakaoModal from "../components/ResultPage/KakaoModal";
import StarModal from "../components/ResultPage/StarModal";
import Footer from "../components/layout/Footer";
import { basicProfileImage } from "../components/layout/ProfileImages";

function ResultPage() {
  const { id } = useParams();
  const navigation = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [open, setOpen] = useState("angle-up");
  const [showShow, setShowShow] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);
  const [titleColor, setTitleColor] = useState("primary");

  const clickHandler = () => {
    if (open === "angle-down") setOpen("angle-up");
    else setOpen("angle-down");
    setShowShow(!showShow);
  };

  const record = data.recordCount;

  useEffect(() => {
    axios
      .get(API + "/record/" + id, { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          setData({
            ...response.data.record,
            date: new Date(response.data.record.createdAt),
          });

          if (response.data.record.license === "강주력")
            setTitleColor("danger");
          else if (response.data.record.license === "주력")
            setTitleColor("warning");
          else if (response.data.record.license === "1군")
            setTitleColor("warning");
          else if (response.data.record.license === "2군")
            setTitleColor("success");
          else if (response.data.record.license === "3군")
            setTitleColor("info");
          else if (response.data.record.license === "4군")
            setTitleColor("primary");
          else if (response.data.record.license === "일반")
            setTitleColor("secondary");

          setLoading(false);
          setTimeout(() => {
            clickHandler();
            if (response.data.record.recordCount[7] >= 20) {
              setTimeout(
                () =>
                  alert(
                    "기록 선택을 하지 않은 트랙이 많아서 결과가 정확하지 않을 수도 있습니다."
                  ),
                500
              );
            }
          }, 1000);
        }
      });
  }, [id]);

  return loading ? (
    <Loading />
  ) : (
    <>
      <MDBContainer className="mb-7">
        <h1>
          <MDBBadge color={titleColor} light className="w-100">
            당신은 {data.license} 입니다!
            <MDBIcon
              fas
              icon={open}
              onClick={clickHandler}
              style={{ float: "right", cursor: "pointer" }}
            />
          </MDBBadge>
        </h1>

        <MDBCollapse show={showShow}>
          <div className="text-center fw-bold d-flex flex-row align-items-center justify-content-center">
            <div className="d-inline col-md-2 col-4 mb-0">
              <MDBCardImage
                src={data.user ? data.user.image : basicProfileImage}
                alt="ProfileImage"
                fluid
                className="col-md-8 col-6"
              />
              <p className="mb-0 text-nowrap">
                {data.user ? data.user.name : "비로그인 유저"}
              </p>
            </div>
            <p className="mb-0 ps-3 text-secondary">
              {data.date.getFullYear()}/
              {("00" + (data.date.getMonth() + 1)).slice(-2)}/
              {("00" + data.date.getDate()).slice(-2)}{" "}
              {("00" + data.date.getHours()).slice(-2)}:
              {("00" + data.date.getMinutes()).slice(-2)}:
              {("00" + data.date.getSeconds()).slice(-2)}
              <br />S{data.season} 측정 기록
            </p>
          </div>
        </MDBCollapse>

        <div className="my-3 d-lg-flex flex-row justify-content-around">
          <div className="col-lg-6 col-12 mb-2">
            <ResultTable data={record} name={"선택 개수"} />
            <BarChart data={record} name={"개수"} />
          </div>
          <div className="col-lg-6 col-12 d-flex align-items-center justify-content-center">
            <PieChart data={record} name={"개수"} />
          </div>
        </div>
        <div className="w-100">
          <ResultMapTable record={data.record} mapCount={data.mapCount} />
        </div>

        <MDBBtn
          size="lg"
          color="secondary"
          style={{
            backgroundColor: "#FEE500",
            color: "#000000",
            position: "fixed",
            top: "90%",
            right: "50%",
            marginRight: "-45%",
            zIndex: "99",
          }}
          onClick={() => setShareOpen(true)}
        >
          <MDBIcon fas icon="comment" size="lg" /> 카카오톡 공유
        </MDBBtn>
        <MDBBtn
          size="lg"
          floating
          style={{
            position: "fixed",
            top: "83%",
            right: "50%",
            marginRight: "-45%",
            zIndex: "99",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <MDBIcon fas icon="angle-up" size="lg" />
        </MDBBtn>

        <MDBBtnGroup shadow="0" className="w-100 my-4" size="lg">
          <MDBBtn
            color="secondary"
            onClick={() => navigation("/", { replace: true })}
          >
            <b>다시하기</b>
          </MDBBtn>
          <MDBBtn color="secondary" onClick={() => setStarOpen(true)}>
            <b>후기 작성</b>
          </MDBBtn>
        </MDBBtnGroup>

        <MDBBtn
          className="w-100 text-center"
          style={{ backgroundColor: "#ac2bac" }}
          href="https://kart-chu-club.netlify.app/"
          size="lg"
        >
          <b>츄르 공식 홈페이지</b>
        </MDBBtn>

        <KakaoModal
          shareOpen={shareOpen}
          setShareOpen={setShareOpen}
          recordId={id}
        />
        <StarModal
          starOpen={starOpen}
          setStarOpen={setStarOpen}
          recordId={id}
        />
      </MDBContainer>
      <Footer />
    </>
  );
}

export default ResultPage;
