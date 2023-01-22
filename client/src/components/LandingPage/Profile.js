import React from 'react';
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
  return (
    <MDBContainer>
      <MDBCard style={{ maxWidth: '900px' }} className='shadow-5'>
        <MDBRow className='g-0'>
          <MDBCol col='8' className='col-lg-12'>
            <MDBCardImage src='https://lwi.nexon.com/m_kartrush/event/2022/0816_vote_1750B8ADA92D72F3/vote2.png' alt='ProfileImage' fluid />
          </MDBCol>
          <MDBCol col='4'>
            <MDBCardBody>
              <MDBCardTitle><b>앵두새</b></MDBCardTitle>
              <MDBCardText>
                나는 앵두새!!
              </MDBCardText>
              <MDBCardText>
                <small className='text-muted'>1군</small>
              </MDBCardText>
              <MDBRow className='g-2'>
              <MDBBtn rounded className='col-12' color='secondary'>
                내 정보
              </MDBBtn>
              <MDBBtn rounded className='col-12' color='danger'>
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