import React, { useEffect, useState } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import RecordRow from './RecordRow';
import axios from 'axios';
import { API } from '../../_actions/types';

export default function RecordTable() {
  const [recordData, setRecordData] = useState([]);

  useEffect(() => {
    axios.get(API+'/record/manager/all', {withCredentials: true}).then(response => {
      if(!response.data.success) return alert('서버 오류');
      setRecordData(response.data.recordList);
    });
  }, [])

  return (
    <MDBTable align='middle' responsive className='text-center'>
      <MDBTableHead>
        <tr>
          <th scope='col' className='fw-bold'>유저</th>
          <th scope='col' className='fw-bold'>기록</th>
          <th scope='col' className='fw-bold'>결과</th>
          <th scope='col' className='fw-bold'>상세 결과</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
      {
        recordData.map(item => <RecordRow key={item._id} data={item}/>)
      }
      </MDBTableBody>
    </MDBTable>
  );
}