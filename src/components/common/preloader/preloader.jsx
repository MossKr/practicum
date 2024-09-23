import React from "react";
import styles from "./preloader.module.css";

function Preloader() {
    return (
        <div className={styles.preloader}>
            <div className={styles.spinner}></div>
        </div>
    );
}

export default Preloader;
