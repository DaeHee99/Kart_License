import React, { useState } from 'react';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBContainer
} from 'mdb-react-ui-kit';
import LoginForm from '../components/LoginPage/LoginForm';
import RegisterForm from '../components/LoginPage/RegisterForm';

export default function LoginPage() {
  const [loginRegisterActive, handleLoginRegisterClick] = useState('login');

  return (
    <MDBContainer>
      <MDBTabs pills justify className='mb-3'>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleLoginRegisterClick('login')}
            active={loginRegisterActive === 'login'}
          >
            <b>로그인</b>
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleLoginRegisterClick('register')}
            active={loginRegisterActive === 'register'}
          >
            <b>회원가입</b>
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={loginRegisterActive === 'login'}>
          <LoginForm handleLoginRegisterClick={handleLoginRegisterClick}/>
        </MDBTabsPane>

        <MDBTabsPane show={loginRegisterActive === 'register'}>
          <RegisterForm />
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
  );
}