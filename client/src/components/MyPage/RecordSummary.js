import {
  MDBContainer
} from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react';
import LineChart from './LineChart';

function RecordSummary(props) {
  const [dateList, setDateList] = useState([]);
  const [licenseList, setLicenseList] = useState([]);
  const [highSeason, setHighSeason] = useState([]);
  const [highRecord, setHighRecord] = useState([]);

  let licenseTemp = [];
  let dateTemp = [];
  let highSeasonTemp = [];
  let highRecordTemp = [];

  const licenseToValue = (license) => {
    switch(license) {
      case '일반': return 1;
      case '4군': return 2;
      case '3군': return 3;
      case '2군': return 4;
      case '1군': return 5;
      case '주력': return 6;
      case '강주력': return 7;
      default: return 0;
    }
  }

  useEffect(() => {
    props.recordList.map((item, index) => {
      let date = new Date(item.createdAt);
      dateTemp[index] = `${date.getFullYear()}/${("00"+(date.getMonth()+1)).slice(-2)}/${("00"+(date.getDate())).slice(-2)}`;
      licenseTemp[index] = item.license;

      highSeasonTemp[item.season] = 'S'+item.season;
      if(licenseToValue(highRecordTemp[item.season]) < licenseToValue(item.license)) 
        highRecordTemp[item.season] = item.license;
      
      if(props.recordList.length === index + 1) {
        setDateList(dateTemp);
        setLicenseList(licenseTemp);
        setHighRecord(highRecordTemp.filter(e => e !== undefined))
        setHighSeason(highSeasonTemp.filter(e => e !== undefined))
      }
    })
  }, [])

  return (
    <MDBContainer className='w-100 d-lg-flex flex-lg-row justify-content-lg-center'>
      <MDBContainer className='col-12 col-lg-6 p-0'>
        <LineChart
          name={'내 측정 기록'}
          color={'rgba(255, 99, 132)'}
          data={licenseList}
          label={dateList}
          />
      </MDBContainer>
      <MDBContainer className='col-12 col-lg-6 p-0'>
        <LineChart 
          name={'시즌별 최고 기록'}
          color={'rgba(153, 102, 255)'}
          data={highRecord} 
          label={highSeason}/>
      </MDBContainer>
    </MDBContainer>
  );
}

export default RecordSummary;