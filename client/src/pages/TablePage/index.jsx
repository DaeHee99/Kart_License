import { useEffect, useRef, useState } from "react";
import { MDBBadge, MDBBtn, MDBContainer } from "mdb-react-ui-kit";
import { season as nowSeason } from "../../global/mapData";
import Footer from "../../components/Footer";
import tableImage from "../../assets/images/S34_기록표.png";

function TablePage() {
  const ref = useRef();
  const [isIntersecting, setIsIntersecting] = useState(false);

  const downloadFile = async () => {
    const element = document.createElement("a");
    element.href = tableImage;
    element.download = `카러플_S${nowSeason}_기록표`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
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
  }, []);

  return (
    <>
      <MDBContainer className="mb-7">
        <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
          S{nowSeason} 기록표
          <MDBBadge className="fs-6">NEW</MDBBadge>
        </h2>
        <img src={tableImage} className="w-100" />
        <MDBBtn
          ref={ref}
          className="w-100 text-center fw-bold mt-4"
          size="lg"
          onClick={downloadFile}
        >
          기록표 이미지 다운로드
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
              <MDBContainer>
                <MDBBtn
                  className="w-100 text-center fw-bold"
                  size="lg"
                  onClick={downloadFile}
                >
                  기록표 이미지 다운로드
                </MDBBtn>
              </MDBContainer>
            </div>
          </div>
        )}
      </MDBContainer>
      <Footer />
    </>
  );
}

export default TablePage;
