import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";
import { MDBInput, MDBBtn } from "mdb-react-ui-kit";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const loginIdHandler = (event) => setLoginId(event.target.value);
  const loginPasswordHandler = (event) => setLoginPassword(event.target.value);
  const loginSubmitHandler = (event) => {
    event.preventDefault();

    const body = {
      id: loginId,
      password: loginPassword,
    };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.success) {
        navigate("/", { replace: true });
      } else alert(response.payload.message || "로그인 실패");
    });
  };

  return (
    <form onSubmit={loginSubmitHandler}>
      <MDBInput
        className="mt-5 mb-4"
        id="Login_id"
        label="아이디"
        value={loginId}
        onChange={loginIdHandler}
      />
      <MDBInput
        className="mb-4"
        type="password"
        id="Login_password"
        label="비밀번호"
        value={loginPassword}
        onChange={loginPasswordHandler}
      />
      <MDBBtn type="submit" className="mb-4 fw-bold" block>
        로그인
      </MDBBtn>
    </form>
  );
}

export default LoginForm;
