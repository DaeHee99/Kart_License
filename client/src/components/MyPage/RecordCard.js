import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardHeader
} from 'mdb-react-ui-kit';

function RecordCard() {
  return (
    <MDBCard background='primary' className='shadow-5 w-100 text-white mb-3' style={{cursor: 'pointer'}}>
      <MDBCardHeader><b>S17</b></MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle><b>1군</b></MDBCardTitle>
        <MDBCardText>
          {'2023/01/01 10:00:00'}
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  );
}

export default RecordCard;