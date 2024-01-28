import MyProfile from "./MyProfile";
import RecordSummary from "./RecordSummary";

function Main({ recordList }) {
  return (
    <>
      <MyProfile lastRecord={recordList[recordList.length - 1]} />
      <hr />
      <RecordSummary recordList={recordList} />
    </>
  );
}

export default Main;
