import React from 'react';
import { useSelector } from 'react-redux';
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
  const userData = useSelector(state => state.user.userData);

  return (
    <MDBContainer>
      <MDBCard className='shadow-5 w-100'>
        <MDBRow className='g-0'>
          <MDBCol className='col-4 col-lg-3 d-flex align-items-center justify-content-center'>
            <MDBCardImage src={userData.image} alt='ProfileImage' fluid />
          </MDBCol>
          <MDBCol className='col-8'>
            <MDBCardBody>
              <MDBCardTitle><b>{userData.name}</b></MDBCardTitle>
              <MDBCardText>
                {userData.license}
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