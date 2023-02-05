import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../_actions/user_action';
import {
  MDBCard,
  MDBCardTitle,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtn
} from 'mdb-react-ui-kit';

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logoutUser()).then(response => {
      if(response.payload.success) alert('로그아웃 완료');
      else alert('로그아웃 실패');
    })
  }

  return (
    <MDBContainer>
      <MDBCard style={{ maxWidth: '900px' }} className='shadow-5'>
        <MDBRow className='g-0'>
          <MDBCol col='8' className='col-lg-12 d-flex align-items-center justify-content-center'>
            <MDBCardImage src='https://lwi.nexon.com/m_kartrush/event/2022/0816_vote_1750B8ADA92D72F3/vote2.png' alt='ProfileImage' fluid />
          </MDBCol>
          <MDBCol col='4'>
            <MDBCardBody>
              <MDBCardTitle><b>앵두새</b></MDBCardTitle>
              <MDBCardText>
                <small className='text-muted'>1군</small>
              </MDBCardText>
              <MDBRow className='g-2'>
              <MDBBtn rounded className='col-12' color='secondary' onClick={()=>navigate('/mypage')}>
                내 정보
              </MDBBtn>
              <MDBBtn rounded className='col-12' color='danger' onClick={logoutHandler}>
                로그아웃
              </MDBBtn>
              </MDBRow>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}