import React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import RecordRow from './RecordRow';

export default function RecordTable() {
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

      <RecordRow />
      <RecordRow />
      <RecordRow />
      <RecordRow />

      </MDBTableBody>
    </MDBTable>
  );
}