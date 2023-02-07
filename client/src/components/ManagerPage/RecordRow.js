import { MDBTableHead, MDBTableBody, MDBBadge, MDBBtn } from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FooterLogo from '../../images/footerLogo.png';

export default function RecordRow(props) {
  const navigation = useNavigate();
  const [licenseColor, setLicenseColor] = useState('success');

  useEffect(() => {
    if(props.data.license === "강주력") setLicenseColor('danger');
    else if(props.data.license === "주력") setLicenseColor('warning');
    else if(props.data.license === "1군") setLicenseColor('warning');
    else if(props.data.license === "2군") setLicenseColor('success');
    else if(props.data.license === "3군") setLicenseColor('info');
    else if(props.data.license === "4군") setLicenseColor('primary');
    else if(props.data.license === "일반") setLicenseColor('secondary');
  }, [props.data.license])

  return (
    <tr>
      <td>
        <div className='d-flex align-items-center'>
          <img
            src={props.data.user ? props.data.user.image : FooterLogo}
            alt='profileImage'
            style={{ width: '45px', height: '45px' }}
          />
          <div className='ms-3' style={{whiteSpace: 'nowrap'}}>
            <p className='fw-bold mb-1'>{props.data.user? props.data.user.name : '비로그인 유저'}</p>
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
              <th scope='row' style={{backgroundColor: 'rgba(255, 99, 132, 0.5)'}}>{props.data.recordCount[0]}</th>
              <th scope='row' style={{backgroundColor: 'rgba(255, 159, 64, 0.5)'}}>{props.data.recordCount[1]}</th>
              <th scope='row' style={{backgroundColor: 'rgba(255, 205, 86, 0.5)'}}>{props.data.recordCount[2]}</th>
              <th scope='row' style={{backgroundColor: 'rgba(75, 192, 192, 0.5)'}}>{props.data.recordCount[3]}</th>
              <th scope='row' style={{backgroundColor: 'rgba(54, 162, 235, 0.5)'}}>{props.data.recordCount[4]}</th>
              <th scope='row' style={{backgroundColor: 'rgba(153, 102, 255, 0.5)'}}>{props.data.recordCount[5]}</th>
              <th scope='row' style={{backgroundColor: 'rgba(201, 203, 207, 0.5)'}}>{props.data.recordCount[6]}</th>
            </tr>
          </MDBTableBody>
        </table>
      </td>
      <td>
        <MDBBadge color={licenseColor} pill className='fs-6'>
          {props.data.license}
        </MDBBadge>
      </td>
      <td>
        <MDBBtn color='link' rounded size='lg' style={{whiteSpace: 'nowrap'}} onClick={()=>navigation(`/result/${props.data._id}`)}>
          <b>결과</b>
        </MDBBtn>
      </td>
    </tr>
    );
  }