import React from "react";
import PropTypes from "prop-types";
import styles from "./modal.module.css";

function ModalOverlay(props) {
    return <div className={styles.overlay} onClick={props.onClose} />;
}

ModalOverlay.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default ModalOverlay;
