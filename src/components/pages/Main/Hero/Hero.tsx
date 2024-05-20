import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import styles from "./Hero.module.scss";
import heroImg from "./imgs/hero img.svg";
import { TypeUserInStore } from "../../store/userSlice";


const Hero = () => {
  const navigate = useNavigate();
  const userLoged: TypeUserInStore = useSelector((state: any) => state.user.userLoged)

  return (
    <section className={ styles.hero }>
      <div className={ styles.left }>
        <h1 className={ styles.title }>
          сервис по поиску публикаций <br></br> о компании <br></br> по его ИНН
        </h1>
        <p className={ styles.subtitle }>
          Комплексный анализ публикаций, получение данных <br></br> в формате
          PDF на электронную почту.
        </p>
        {
          userLoged &&
          <button className={ styles.btn }
            onClick={ () => {
              navigate("/search");
            } }>
            Запросить данные
          </button>
        }
      </div>
      <div className={ styles.right }>
        <img src={ heroImg } alt="" />
      </div>
    </section>
  );
};

export default Hero;
