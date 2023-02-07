import React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

export default function ResultTable(props) {
  return (
    <MDBTable small className='text-center border border-dark'>
      <MDBTableHead>
        <tr>
          <th scope='col'><b>군</b></th>
          <th scope='col'><b>{props.name}</b></th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr style={{backgroundColor: 'rgba(255, 99, 132, 0.5)'}}>
          <th scope='row'><b>강주력</b></th>
          <td><b>{props.data[0]}</b></td>
        </tr>
        <tr style={{backgroundColor: 'rgba(255, 159, 64, 0.5)'}}>
          <th scope='row'><b>주력</b></th>
          <td><b>{props.data[1]}</b></td>
        </tr>
        <tr style={{backgroundColor: 'rgba(255, 205, 86, 0.5)'}}>
          <th scope='row'><b>1군</b></th>
          <td><b>{props.data[2]}</b></td>
        </tr>
        <tr style={{backgroundColor: 'rgba(75, 192, 192, 0.5)'}}>
          <th scope='row'><b>2군</b></th>
          <td><b>{props.data[3]}</b></td>
        </tr>
        <tr style={{backgroundColor: 'rgba(54, 162, 235, 0.5)'}}>
          <th scope='row'><b>3군</b></th>
          <td><b>{props.data[4]}</b></td>
        </tr>
        <tr style={{backgroundColor: 'rgba(153, 102, 255, 0.5)'}}>
          <th scope='row'><b>4군</b></th>
          <td><b>{props.data[5]}</b></td>
        </tr>
        <tr style={{backgroundColor: 'rgba(201, 203, 207, 0.5)'}}>
          <th scope='row'><b>일반</b></th>
          <td><b>{props.data[6]}</b></td>
        </tr>
        {props.data[7] &&
        <tr style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
          <th scope='row'><b>선택 안함</b></th>
          <td><b>{props.data[7]}</b></td>
        </tr>
        }
      </MDBTableBody>
    </MDBTable>
  );
}