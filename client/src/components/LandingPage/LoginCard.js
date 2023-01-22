import React from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardLink,
  MDBContainer
} from 'mdb-react-ui-kit';

export default function LoginCard() {
  return (
    <MDBContainer>
      <MDBCard style={{ maxWidth: '900px' }} className='shadow-5'>
        <MDBCardBody>
          <MDBCardTitle><b>로그인</b></MDBCardTitle>
          <MDBCardText>
            로그인을 하면 더 다양한 기능을 이용할 수 있습니다. <br />
            내 기록을 저장하고 쉽게 관리하세요!
          </MDBCardText>
          <MDBCardLink href='#'>로그인</MDBCardLink>
          <MDBCardLink href='#'>회원가입</MDBCardLink>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}