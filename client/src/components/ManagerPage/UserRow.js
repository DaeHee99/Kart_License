import { MDBBadge, MDBBtn } from 'mdb-react-ui-kit';

export default function UserRow() {
  return (
    <tr>
      <td>
        <div className='d-flex align-items-center'>
          <img
            src='https://lwi.nexon.com/m_kartrush/event/2022/0816_vote_1750B8ADA92D72F3/vote2.png'
            alt='profileImage'
            style={{ width: '45px', height: '45px' }}
          />
          <div className='ms-3' style={{whiteSpace: 'nowrap'}}>
            <p className='fw-bold mb-1'>앵두새</p>
          </div>
        </div>
      </td>
      <td>
        <MDBBadge color='success' pill className='fs-6'>
          1군
        </MDBBadge>
      </td>
      <td>2023/01/01 10:00:00</td>
      <td>
        <MDBBtn color='link' rounded size='lg' style={{whiteSpace: 'nowrap'}}>
          <b>정보</b>
        </MDBBtn>
      </td>
    </tr>
    );
  }