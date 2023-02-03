import {
  MDBContainer
} from 'mdb-react-ui-kit';
import LineChart from './LineChart';

function RecordSummary() {
  return (
    <MDBContainer className='w-100 d-lg-flex flex-lg-row justify-content-lg-center'>
      <MDBContainer className='col-12 col-lg-6 p-0'>
        <LineChart
          name={'내 측정 기록'}
          color={'rgba(255, 99, 132)'}
          data={['주력','주력','1군','1군','2군','1군','2군']} 
          label={['23/01/01', '23/01/01', '23/01/01', '23/01/01', '23/01/01', '23/01/01', '23/01/01']}/>
      </MDBContainer>
      <MDBContainer className='col-12 col-lg-6 p-0'>
        <LineChart 
          name={'시즌별 최고 기록'}
          color={'rgba(153, 102, 255)'}
          data={['주력', '주력']} 
          label={['S16', 'S17']}/>
      </MDBContainer>
    </MDBContainer>
  );
}

export default RecordSummary;