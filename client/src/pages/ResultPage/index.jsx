import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { API } from "../../_actions/types";
import {
  MDBContainer,
  MDBBadge,
  MDBCollapse,
  MDBIcon,
  MDBCardImage,
  MDBBtn,
  MDBBtnGroup,
} from "mdb-react-ui-kit";
import { basicProfileImage } from "../../global/ProfileImages";
import axios from "axios";
import Loading from "../../components/Loading";
import Footer from "../../components/Footer";
import ResultTable from "./ResultTable";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import ResultMapTable from "./ResultMapTable";
import KakaoModal from "./KakaoModal";
import StarModal from "./StarModal";
import SurveyModal from "./SurveyModal";

function ResultPage() {
  const ref = useRef();
  const { id } = useParams();
  const navigation = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [open, setOpen] = useState("angle-up");
  const [showShow, setShowShow] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);
  const [titleColor, setTitleColor] = useState("primary");
  const [isIntersecting, setIsIntersecting] = useState(false);

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

  useEffect(() => {
    if (loading) return;

    const observerCallback = (entries) => {
      setIsIntersecting(entries[0].isIntersecting);
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 1,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [loading]);

  if (loading) return <Loading />;
  return (
    <>
      <MDBContainer className="mb-7">
        <h1>
          <MDBBadge color={titleColor} light className="w-100 fw-bold">
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
              <p className="mb-0 text-nowrap fw-bold">
                {data.user ? data.user.name : "비로그인 유저"}
              </p>
            </div>
            <p className="mb-0 ps-3 text-secondary fw-bold">
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

        <MDBBtnGroup shadow="0" className="w-100 my-4" size="lg">
          <MDBBtn
            color="secondary"
            onClick={() => navigation("/", { replace: true })}
            className="fw-bold"
          >
            다시하기
          </MDBBtn>
          <MDBBtn
            color="secondary"
            className="fw-bold"
            onClick={() => setStarOpen(true)}
          >
            후기 작성
          </MDBBtn>
        </MDBBtnGroup>

        <div
          ref={ref}
          className="w-100 d-flex justify-content-center align-items-center gap-3"
        >
          <MDBBtn
            size="lg"
            color="secondary"
            className="w-100 d-flex justify-content-center align-items-center gap-2"
            style={{
              backgroundColor: "#FEE500",
              color: "#000000",
            }}
            onClick={() => setShareOpen(true)}
          >
            <MDBIcon fas icon="comment" size="lg" /> 카카오톡 공유
          </MDBBtn>
          <MDBBtn
            size="lg"
            floating
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex-shrink-0"
          >
            <MDBIcon fas icon="angle-up" size="lg" />
          </MDBBtn>
        </div>

        <MDBBtn
          className="w-100 text-center fw-bold mt-4"
          href="https://kart-chu-club.netlify.app/"
          size="lg"
          color="info"
        >
          츄르 공식 홈페이지
        </MDBBtn>

        {!isIntersecting && (
          <div
            style={{
              width: "100%",
              position: "fixed",
              left: 0,
              bottom: 0,
              zIndex: 50,
            }}
          >
            <div
              style={{
                width: "100%",
                paddingTop: "1rem",
                paddingBottom: "1rem",
                backgroundColor: "white",
              }}
            >
              <MDBContainer className="w-100 d-flex justify-content-center align-items-center gap-3">
                <MDBBtn
                  size="lg"
                  color="secondary"
                  className="w-100 d-flex justify-content-center align-items-center gap-2"
                  style={{
                    backgroundColor: "#FEE500",
                    color: "#000000",
                  }}
                  onClick={() => setShareOpen(true)}
                >
                  <MDBIcon fas icon="comment" size="lg" /> 카카오톡 공유
                </MDBBtn>
                <MDBBtn
                  size="lg"
                  floating
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="flex-shrink-0"
                >
                  <MDBIcon fas icon="angle-up" size="lg" />
                </MDBBtn>
              </MDBContainer>
            </div>
          </div>
        )}

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
        <SurveyModal
          userId={data.user?._id}
          recentSurvey={data.user?.recentSurvey}
          license={data.license}
          season={data.season}
        />
      </MDBContainer>
      <Footer />
    </>
  );
}

export default ResultPage;
