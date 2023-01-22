import { MDBContainer, MDBCol, MDBRow } from "mdb-react-ui-kit";
import Intro from "../components/LandingPage/Intro";
import Profile from "../components/LandingPage/Profile";
import Footer from "../components/layout/Footer";
import LoginCard from "../components/LandingPage/LoginCard";

function LandingPage() {
  return (
    <div>
      <br />
      <MDBContainer fluid>
        <MDBRow className='g-3'>
          <MDBCol lg='9'>
            <Intro />
          </MDBCol>
          <MDBCol lg='3'>
            {/* <Profile /> */}
            <LoginCard />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <br />
      <br />
      <Footer />
    </div>
  );
}

export default LandingPage;