import React from "react";
import styles from "./modal.module.css";

interface ModalOverlayProps {
  onClose: () => void;
}

function ModalOverlay({ onClose }: ModalOverlayProps) {
  return <div className={styles.overlay} onClick={onClose} />;
}

export default ModalOverlay;
