import React, { useState } from 'react';
import {
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBIcon,
  MDBRadio,
  MDBCardImage
} from 'mdb-react-ui-kit';
import dao from '../../images/ProfileImage/dao.png';
import bazzi from '../../images/ProfileImage/bazzi.png';
import dizini from '../../images/ProfileImage/dizini.png';
import marid from '../../images/ProfileImage/marid.png';

function RegisterForm() {
  const [registerName, setRegisterName] = useState('');
  const [registerId, setRegisterId] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');

  const registerNameHandler = (event) => setRegisterName(event.target.value);
  const registerIdHandler = (event) => setRegisterId(event.target.value);
  const registerPasswordHandler = (event) => setRegisterPassword(event.target.value);
  const registerPasswordConfirmHandler = (event) => setRegisterPasswordConfirm(event.target.value);
  const registerSubmitHandler = (event) => {
    event.preventDefault();
    console.log(registerName, registerId, registerPassword, registerPasswordConfirm);
    console.log(document.getElementById('Register_Agree').checked);

    let selected = document.querySelector('input[type=radio][name=profileImage]:checked');
    console.log(selected.value);
  }

  return(
    <form onSubmit={registerSubmitHandler}>
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

      <MDBInput className='mb-4' id='Register_Name' label='닉네임' value={registerName} onChange={registerNameHandler}/>
      <MDBInput className='mb-4' id='Register_Id' label='아이디' value={registerId} onChange={registerIdHandler}/>
      <MDBInput className='mb-4' type='password' id='Register_Password' label='비밀번호' value={registerPassword} onChange={registerPasswordHandler}/>
      <MDBInput className='mb-4' type='password' id='Register_Confirm' label='비밀번호 확인' value={registerPasswordConfirm} onChange={registerPasswordConfirmHandler}/>

      <div className="badge bg-primary text-wrap" style={{width: "6rem", fontSize: "0.9rem", marginRight: "10px"}}>프로필 사진</div>원하는 프로필을 하나 선택하세요.<br /><br />
      <MDBRadio name='profileImage' id='profileImage1' value='profileImage1' inline label={<MDBCardImage src='https://lwi.nexon.com/m_kartrush/event/2022/0816_vote_1750B8ADA92D72F3/vote2.png' alt='ProfileImage' width='70px' />}/>
      <MDBRadio name='profileImage' id='profileImage2' value='profileImage2' inline label={<MDBCardImage src={dao} alt='ProfileImage' width='70px' />}/>
      <MDBRadio name='profileImage' id='profileImage3' value='profileImage3' inline label={<MDBCardImage src={bazzi} alt='ProfileImage' width='70px' />}/>
      <MDBRadio name='profileImage' id='profileImage4' value='profileImage4' inline label={<MDBCardImage src={dizini} alt='ProfileImage' width='70px' />}/>
      <MDBRadio name='profileImage' id='profileImage5' value='profileImage5' inline label={<MDBCardImage src={marid} alt='ProfileImage' width='70px' />}/>

      <br />
      <br />
      <MDBCheckbox
        wrapperClass='d-flex justify-content-center mb-4'
        id='Register_Agree'
        label='회원가입에 동의합니다.'
        defaultChecked
      />

      <MDBBtn type='submit' className='mb-4' block>
        <b>회원가입</b>
      </MDBBtn>
    </form>
  );
}

export default RegisterForm;