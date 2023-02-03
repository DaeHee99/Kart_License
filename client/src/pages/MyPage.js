import React, { useState } from 'react';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBContainer
} from 'mdb-react-ui-kit';
import Main from '../components/MyPage/Main';
import MyRecord from '../components/MyPage/MyRecord';
import InformationChange from '../components/MyPage/InformationChange';

function MyPage() {
  const [tab, setTab] = useState('MyInformation');

  return (
    <MDBContainer>
      <MDBTabs justify className='mb-3'>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => setTab('MyInformation')} active={tab === 'MyInformation'}>
            <b>내 정보</b>
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => setTab('MyRecord')} active={tab === 'MyRecord'}>
            <b>기록</b>
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => setTab('ChangeInformation')} active={tab === 'ChangeInformation'}>
            <b>정보 수정</b>
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={tab === 'MyInformation'}>
          <Main />
        </MDBTabsPane>
        <MDBTabsPane show={tab === 'MyRecord'}>
          <MyRecord />
        </MDBTabsPane>
        <MDBTabsPane show={tab === 'ChangeInformation'}>
          <InformationChange />
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
  );
}

export default MyPage;