import { useState } from "react";

export default function LogRow(props) {
  const [date] = useState(new Date(props.data.updatedAt));

  return (
    <tr>
      <td>
        <div className='d-flex align-items-center'>
          <img
            src={props.data.user.image}
            alt='profileImage'
            style={{ width: '45px', height: '45px' }}
          />
          <div className='ms-3' style={{whiteSpace: 'nowrap'}}>
            <p className='fw-bold mb-1'>{props.data.user.name}</p>
          </div>
        </div>
      </td>
      <td>
        {date.getFullYear()}/{("00"+(date.getMonth()+1)).slice(-2)}/{("00"+(date.getDate())).slice(-2)} {("00"+(date.getHours())).slice(-2)}:{("00"+(date.getMinutes())).slice(-2)}:{("00"+(date.getSeconds())).slice(-2)}
      </td>
      <td style={{whiteSpace: 'nowrap'}}>
        {props.data.content}
      </td>
    </tr>
    );
  }