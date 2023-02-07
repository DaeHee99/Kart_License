import React, { useEffect, useState } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import UserRow from './UserRow';
import axios from 'axios';
import { API } from '../../_actions/types';

export default function UserTable() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    axios.get(API+'/user/manager/all', {withCredentials: true}).then(response => {
      if(!response.data.success) return alert('서버 오류');
      setUserData(response.data.userList);
    });
  }, [])
  
  return (
    <MDBTable align='middle' responsive className='text-center'>
      <MDBTableHead>
        <tr>
          <th scope='col' className='fw-bold'>유저</th>
          <th scope='col' className='fw-bold'>군</th>
          <th scope='col' className='fw-bold'>최근 접속</th>
          <th scope='col' className='fw-bold'>유저 정보</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
      {
        userData.map(item => <UserRow key={item._id} data={item}/>)
      }
      </MDBTableBody>
    </MDBTable>
  );
}