import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MDBContainer, MDBCol, MDBRow } from "mdb-react-ui-kit";
import { API } from "../../_actions/types";
import axios from "axios";
import Footer from "../../components/Footer";
import Intro from "./Intro";
import Profile from "./Profile";
import LoginCard from "./LoginCard";
import LoginCheckModal from "./LoginCheckModal";
import Notice from "./Notice";

function LandingPage() {
  const user = useSelector((state) => state.user);
  const [loginCheckModal, setLoginCheckModal] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [content, setContent] = useState("");
  const [noticeCheck, setNoticeCheck] = useState(
    localStorage.getItem("noticeCheck")
  );

  useEffect(() => {
    axios.get(API + "/notice", { withCredentials: true }).then((response) => {
      if (response.data.data.length > 0) {
        if (response.data.data[0]._id !== localStorage.getItem("noticeId")) {
          setNoticeCheck("false");
          localStorage.setItem("noticeCheck", true);
          localStorage.setItem("noticeId", response.data.data[0]._id);
        }
        setContent(response.data.data[0].content);
        setTimeout(() => setShowNotice(true), 500);
      }
    });
  }, []);

  return (
    <div>
      <MDBContainer fluid className="mb-7">
        <MDBRow className="g-3">
          <MDBCol lg="8">
            <Intro
              isAuth={user.userData.isAuth}
              content={content}
              setLoginCheckModal={setLoginCheckModal}
            />
          </MDBCol>
          <MDBCol lg="4">
            {user.userData.isAuth ? (
              <Profile {...user.userData} />
            ) : (
              <LoginCard />
            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <LoginCheckModal
        showModal={loginCheckModal}
        setModal={setLoginCheckModal}
      />
      {noticeCheck === "false" && (
        <Notice
          content={content}
          showModal={showNotice}
          setModal={setShowNotice}
        />
      )}
      <Footer />
    </div>
  );
}

export default LandingPage;
