import { useState } from "react";
import { MDBIcon, MDBBtn } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import ProfileImages from "../layout/ProfileImages";

export default function StarRow(props) {
  const navigation = useNavigate();
  const [date] = useState(new Date(props.data.updatedAt));

  return (
    <tr>
      <td>
        <div className='d-flex align-items-center'>
          <img
            src={props.data.user ? props.data.user.image : ProfileImages.dao}
            alt='profileImage'
            style={{ width: '45px', height: '45px' }}
          />
          <div className='ms-3' style={{whiteSpace: 'nowrap'}}>
            <p className='fw-bold mb-1'>{props.data.user? props.data.user.name : '비로그인 유저'}</p>
          </div>
        </div>
      </td>
      <td>
        {date.getFullYear()}/{("00"+(date.getMonth()+1)).slice(-2)}/{("00"+(date.getDate())).slice(-2)} {("00"+(date.getHours())).slice(-2)}:{("00"+(date.getMinutes())).slice(-2)}:{("00"+(date.getSeconds())).slice(-2)}<br />
        <MDBBtn color='link' rounded size='lg' style={{whiteSpace: 'nowrap'}} onClick={()=>navigation(`/result/${props.data.recordId}`)}>
          <b>결과 페이지</b>
        </MDBBtn>
      </td>
      <td style={{wordBreak: 'break-all'}}>
        <div className='text-center mb-3 text-warning' style={{whiteSpace: 'nowrap'}}>
          <MDBIcon far={props.data.star<1} fas={props.data.star>=1} icon="star" size='lg'/>
          <MDBIcon far={props.data.star<2} fas={props.data.star>=2} icon="star" size='lg'/>
          <MDBIcon far={props.data.star<3} fas={props.data.star>=3} icon="star" size='lg'/>
          <MDBIcon far={props.data.star<4} fas={props.data.star>=4} icon="star" size='lg'/>
          <MDBIcon far={props.data.star<5} fas={props.data.star>=5} icon="star" size='lg'/>
        </div>
        {props.data.text}
      </td>
    </tr>
  );
}