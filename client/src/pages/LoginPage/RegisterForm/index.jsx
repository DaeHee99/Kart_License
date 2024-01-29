import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import {
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBRadio,
  MDBCardImage,
} from "mdb-react-ui-kit";
import ProfileImages from "../../../global/ProfileImages";

function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerName, setRegisterName] = useState("");
  const [registerId, setRegisterId] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");

  const registerNameHandler = (event) => setRegisterName(event.target.value);
  const registerIdHandler = (event) => setRegisterId(event.target.value);
  const registerPasswordHandler = (event) =>
    setRegisterPassword(event.target.value);
  const registerPasswordConfirmHandler = (event) =>
    setRegisterPasswordConfirm(event.target.value);
  const registerSubmitHandler = (event) => {
    event.preventDefault();

    if (registerName.length > 16) return alert("닉네임은 최대 16글자 입니다.");
    if (registerId.length < 2)
      return alert("아이디는 최소 2자리로 입력해주세요");
    if (registerPassword !== registerPasswordConfirm)
      return alert("비밀번호를 다시 확인해주세요.");
    if (registerPassword.length < 4)
      return alert("비밀번호는 최소 4자리로 입력해주세요");
    if (!document.getElementById("Register_Agree").checked)
      return alert("회원가입에 동의해주세요.");

    const selected = document.querySelector(
      "input[type=radio][name=profileImage]:checked"
    );

    const body = {
      name: registerName,
      id: registerId,
      password: registerPassword,
      plainPassword: registerPassword,
      image: selected.value,
    };

    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        alert("회원가입이 완료되었습니다.");
        navigate("/login", { replace: true });
      } else alert(response.payload.message || "회원가입 실패");
    });
  };

  return (
    <form onSubmit={registerSubmitHandler}>
      <br />
      <MDBInput
        className="mb-4"
        id="Register_Name"
        label="닉네임"
        value={registerName}
        onChange={registerNameHandler}
      />
      <MDBInput
        className="mb-4"
        id="Register_Id"
        label="아이디"
        value={registerId}
        onChange={registerIdHandler}
      />
      <MDBInput
        className="mb-4"
        type="password"
        id="Register_Password"
        label="비밀번호"
        value={registerPassword}
        onChange={registerPasswordHandler}
      />
      <MDBInput
        className="mb-4"
        type="password"
        id="Register_Confirm"
        label="비밀번호 확인"
        value={registerPasswordConfirm}
        onChange={registerPasswordConfirmHandler}
      />
      <div
        className="badge bg-primary text-wrap"
        style={{ width: "6rem", fontSize: "0.9rem", marginRight: "10px" }}
      >
        프로필 사진
      </div>
      원하는 프로필을 하나 선택하세요.
      <br />
      <br />
      <div className="d-flex flex-row flex-wrap px-4 px-lg-0">
        {ProfileImages.map((image, index) => (
          <MDBRadio
            key={image.name}
            name="profileImage"
            id={`profileImage${index}`}
            value={image.src}
            defaultChecked={index === 0}
            inline
            className="mt-2"
            label={
              <MDBCardImage
                src={image.src}
                alt={image.name}
                width="70px"
                className="mt-2"
              />
            }
          />
        ))}
      </div>
      <br />
      <MDBCheckbox
        wrapperClass="d-flex justify-content-center mb-4"
        id="Register_Agree"
        label="회원가입에 동의합니다."
        defaultChecked
      />
      <MDBBtn type="submit" className="mb-4 fw-bold" block>
        회원가입
      </MDBBtn>
    </form>
  );
}

export default RegisterForm;
