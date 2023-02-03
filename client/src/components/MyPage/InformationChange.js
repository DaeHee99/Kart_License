import React, { useState } from 'react';
import {
  MDBInput,
  MDBBtn,
  MDBRadio,
  MDBCardImage,
  MDBAccordion,
  MDBAccordionItem
} from 'mdb-react-ui-kit';
import dao from '../../images/ProfileImage/dao.png';
import bazzi from '../../images/ProfileImage/bazzi.png';
import dizini from '../../images/ProfileImage/dizini.png';
import marid from '../../images/ProfileImage/marid.png';

function InformationChange() {
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const newNameHandler = (event) => setNewName(event.target.value);
  const newPasswordHandler = (event) => setNewPassword(event.target.value);
  const newPasswordConfirmHandler = (event) => setNewPasswordConfirm(event.target.value);

  const changeName = () => {
    console.log(newName);
  }
  const changePassword = () => {
    console.log(newPassword);
    console.log(newPasswordConfirm);
  }
  const changeImage = () => {
    let selected = document.querySelector('input[type=radio][name=newProfileImage]:checked');
    console.log(selected.value);
  }

  return(
    <MDBAccordion borderless initialActive={0}>
      <MDBAccordionItem collapseId={1} headerTitle='닉네임 변경'>
        <MDBInput className='mb-4' id='New_Name' label='새로운 닉네임' value={newName} onChange={newNameHandler}/>
        <MDBBtn block onClick={changeName}><b>변경하기</b></MDBBtn>
      </MDBAccordionItem>
      <MDBAccordionItem collapseId={2} headerTitle='비밀번호 변경'>
        <MDBInput className='mb-4' type='password' id='New_Password' label='새로운 비밀번호' value={newPassword} onChange={newPasswordHandler}/>
        <MDBInput className='mb-4' type='password' id='New_Confirm' label='새로운 비밀번호 확인' value={newPasswordConfirm} onChange={newPasswordConfirmHandler}/>
        <MDBBtn block onClick={changePassword}><b>변경하기</b></MDBBtn>
      </MDBAccordionItem>
      <MDBAccordionItem collapseId={3} headerTitle='프로필 사진 변경'>
        <div className="badge bg-primary text-wrap" style={{width: "100%", fontSize: "0.9rem", marginRight: "10px"}}>원하는 프로필 사진을 하나 선택하세요.</div><br /><br />
        <MDBRadio name='newProfileImage' id='newProfileImage1' value='profileImage1' defaultChecked={true} inline label={<MDBCardImage src='https://lwi.nexon.com/m_kartrush/event/2022/0816_vote_1750B8ADA92D72F3/vote2.png' alt='ProfileImage' width='63px' />}/>
        <MDBRadio name='newProfileImage' id='newProfileImage2' value='profileImage2' defaultChecked={false} inline label={<MDBCardImage src={dao} alt='ProfileImage' width='63px' />}/>
        <MDBRadio name='newProfileImage' id='newProfileImage3' value='profileImage3' defaultChecked={false} inline label={<MDBCardImage src={bazzi} alt='ProfileImage' width='63px' />}/>
        <MDBRadio name='newProfileImage' id='newProfileImage4' value='profileImage4' defaultChecked={false} inline label={<MDBCardImage src={dizini} alt='ProfileImage' width='63px' />}/>
        <MDBRadio name='newProfileImage' id='newProfileImage5' value='profileImage5' defaultChecked={false} inline label={<MDBCardImage src={marid} alt='ProfileImage' width='63px' />}/>
        <MDBBtn block className='mt-4' onClick={changeImage}><b>변경하기</b></MDBBtn>
      </MDBAccordionItem>
    </MDBAccordion>
  );
}

export default InformationChange;