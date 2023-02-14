import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth } from '../_actions/user_action';
import Loading from "../components/layout/Loading";

export default function Auth(SpecificComponent, option, adminRoute = false) {
  /* option 
    1. null => 아무나 출입 가능
    2. true => 로그인한 유저만 출입 가능
    3. false => 로그인한 유저는 출입 불가능
  */
  const navigate = useNavigate();
  
  function AuthenticationCheck() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [loading, setLoading] = useState(true);

    const checkRender = (isAuth, isAdmin) => {
      if(!isAuth) { // 로그인 X
        if(option === true) return navigate('/login');
        else setLoading(false);
      }
      else { // 로그인 O
        if(adminRoute && !isAdmin) return navigate('/', {replace: true});
              
        if(option === false) return navigate('/');
        else setLoading(false);
      }
    }

    useEffect(() => {
      if(!user.authCheck) {
        dispatch(auth()).then(response => {
          checkRender(response.payload.isAuth, response.payload.isAdmin);
        })
      }
      else checkRender(user.userData.isAuth, user.userData.isAdmin);
    });

    if(loading) return <Loading />;
    else return <SpecificComponent />;
  }
  
  return AuthenticationCheck;
}