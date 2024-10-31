import React from "react";
import styles from "./preloader.module.css";

const Preloader: React.FC = () => {
  return (
    <div className={styles.preloader}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Preloader;
