import { useSelector } from "react-redux";
import BurgerMenu from "./BurgerMenu/BurgerMenu";
import styles from "./Header.module.scss";
import avatar from "./Imgs/avatar.png";
import logo from "./Imgs/Logo.svg";
import { TypeUserInStore } from "../../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userSlice } from "../../../store/userSlice";


const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const currentUserInStore: TypeUserInStore = useSelector((state: any) => state.user);

  return (
    <header className={ styles.header }>
      <div
        onClick={ () => {
          navigate("/");
        } }
        className={ styles.logo }
      >
        <img src={ logo } alt="logo" />
      </div>
      <ul className={ styles.ul }>
        <li>
          <a onClick={ () => navigate("/") }>Главная</a>
        </li>
        <li>
          <a>Тарифы</a>
        </li>
        <li>
          <a>FAQ</a>
        </li>
      </ul>

      { currentUserInStore.companyLimit !== 0 && (
        <div className={ styles.limitCompany }>
          <div className={ styles.limitCompanyTextItem }>
            <p>Использовано компаний</p>
            <p>Лимит по компаниям</p>
          </div>
          <div className={ styles.limitCompanyCountItem }>
            <div className={ styles.userCompanyCountText }>
              { currentUserInStore.usedCompanyCount }
            </div>
            <div className={ styles.companyLimit }>
              { currentUserInStore.companyLimit }
            </div>
          </div>
        </div>
      ) }
      { currentUserInStore.companyLimit !== 0 ? (
        <div className={ styles.user }>
          <div className={ styles.userNameAndQuit }>
            <p className={ styles.userName }>Алексей А.</p>
            <button onClick={ () => {
              localStorage.clear()
              dispatch(userSlice.actions.clearUser());
              navigate("/login")
            } } className={ styles.quit }>Выйти</button>
          </div>
          <img className={ styles.avatar } src={ avatar } alt="" />
        </div>
      ) : (
        <div className={ styles.logInOrSignUpContainer }>
          <button className={ styles.SignUpBtnHeader }>Зарегистрироваться</button>
          <div className={ styles.loginBtnHeaderContainer }>
            <button onClick={() => navigate("/login")} className={ styles.loginBtnHeader }>Войти</button>
          </div>
        </div>
      ) }

      <BurgerMenu />
    </header>
  );
};

export default Header;
