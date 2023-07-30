// NodeMap
export type NodeObject = object & {
  id?: string | number;
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

// WirteModal
export interface WriteModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  updateNodeInfo: (id: number | string, isWritten: boolean) => void;
}

// ListModal
export interface ListModalProps {
  listModalOpen: boolean;
  onListRequestClose: () => void;
}

//ResizebleModal
export interface ResizableModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

// ErrorResponse
export interface ErrorResponse {
  errorCode: string;
  errorMessage: string;
}
