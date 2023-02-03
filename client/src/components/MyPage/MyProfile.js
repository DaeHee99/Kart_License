import React from 'react';
import {
  MDBCard,
  MDBCardTitle,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBContainer
} from 'mdb-react-ui-kit';

export default function MyProfile() {
  return (
    <MDBContainer>
      <MDBCard className='shadow-5 w-100'>
        <MDBRow className='g-0'>
          <MDBCol className='col-4 col-lg-3 d-flex align-items-center justify-content-center'>
            <MDBCardImage src='https://lwi.nexon.com/m_kartrush/event/2022/0816_vote_1750B8ADA92D72F3/vote2.png' alt='ProfileImage' fluid />
          </MDBCol>
          <MDBCol className='col-8'>
            <MDBCardBody>
              <MDBCardTitle><b>앵두새</b></MDBCardTitle>
              <MDBCardText>
                1군
              </MDBCardText>
              <MDBCardText>
                <small className='text-muted'>최근 측정 기록<br/>2023/01/01 10:00:00 (S17)</small>
              </MDBCardText>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}