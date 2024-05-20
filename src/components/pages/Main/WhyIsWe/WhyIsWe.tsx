import { useState } from "react";
import styles from "./WhyIsWe.module.scss";
import advantagesItemImg from "./img/advantagesItemImg.svg";
import advantagesItemImg2 from "./img/advantagesItemImg2.svg";
import advantagesItemImg3 from "./img/advantagesItemImg3.svg";
import right from "./img/arrow-right.svg"
import left from "./img/arrow-left.svg"
import imgFullScreen from "./img/imgHeroOnFullScreen.svg";
import Slide from "./Slide";

const WhyIsWe = () => {


  const arrSlides = [
    {
      img: advantagesItemImg,
      text: "Высокая и оперативная скорость обработки заявки"
    },
    {
      img: advantagesItemImg2,
      text: "Огромная компдексная база данных, обеспечивающая обьективный ответ на запрос"
    },
    {
      img: advantagesItemImg3,
      text: "Защита конфиденциальных сведений, не подлежащих разглашению по федеральному законодательству"
    },
  ]

  const [count, setCount] = useState(0)

  const clickRight = () => {
    if(count == 2) {
      setCount(0)
    } else {
      setCount(count + 1)
    }
  }
  const clickLeft = () => {
    if(count == 0) {
      setCount(2)
    } else {
      setCount(count - 1)
    }
  }
  
  return (
    <section className={ styles.whyIsWe }>
      <h2 className={ styles.titleH2 }>Почему именно мы</h2>
      <div className={ styles.advantages }>

        <button className={ styles.arrow } onClick={clickLeft}>
          <img src={ left } alt="" />
        </button>

        <div className={ styles.advantagesItemCointainer }>   
          {count == 0 && <Slide slide={arrSlides} />}    
          {count == 1 && <Slide slide={[arrSlides[1], arrSlides[0], arrSlides[2]]} />}    
          {count == 2 && <Slide slide={[arrSlides[2], arrSlides[1], arrSlides[0]]} />}    
        </div>

        <button className={ styles.arrow } onClick={clickRight}>
          <img src={ right } alt="" />
        </button>

      </div>

      <div className={ styles.imgFullScreen }>
        <img src={ imgFullScreen } alt="" />
      </div>
    </section>
  );
};

export default WhyIsWe;
