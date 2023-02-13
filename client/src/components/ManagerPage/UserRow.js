import { MDBBadge, MDBBtn } from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserRow(props) {
  const navigation = useNavigate();
  const [licenseColor, setLicenseColor] = useState('dark');
  const [date] = useState(new Date(props.data.updatedAt));

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
            src={props.data.image}
            alt='profileImage'
            style={{ width: '45px', height: '45px' }}
          />
          <div className='ms-3' style={{whiteSpace: 'nowrap'}}>
            <p className='fw-bold mb-1'>{props.data.name}</p>
          </div>
        </div>
      </td>
      <td>
        <MDBBadge color={licenseColor} pill className='fs-6'>
          {props.data.license !== '' ? props.data.license : '기록 없음'}
        </MDBBadge>
      </td>
      <td>
        {date.getFullYear()}/{("00"+(date.getMonth()+1)).slice(-2)}/{("00"+(date.getDate())).slice(-2)} {("00"+(date.getHours())).slice(-2)}:{("00"+(date.getMinutes())).slice(-2)}:{("00"+(date.getSeconds())).slice(-2)}
      </td>
      <td>
        <MDBBtn color='link' rounded size='lg' style={{whiteSpace: 'nowrap'}} onClick={()=>navigation(`/userpage/${props.data._id}`)}>
          <b>정보</b>
        </MDBBtn>
      </td>
    </tr>
  );
}