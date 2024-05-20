import styles from "./WhyIsWe.module.scss";

export default function Slide({slide}: any) {
  return (
    <>
        { slide.map((el: any, index: any ) => {
        return (
          <div className={ styles.advantagesItem } key={index}>
            <img
              className={ styles.advantagesItemImg }
              src={ el.img }
              alt=""
            />
            <p className={ styles.advantagesItemText }>
              { el.text }
            </p>
          </div>
        )
      }) }
    </>
  )
}
