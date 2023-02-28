import React, { useEffect, useState } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import StarRow from './StarRow';
import axios from 'axios';
import { API } from '../../_actions/types';
import Loading from '../layout/Loading';

export default function StarTable(props) {
  const [starData, setStarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(props.tab === 'star') {
      axios.get(API+'/star/manager/'+props.page, {withCredentials: true}).then(response => {
        if(!response.data.success) return alert('서버 오류');
        setStarData(response.data.starList);
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