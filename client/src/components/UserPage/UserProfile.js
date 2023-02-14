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

export default function UserProfile(props) {
  let lastRecordDate;
  if(props.lastRecord) lastRecordDate = new Date(props.lastRecord.createdAt);

  return (
    <MDBContainer>
      <MDBCard className='shadow-5 w-100'>
        <MDBRow className='g-0'>
          <MDBCol className='col-4 col-lg-3 d-flex align-items-center justify-content-center'>
            <MDBCardImage src={props.userData.image} alt='ProfileImage' fluid />
          </MDBCol>
          <MDBCol className='col-8'>
            <MDBCardBody>
              <MDBCardTitle><b>{props.userData.name} {props.userData.isAdmin && <b className='text-danger'>(관리자)</b>}</b></MDBCardTitle>
              <MDBCardText>
                {props.userData.license}
              </MDBCardText>
              <MDBCardText>
                <small className='text-muted'>최근 측정 기록<br/>
                {lastRecordDate===undefined ? <>측정 기록이 없습니다.</> :
                  <>
                  {lastRecordDate.getFullYear()}/{("00"+(lastRecordDate.getMonth()+1)).slice(-2)}/{("00"+(lastRecordDate.getDate())).slice(-2)} {("00"+(lastRecordDate.getHours())).slice(-2)}:{("00"+(lastRecordDate.getMinutes())).slice(-2)}:{("00"+(lastRecordDate.getSeconds())).slice(-2)} (S{props.lastRecord.season})
                  </>
                }
                </small>
              </MDBCardText>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}