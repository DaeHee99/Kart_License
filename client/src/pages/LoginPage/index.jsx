import { useState } from "react";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBContainer,
} from "mdb-react-ui-kit";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function LoginPage() {
  const [loginRegisterActive, handleLoginRegisterClick] = useState("login");

  return (
    <MDBContainer className="col-md-6 mx-auto">
      <MDBTabs pills justify className="mt-4 mb-3">
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleLoginRegisterClick("login")}
            active={loginRegisterActive === "login"}
          >
            <b>로그인</b>
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleLoginRegisterClick("register")}
            active={loginRegisterActive === "register"}
          >
            <b>회원가입</b>
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={loginRegisterActive === "login"}>
          <LoginForm handleLoginRegisterClick={handleLoginRegisterClick} />
        </MDBTabsPane>

        <MDBTabsPane show={loginRegisterActive === "register"}>
          <RegisterForm />
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
  );
}

export default LoginPage;
