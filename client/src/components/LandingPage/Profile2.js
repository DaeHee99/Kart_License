import profileHeader from '../../images/profileHeader.png';
import profileMain from '../../images/profileMain.png';
import {
  MDBContainer,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';

function Profile2() {
  return (
    <div>
      <MDBContainer className='bg-image' style={{maxWidth: '540px'}}>
        <img src={profileHeader} className='w-100' alt='ProfileHeader'/>
        <MDBRow className='col-3 mask text-center'>
          <MDBCol size='2'>
            
          </MDBCol>
          <MDBCol size='8'>
            <p style={{fontSize: '1.7rem'}}>앵두새</p>
          </MDBCol>
          <MDBCol size='2'>
            <p style={{fontSize: '1.2rem'}}>1군</p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      
      <MDBContainer className='bg-image' style={{maxWidth: '540px'}}>
        <img src={profileMain} className='w-100' alt='ProfileMain'/>
        <MDBRow className='col-3 mask text-center'>
          <MDBCol size='5'>
            <img src='https://lwi.nexon.com/m_kartrush/event/2022/0816_vote_1750B8ADA92D72F3/vote2.png' alt='ProfileImage' width={'100%'}/>
          </MDBCol>
          <MDBCol size='7'>
          
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Profile2;