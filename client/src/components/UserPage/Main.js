import UserProfile from "./UserProfile";
import RecordSummary from "./RecordSummary";

function Main(props) {
  return (
    <>
      <UserProfile lastRecord={props.recordList[props.recordList.length-1]} userData={props.userData}/>
      <hr />
      <RecordSummary recordList={props.recordList}/>
    </>
  )
}

export default Main;