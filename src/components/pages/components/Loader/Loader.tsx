import loaderImg from "./Loader.svg";
import styles from "./Loader.module.scss";

const GlobalLoader = () => {
  return (
    <div className={styles.loaderContainer}>
      <img src={loaderImg} alt="" />
      <div>Загружаю данные...</div>
    </div>
  );
};

export default GlobalLoader;
