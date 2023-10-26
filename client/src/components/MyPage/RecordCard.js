import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import Loading from "../layout/Loading";

function RecordCard(props) {
  const [date, setDate] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();

  const goResultPage = () => {
    navigation(`/result/${props.data._id}`);
  };

  const cardColor = () => {
    if (props.data.season === 17) return "primary";
    if (props.data.season === 18) return "secondary";
    if (props.data.season === 19) return "success";
    if (props.data.season === 20) return "danger";
    if (props.data.season === 21) return "warning";
    if (props.data.season === 22) return "info";
  };

  useEffect(() => {
    setDate(new Date(props.data.createdAt));
    setLoading(false);
  }, [props.data.createdAt]);

  return loading ? (
    <Loading />
  ) : (
    <MDBCard
      background={cardColor()}
      className="shadow-5 w-100 text-white mb-3"
      style={{ cursor: "pointer" }}
      onClick={goResultPage}
    >
      <MDBCardHeader>
        <b>S{props.data.season}</b>
      </MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle>
          <b>{props.data.license}</b>
        </MDBCardTitle>
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
