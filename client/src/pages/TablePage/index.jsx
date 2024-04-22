import { useEffect, useRef, useState } from "react";
import { MDBBadge, MDBBtn, MDBContainer } from "mdb-react-ui-kit";
import Footer from "../../components/Footer";
import tableImage from "../../assets/images/S25_기록표.png";

function TablePage() {
  const ref = useRef();
  const [isIntersecting, setIsIntersecting] = useState(false);

  const downloadFile = async () => {
    try {
      const response = await fetch(tableImage);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "카러플_S25_기록표";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("다운로드를 할 수 없습니다.");
    }
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
          S25 기록표
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
