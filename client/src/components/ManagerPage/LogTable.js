import React, { useEffect, useState } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import LogRow from './LogRow';
import axios from 'axios';
import { API } from '../../_actions/types';

export default function LogTable() {
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    axios.get(API+'/log/manager/all', {withCredentials: true}).then(response => {
      if(!response.data.success) return alert('서버 오류');
      setLogData(response.data.logList);
    });
  }, [])

  return (
    <MDBTable align='middle' responsive className='text-center'>
      <MDBTableHead>
        <tr>
          <th scope='col' className='fw-bold'>유저</th>
          <th scope='col' className='fw-bold'>시간</th>
          <th scope='col' className='fw-bold'>내용</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
      {
        logData.map(item => <LogRow key={item._id} data={item}/>)
      }
      </MDBTableBody>
    </MDBTable>
  );
}