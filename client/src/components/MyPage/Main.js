import MyProfile from "./MyProfile";
import RecordSummary from "./RecordSummary";

function Main(props) {
  return (
    <>
      <MyProfile lastRecord={props.recordList[props.recordList.length-1]}/>
      <hr />
      <RecordSummary recordList={props.recordList}/>
    </>
  )
}

export default Main;