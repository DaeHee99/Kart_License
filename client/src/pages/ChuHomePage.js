import { useEffect } from "react";
import Loading from "../components/layout/Loading";

export default function ChuHomePage() {
  useEffect(() => {
    window.location.replace('https://kart-chu-club.netlify.app');
  }, []);

  return <Loading />;
}