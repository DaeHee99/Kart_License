import React, { useState } from 'react';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBContainer,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import UserTable from '../components/ManagerPage/UserTable';
import LogTable from '../components/ManagerPage/LogTable';
import RecordTable from '../components/ManagerPage/RecordTable';
import StarTable from '../components/ManagerPage/StarTable';

export default function ManagerPage() {
  const [tab, setTab] = useState('record');

  return (
    <MDBContainer>
      <MDBTabs pills justify className='mb-3'>
        <MDBTabsItem>
          <MDBTabsLink
            className='py-3 px-0'
            onClick={() => setTab('record')}
            active={tab === 'record'}
          >
            <b>실시간 기록</b>
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            className='py-3 px-0'
            onClick={() => setTab('user')}
            active={tab === 'user'}
          >
            <b>전체 유저</b>
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            className='py-3 px-0'
            onClick={() => setTab('star')}
            active={tab === 'star'}
          >
            <b>후기</b>
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            className='py-3 px-0'
            onClick={() => setTab('log')}
            active={tab === 'log'}
          >
            <b>로그</b>
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={tab === 'record'}>
          <RecordTable />
        </MDBTabsPane>

        <MDBTabsPane show={tab === 'user'}>
          <UserTable />
        </MDBTabsPane>

        <MDBTabsPane show={tab === 'star'}>
          <StarTable />
        </MDBTabsPane>

        <MDBTabsPane show={tab === 'log'}>
          <LogTable />
        </MDBTabsPane>
      </MDBTabsContent>

      <MDBBtn size='lg' floating style={{ position: 'fixed', top: '90%', right: '50%', marginRight: '-45%', zIndex: '99' }} onClick={()=>window.scrollTo({top: 0, behavior: 'smooth'})}>
        <MDBIcon fas icon="angle-up" size='lg'/>
      </MDBBtn>
    </MDBContainer>
  );
}