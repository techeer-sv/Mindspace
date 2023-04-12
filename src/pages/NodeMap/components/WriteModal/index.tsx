import React, { useEffect, useState } from 'react';
import { Editor, Viewer } from '@toast-ui/react-editor';
import Modal from 'react-modal';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import styles from './WriteModal.module.scss';
import { Node } from 'utils/types';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: any;
  nodeInfo: Node;
}

// case1 : 아무런글이 없을떄 -> 글쓰기 버튼만 있어야함
// case1이 아닌 경우에는 api호출을 통해 작성된 글 내용을 불러와야한다.

// case2 : 작성된 글이 있을때 -> 삭제버튼 , 수정버튼이 있어야함
// case3 : 수정버튼을 눌렀을때 -> 취소 , 수정완료 버튼이 있어야함

// props로는 해당 게시글 id, 제목에 대한 데이터가 필요하다. + isActive
// 음.. 근데 isActive보다는 가져온 데이터가 있냐 없냐로 판단하는게 나을까?
// 만약에 글을 작성하고 창을 닫으면 활성화시켜야함
// 즉 어처피 노드상태값을 업데이트할필요가 있다.
// Props로 상태업데이트 하는 함수 보내기
// -> 삭제하면 false, 작성하면 true로 바꿀것

// isEditor변수도 필요할듯..? 해당 변수를 통해 게시글을 작성했는지 아닌지 파악해야하기때문

const WriteModal = ({ isOpen, onRequestClose, nodeInfo }: ModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);

  const [isEditing, setIsEditing] = useState(true);
  const editorRef = React.useRef<any>(null);

  const handleEditorChange = () => {
    setContent(editorRef.current.getInstance().getMarkdown());
  };

  const handleFirstWrite = () => {
    // 처음 글쓰기 api 요청
    console.log('제목: ', title);
    console.log('내용: ', content);
    setIsEditing(false);
  };

  const handleSubmit = () => {
    // 글수정 api요청
    console.log('제목: ', title);
    console.log('내용: ', content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    // 글 삭제 api요청
    console.log('삭제');
    // + isActive 요소 false처리
    onRequestClose();
  };

  useEffect(() => {
    if (nodeInfo?.isActive) {
      // 특정 id에 대한 api호출

      setTitle('Vite란 무엇인가?');
      setContent('Vite란 ~~~');
      setIsEditing(false);
    } else {
      setTitle('');
      setContent('');
      setIsEditing(true);
    }
  }, [isOpen, nodeInfo]);

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
          width: '80vw',
          height: '80vh',
        },
      }}
    >
      {nodeInfo?.isActive ? (
        <>
          <div className={styles.header}>
            <button className={styles.header__button} onClick={onRequestClose}>
              <span className={styles.header__span}>x</span>
            </button>
            <div className={styles.header__left}>
              {isEditing ? (
                <>
                  <button
                    className={styles.header__button}
                    onClick={() => setIsEditing(false)}
                  >
                    취소
                  </button>
                  <button
                    className={styles.header__button}
                    onClick={handleSubmit}
                  >
                    완료
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.header__button}
                    onClick={handleDelete}
                  >
                    삭제
                  </button>
                  <button
                    className={styles.header__button}
                    onClick={() => setIsEditing(true)}
                  >
                    글 수정
                  </button>
                </>
              )}
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.content__title}>
              <input
                disabled={!isEditing}
                type="text"
                placeholder={`[${nodeInfo?.name}] 제목을 입력해주세요`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={styles.content__editor}>
              <div
                className={`${styles.content__editor} ${styles.editor__content}`}
              >
                {isEditing ? (
                  <Editor
                    initialValue={content}
                    onChange={handleEditorChange}
                    previewStyle="tab"
                    height="100%"
                    initialEditType="markdown"
                    usageStatistics={false}
                    ref={editorRef}
                  />
                ) : (
                  <div className={styles.content__viewer}>
                    <Viewer initialValue={content} usageStatistics={false} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.header}>
            <button className={styles.header__button} onClick={onRequestClose}>
              <span className={styles.header__span}>x</span>
            </button>
            <div className={styles.header__left}>
              <button
                className={styles.header__button}
                onClick={handleFirstWrite}
              >
                글 작성
              </button>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.content__title}>
              <input
                disabled={!isEditing}
                type="text"
                placeholder={`[${nodeInfo?.name}] 제목을 입력해주세요`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={styles.content__editor}>
              <div
                className={`${styles.content__editor} ${styles.editor__content}`}
              >
                <Editor
                  initialValue={content}
                  onChange={handleEditorChange}
                  previewStyle="tab"
                  height="100%"
                  initialEditType="markdown"
                  usageStatistics={false}
                  ref={editorRef}
                />
                )
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default WriteModal;
