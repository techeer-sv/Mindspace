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

// Auth
export interface FormBoxProps {
  type?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  url?: string;
  text?: string;
}

export interface FormButtonProps {
  clickAction?: () => void;
  text?: string;
}

// Modal
export interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  updateNodeInfo: (id: number | string, isWritten: boolean) => void;
}

// WriteModal
export interface WriteModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  updateNodeInfo: (id: number | string, isWritten: boolean) => void;
}

export interface BoardResponseDto {
  id: number;
  userNickname: string;
  title: string;
  content: string;
  updatedAt: string;
}

// WriteEditor || ReadViewer
export interface ViewEditProps {
  nodeData?: BoardResponseDto;
  onClose: () => void;
  onEditToggle: () => void;
  updateNodeInfo: (id: number | undefined, isWritten: boolean) => void;
}

// ListModal
export interface ListModalProps {
  listModalOpen: boolean;
  onListRequestClose: () => void;
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

// Comment
interface Comment {
  id: number;
  nickname: string;
  content: string;
  date: string;
}

// CommentModal
export interface CommentModalProps {
  isOpen: boolean;
  initialValue: Comment[];
}

// ErrorResponse
export interface ErrorResponse {
  errorCode: string;
  errorMessage: string;
}
