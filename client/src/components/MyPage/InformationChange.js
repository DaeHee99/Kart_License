import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { auth } from '../../_actions/user_action';
import axios from 'axios';
import { API } from '../../_actions/types';
import {
  MDBInput,
  MDBBtn,
  MDBRadio,
  MDBCardImage,
  MDBAccordion,
  MDBAccordionItem
} from 'mdb-react-ui-kit';
import ProfileImages from '../layout/ProfileImages';

function InformationChange() {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const newNameHandler = (event) => setNewName(event.target.value);
  const newPasswordHandler = (event) => setNewPassword(event.target.value);
  const newPasswordConfirmHandler = (event) => setNewPasswordConfirm(event.target.value);

  const changeName = () => {
    axios.post(API+'/user/changeName', {newName: newName}, {withCredentials: true}).then(response => {
      if(!response.data.success) return alert(response.data.message);
      else {
        alert('닉네임 변경이 완료되었습니다.');
        setNewName('');
        dispatch(auth());
      }
    });
  }
  const changePassword = () => {
    if(newPassword !== newPasswordConfirm) return alert('비밀번호를 다시 확인해주세요.');
    if(newPassword.length < 6) return alert('비밀번호는 최소 6자리로 입력해주세요');

    axios.post(API+'/user/changePassword', {newPassword: newPassword}, {withCredentials: true}).then(response => {
      if(!response.data.success) return alert('비밀번호 변경에 실패했습니다.');
      else {
        alert('비밀번호 변경이 완료되었습니다.');

        setNewPassword('');
        setNewPasswordConfirm('');
      }
    });
  }
  const changeImage = () => {
    let selected = document.querySelector('input[type=radio][name=newProfileImage]:checked');
    
    axios.post(API+'/user/changeImage', {newImage: selected.value}, {withCredentials: true}).then(response => {
      if(!response.data.success) return alert('프로필 사진 변경에 실패했습니다.');
      else {
        alert('프로필 사진 변경이 완료되었습니다.');
        dispatch(auth());
      }
    });
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
        <MDBRadio name='newProfileImage' id='newProfileImage1' value={ProfileImages.manager} defaultChecked={userData.image === ProfileImages.manager} inline label={<MDBCardImage src={ProfileImages.manager} alt='ProfileImage' width='63px' />}/>
        <MDBRadio name='newProfileImage' id='newProfileImage2' value={ProfileImages.dao} defaultChecked={userData.image === ProfileImages.dao} inline label={<MDBCardImage src={ProfileImages.dao} alt='ProfileImage' width='63px' />}/>
        <MDBRadio name='newProfileImage' id='newProfileImage3' value={ProfileImages.bazzi} defaultChecked={userData.image === ProfileImages.bazzi} inline label={<MDBCardImage src={ProfileImages.bazzi} alt='ProfileImage' width='63px' />}/>
        <MDBRadio name='newProfileImage' id='newProfileImage4' value={ProfileImages.dizini} defaultChecked={userData.image === ProfileImages.dizini} inline label={<MDBCardImage src={ProfileImages.dizini} alt='ProfileImage' width='63px' />}/>
        <MDBRadio name='newProfileImage' id='newProfileImage5' value={ProfileImages.marid} defaultChecked={userData.image === ProfileImages.marid} inline label={<MDBCardImage src={ProfileImages.marid} alt='ProfileImage' width='63px' />}/>
        <MDBBtn block className='mt-4' onClick={changeImage}><b>변경하기</b></MDBBtn>
      </MDBAccordionItem>
    </MDBAccordion>
  );
}

export default InformationChange;