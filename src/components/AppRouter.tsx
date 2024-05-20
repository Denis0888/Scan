// @ts-nocheck
import Login from "./pages/Login/Login";
import Search from "./pages/Search/Search";
import Result from "./pages/ResultPage/ResultPage";
import Main from "./pages/Main/Main";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";

export default function AppRouter() {
  const userLoged = useSelector((state) => state.user.userLoged)

  return (
    <Routes>
      <Route element={ <Main /> } path="/" />
      <Route element={ <Login /> } path="/login" />
      <Route element={ userLoged == true ? <Search /> : <Login /> } path="/search" />
      <Route element={ userLoged == true ? <Result /> : <Login /> } path="/results" />
    </Routes>
  );
}

