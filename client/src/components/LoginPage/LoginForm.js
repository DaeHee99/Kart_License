import React, { useState } from 'react';
import {
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBIcon,
} from 'mdb-react-ui-kit';

function LoginForm(props) {
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const loginIdHandler = (event) => setLoginId(event.target.value);
  const loginPasswordHandler = (event) => setLoginPassword(event.target.value);
  const loginSubmitHandler = (event) => {
    event.preventDefault();
    console.log(loginId, loginPassword);
  }

  return(
    <form onSubmit={loginSubmitHandler}>
      <div className='text-center mb-3'>
        <p>소셜 로그인</p>

        <MDBBtn floating color="secondary" className='mx-1'>
          <MDBIcon fab icon='facebook-f' />
        </MDBBtn>

        <MDBBtn floating color="secondary" className='mx-1'>
          <MDBIcon fab icon='google' />
        </MDBBtn>

        <MDBBtn floating color="secondary" className='mx-1'>
          <MDBIcon fab icon='twitter' />
        </MDBBtn>

        <MDBBtn floating color="secondary" className='mx-1'>
          <MDBIcon fab icon='github' />
        </MDBBtn>
      </div>

      <p className='text-center'>OR</p>

      <MDBInput className='mb-4' id='Login_id' label='아이디' value={loginId} onChange={loginIdHandler}/>
      <MDBInput className='mb-4' type='password' id='Login_password' label='비밀번호' value={loginPassword} onChange={loginPasswordHandler}/>

      {/* <MDBRow className='mb-4'>
        <MDBCol className='d-flex justify-content-center'>
          <MDBCheckbox id='form7Example3' label='로그인 상태 유지' defaultChecked />
        </MDBCol>
        <MDBCol>
          <a href='#!'>비밀번호 찾기</a>
        </MDBCol>
      </MDBRow> */}

      <MDBBtn type='submit' className='mb-4' block>
        <b>로그인</b>
      </MDBBtn>

      <MDBRow className='mb-4'>
        <MDBCol className='d-flex justify-content-center'>
          <a href='#!'>비밀번호 찾기</a>  
        </MDBCol>
        <MDBCol className='d-flex justify-content-center'>
          <p className='text-primary' style={{cursor: 'pointer'}} onClick={()=>props.handleLoginRegisterClick('register')}>회원가입</p>
        </MDBCol>
      </MDBRow>
    </form>
  );
}

export default LoginForm;