import React from "react";
import { Modal, Button } from "antd";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SubTaskModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
          className="bg-blue-900 text-white hover:text-blue-900 hover:bg-gray-100"
        >
          Close
        </Button>,
      ]}
      width={800}
    >
      {children}
    </Modal>
  );
};

export default SubTaskModal;
