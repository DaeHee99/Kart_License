import UserProfile from "./UserProfile";
import RecordSummary from "./RecordSummary";

function Main({ recordList, userData }) {
  return (
    <>
      <UserProfile
        lastRecord={recordList[recordList.length - 1]}
        userData={userData}
      />
      <hr />
      <RecordSummary recordList={recordList} />
    </>
  );
}

export default Main;
