import React, { useEffect, useState } from 'react';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBContainer
} from 'mdb-react-ui-kit';
import Main from '../components/UserPage/Main';
import MyRecord from '../components/MyPage/MyRecord';
import Loading from '../components/layout/Loading';
import axios from 'axios';
import { API } from '../_actions/types';
import { useParams } from 'react-router-dom';

function UserPage() {
  const { id } = useParams();
  const [tab, setTab] = useState('UserInformation');
  const [loading, setLoading] = useState(true);
  const [recordList, setRecordList] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    axios.get(API+`/user/userData/${id}`, {withCredentials: true}).then(response => {
      if(!response.data.success) return alert('유저 정보를 불러오는데 실패했습니다.');
      setUserData(response.data);

      axios.get(API+`/record/userRecord/${id}`, {withCredentials: true}).then(response => {
        if(!response.data.success) return alert('유저 정보를 불러오는데 실패했습니다.');

        setRecordList(response.data.recordList);
        setLoading(false);
      });
    });
  }, [id])

  return (
    loading ? <Loading /> :
    <MDBContainer>
      <MDBTabs justify className='mb-3'>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => setTab('UserInformation')} active={tab === 'UserInformation'}>
            <b>유저 정보</b>
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => setTab('UserRecord')} active={tab === 'UserRecord'}>
            <b>기록</b>
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={tab === 'UserInformation'}>
          <Main recordList={recordList} userData={userData}/>
        </MDBTabsPane>
        <MDBTabsPane show={tab === 'UserRecord'}>
          <MyRecord recordList={recordList}/>
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
  );
}

export default UserPage;