import React, { useEffect, useState } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import LogRow from './LogRow';
import axios from 'axios';
import { API } from '../../_actions/types';
import Loading from '../layout/Loading';

export default function LogTable(props) {
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(props.tab === 'log') {
      axios.get(API+'/log/manager/'+props.page, {withCredentials: true}).then(response => {
        if(!response.data.success) return alert('서버 오류');
        setLogData(response.data.logList);
        props.setDataAllCount(response.data.count);
        props.setViewPageNavigation(true);
        setLoading(false);
      });
    }
  }, [props.tab, props.page])

  return (
    loading ? <Loading /> :
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