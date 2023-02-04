import React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import UserRow from './UserRow';

export default function UserTable() {
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

        <UserRow />
        <UserRow />
        <UserRow />
        <UserRow />

      </MDBTableBody>
    </MDBTable>
  );
}