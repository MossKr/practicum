import { useState, useCallback } from "react";

interface ModalHook {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useModal = (): ModalHook => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = useCallback((): void => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback((): void => {
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    openModal,
    closeModal,
  };
};
