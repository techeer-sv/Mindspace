export interface APIErrorResponse {
  errorCode: string;
  message: string;
}

// Auth
export interface SignUpRequest {
  userName: string;
  email: string;
  password: string;
}

// TODO : 향후 응답 구조가 수정되면 맞춰서 처리해야합니다 (id가아니라 accessToken을 받아옴)
export interface SignInResponse {
  id: string;
  email: string;
  password: string;
  nickname: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface NicknameResponse {
  nickname: string;
}

// Board
export interface CreateBoardRequest {
  id: number;
  title: string;
  content: string;
}

// CommentView
export interface CreateCommentRequest {
  boardId: number;
  commentId?: number;
  content: string;
}

export interface UpdateCommentRequest {
  commentId: number | undefined;
  content: string | undefined;
  // 쿼리키 초기화를 위해 사용합니다.
  boardId: number;
}

// NodeMap
export type NodeObject = object & {
  id?: number;
  name?: string;
  x?: number;
  y?: number;
  isWritten?: boolean;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
};

export interface Node extends NodeObject {
  name?: string;
  connectCount?: number;
  isWritten?: boolean;
}

interface Link {
  source: Node | number;
  target: Node | number;
  __indexColor?: string;
  __controlPoints?: null;
  index?: number;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

export type Context = CanvasRenderingContext2D;

// Modal
export interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  updateNodeInfo: (id: number | undefined, isWritten: boolean) => void;
}

// CustomModal
export interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  resizable?: boolean;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

// WriteModal
export interface WriteModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  updateNodeInfo: (id: number | undefined, isWritten: boolean) => void;
}

//CommentView
export interface CommentViewProps {
  comment: Comment;
  showRepliesButton: boolean;
  showReplies: boolean;
  toggleReplies: (commentId: number) => void;
  boardId: number;
}

//CommentInput
export interface CommentInputProps {
  boardId: number;
  commentId?: number;
  isEditing: boolean;
  initialComment?: string;
  onEditSuccess?: (editedContent: string) => void;
}

//Button
export interface CommentButtonProps {
  text: string;
  onClick: () => void;
}

export interface BoardResponseDto {
  id: number;
  userNickname: string;
  title: string;
  content: string;
  updatedAt: string;
}

// WriteEditor || ReadViewer
interface ViewEditProps {
  nodeData?: BoardResponseDto;
  onClose: () => void;
  onEditToggle: () => void;
  updateNodeInfo: (id: number | undefined, isWritten: boolean) => void;
}

export interface WriteEditorProps extends ViewEditProps {
  nodeData?: BoardResponseDto;
}

export interface ReadViewerProps extends ViewEditProps {
  nodeData: BoardResponseDto;
}

// ListModal
export interface ListModalProps {
  listModalOpen: boolean;
  onListRequestClose: () => void;
}

//Cursor
interface Cursor {
  count: number;
  afterCursor: number | null;
  beforeCursor: number | null;
}

// CommentView
interface Comment {
  id: number;
  userNickname: string;
  content: string;
  updatedAt: string;
  editable: boolean;
  replies?: Comment[];
}

// CommentData
interface CommentData {
  data: Comment[];
  cursor: Cursor;
}

// CommentModal
export interface CommentModalProps {
  isOpen: boolean;
  initialValue: CommentData;
  boardId: number;
}

// Notification
export interface Notification {
  notification_id: number;
  message: string;
}
