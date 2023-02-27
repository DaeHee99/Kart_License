import React, { useEffect, useState } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import StarRow from './StarRow';
import axios from 'axios';
import { API } from '../../_actions/types';

export default function StarTable() {
  const [starData, setStarData] = useState([]);

  useEffect(() => {
    axios.get(API+'/star/manager/all', {withCredentials: true}).then(response => {
      if(!response.data.success) return alert('서버 오류');
      setStarData(response.data.starList);
    });
  }, [])

  return (
    <MDBTable align='middle' responsive className='text-center'>
      <MDBTableHead>
        <tr>
          <th scope='col' className='fw-bold w-25'>유저</th>
          <th scope='col' className='fw-bold w-25'>시간</th>
          <th scope='col' className='fw-bold w-50'>내용</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
      {
        starData.map(item => <StarRow key={item._id} data={item}/>)
      }
      </MDBTableBody>
    </MDBTable>
  );
}