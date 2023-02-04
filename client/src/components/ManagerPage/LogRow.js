export default function LogRow() {
  return (
    <tr>
      <td>
        <div className='d-flex align-items-center'>
          <img
            src='https://lwi.nexon.com/m_kartrush/event/2022/0816_vote_1750B8ADA92D72F3/vote2.png'
            alt='profileImage'
            style={{ width: '45px', height: '45px' }}
          />
          <div className='ms-3' style={{whiteSpace: 'nowrap'}}>
            <p className='fw-bold mb-1'>앵두새</p>
          </div>
        </div>
      </td>
      <td>2023/01/01 10:00:00</td>
      <td style={{whiteSpace: 'nowrap'}}>
        {'닉네임 변경 (앵두새 -> 앵두새2)'}
      </td>
    </tr>
    );
  }