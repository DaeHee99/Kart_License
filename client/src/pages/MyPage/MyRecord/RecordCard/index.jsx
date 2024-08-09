import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import Loading from "../../../../components/Loading";

function RecordCard({ _id, season, createdAt, license }) {
  const [date, setDate] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();

  const goResultPage = () => {
    navigation(`/result/${_id}`);
  };

  const cardColor = () => {
    if (season === 17) return "primary";
    if (season === 18) return "secondary";
    if (season === 19) return "success";
    if (season === 20) return "danger";
    if (season === 21) return "warning";
    if (season === 22) return "info";

    if (season === 23) return "primary";
    if (season === 24) return "secondary";
    if (season === 25) return "success";
    if (season === 26) return "danger";
    if (season === 27) return "warning";
  };

  useEffect(() => {
    setDate(new Date(createdAt));
    setLoading(false);
  }, [createdAt]);

  return loading ? (
    <Loading />
  ) : (
    <MDBCard
      background={cardColor()}
      className="shadow-5 w-100 text-white mb-3"
      style={{ cursor: "pointer" }}
      onClick={goResultPage}
    >
      <MDBCardHeader className="fw-bold">{`S${season}`}</MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle className="fw-bold">{license}</MDBCardTitle>
        <MDBCardText>
          {date.getFullYear()}/{("00" + (date.getMonth() + 1)).slice(-2)}/
          {("00" + date.getDate()).slice(-2)}{" "}
          {("00" + date.getHours()).slice(-2)}:
          {("00" + date.getMinutes()).slice(-2)}:
          {("00" + date.getSeconds()).slice(-2)}
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  );
}

export default RecordCard;
