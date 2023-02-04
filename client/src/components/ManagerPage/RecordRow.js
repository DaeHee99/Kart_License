import { MDBTableHead, MDBTableBody, MDBBadge, MDBBtn } from 'mdb-react-ui-kit';

export default function RecordRow() {
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
        <table className='table mb-0'>
          <MDBTableHead>
            <tr>
              <th scope='col' style={{backgroundColor: 'rgba(255, 99, 132, 0.5)'}}><b>강</b></th>
              <th scope='col' style={{backgroundColor: 'rgba(255, 159, 64, 0.5)'}}><b>주</b></th>
              <th scope='col' style={{backgroundColor: 'rgba(255, 205, 86, 0.5)'}}><b>1</b></th>
              <th scope='col' style={{backgroundColor: 'rgba(75, 192, 192, 0.5)'}}><b>2</b></th>
              <th scope='col' style={{backgroundColor: 'rgba(54, 162, 235, 0.5)'}}><b>3</b></th>
              <th scope='col' style={{backgroundColor: 'rgba(153, 102, 255, 0.5)'}}><b>4</b></th>
              <th scope='col' style={{backgroundColor: 'rgba(201, 203, 207, 0.5)'}}><b>일</b></th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            <tr>
              <th scope='row' style={{backgroundColor: 'rgba(255, 99, 132, 0.5)'}}>20</th>
              <th scope='row' style={{backgroundColor: 'rgba(255, 159, 64, 0.5)'}}>15</th>
              <th scope='row' style={{backgroundColor: 'rgba(255, 205, 86, 0.5)'}}>10</th>
              <th scope='row' style={{backgroundColor: 'rgba(75, 192, 192, 0.5)'}}>10</th>
              <th scope='row' style={{backgroundColor: 'rgba(54, 162, 235, 0.5)'}}>10</th>
              <th scope='row' style={{backgroundColor: 'rgba(153, 102, 255, 0.5)'}}>10</th>
              <th scope='row' style={{backgroundColor: 'rgba(201, 203, 207, 0.5)'}}>10</th>
            </tr>
          </MDBTableBody>
        </table>
      </td>
      <td>
        <MDBBadge color='success' pill className='fs-6'>
          1군
        </MDBBadge>
      </td>
      <td>
        <MDBBtn color='link' rounded size='lg' style={{whiteSpace: 'nowrap'}}>
          <b>결과</b>
        </MDBBtn>
      </td>
    </tr>
    );
  }