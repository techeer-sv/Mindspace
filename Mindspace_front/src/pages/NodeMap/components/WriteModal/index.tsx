/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { WriteModalProps } from '@/utils/types';
import CustomModal from '@/components/CustomModal';
import { nodeAtom } from '@/recoil/state/nodeAtom';
import { useRecoilValue } from 'recoil';
import { useUserPostGetQuery } from '@/hooks/queries/board';

import WriteEditor from './components/WriteEditor';
import ReadViewer from './components/ReadViewer';

const WriteModal = ({
  isOpen,
  onRequestClose,
  updateNodeInfo,
}: WriteModalProps) => {
  const nodeInfo = useRecoilValue(nodeAtom);
  const [isEditing, setIsEditing] = useState(false);

  const [createPostErrorMessage, setCreatePostErrorMessage] =
    useState<string>('');

  const [deletePostErrorMessage, setDeletePostErrorMessage] =
    useState<string>('');

  useEffect(() => {
    if (createPostErrorMessage) {
      alert(createPostErrorMessage);
      setCreatePostErrorMessage('');
    }
    if (deletePostErrorMessage) {
      alert(deletePostErrorMessage);
      setDeletePostErrorMessage('');
    }
  }, [createPostErrorMessage, deletePostErrorMessage]);

  const { data: postData, isLoading } = useUserPostGetQuery(
    nodeInfo.id as number,
    isOpen,
    nodeInfo?.isWritten,
  );

  const handleClose = () => {
    setIsEditing(false);
    onRequestClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onRequestClose={handleClose}
      resizable
      style={{
        padding: '1rem',
      }}
    >
      {!nodeInfo?.isWritten ? (
        <WriteEditor
          onClose={handleClose}
          onEditToggle={() => setIsEditing((prevState) => !prevState)}
          updateNodeInfo={updateNodeInfo}
        />
      ) : isEditing ? (
        !isLoading && (
          <WriteEditor
            nodeData={postData}
            onClose={handleClose}
            onEditToggle={() => setIsEditing((prevState) => !prevState)}
            updateNodeInfo={updateNodeInfo}
          />
        )
      ) : (
        !isLoading && (
          <ReadViewer
            nodeData={postData}
            onClose={handleClose}
            onEditToggle={() => setIsEditing((prevState) => !prevState)}
            updateNodeInfo={updateNodeInfo}
          />
        )
      )}
    </CustomModal>
  );
};

export default WriteModal;
