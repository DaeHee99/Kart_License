import React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import LogRow from './LogRow';

export default function LogTable() {
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

      <LogRow />
      <LogRow />
      <LogRow />
      <LogRow />

      </MDBTableBody>
    </MDBTable>
  );
}