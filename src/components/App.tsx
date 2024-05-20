import Header from "./pages/components/Header/Header";
import Footer from "./pages/components/Footer/Footer";
import "./App.css";
import useCustomHook from "./Logic/useCustomHook";
import Loader from "./pages/components/Loader/Loader";
import AppRouter from "./AppRouter";

export default function App() {
  const { loaderUserAccount } = useCustomHook();

  return (
    <>
      <Header />
      { loaderUserAccount ? <Loader /> : <AppRouter /> }
      <Footer />
    </>
  );
}

