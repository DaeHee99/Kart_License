import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { MDBContainer, MDBCol, MDBRow } from "mdb-react-ui-kit";
import Intro from "../components/LandingPage/Intro";
import Profile from "../components/LandingPage/Profile";
import Footer from "../components/layout/Footer";
import LoginCard from "../components/LandingPage/LoginCard";
import StartModal from '../components/LandingPage/StartModal';

function LandingPage() {
  const user = useSelector(state => state.user);
  const [loginCheckModal, setLoginCheckModal] = useState(false);

  return (
    <div>
      <MDBContainer fluid className='mb-7'>
        <MDBRow className='g-3'>
          <MDBCol lg='9'>
            <Intro setLoginCheckModal={setLoginCheckModal} isAuth={user.userData.isAuth}/>
          </MDBCol>
          <MDBCol lg='3'>
            {user.userData.isAuth ? <Profile userData={user.userData}/> : <LoginCard />}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <StartModal showModal={loginCheckModal} setModal={setLoginCheckModal}/>
      <Footer />
    </div>
  );
}

export default LandingPage;