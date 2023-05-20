import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './ResizebleModal.module.scss';
import { ResizableModalProps } from '@/utils/types';
import { useRecoilState } from 'recoil';
import { ModalWidthAtom, ModalHeightAtom } from 'recoil/state/resizeAtom';
import { NAVBAR_HEIGHT } from 'utils/constants';

const ResizableModal = ({
  isOpen,
  onRequestClose,
  children,
}: ResizableModalProps) => {
  const minWidth = window.innerWidth * 0.5;
  const minHeight = window.innerHeight * 0.6;

  const maxWidth = window.innerWidth - 50;
  const maxHeight = window.innerHeight - NAVBAR_HEIGHT * 2;

  const [isResizing, setIsResizing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const [modalWidth, setModalWidth] = useRecoilState(ModalWidthAtom);
  const [modalHeight, setModalHeight] = useRecoilState(ModalHeightAtom);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        setModalWidth((prevWidth) => {
          const newWidth = prevWidth + (e.clientX - mousePosition.x);
          return Math.min(Math.max(newWidth, minWidth), maxWidth);
        });
        setModalHeight((prevHeight) => {
          const newHeight = prevHeight + (e.clientY - mousePosition.y);
          return Math.min(Math.max(newHeight, minHeight), maxHeight);
        });
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isResizing,
    mousePosition,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    setModalWidth,
    setModalHeight,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(166, 166, 200, 0.2)',
        },
        content: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(166, 166, 200, 0.6)',
          borderRadius: '1rem',
          border: 'none',
          width: `${modalWidth}px`,
          height: `${modalHeight}px`,
          padding: '1rem',
        },
      }}
    >
      {children}
      <div className={styles.resizer} onMouseDown={handleMouseDown}></div>
    </Modal>
  );
};

export default ResizableModal;
