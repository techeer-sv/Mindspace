// NodeMap
export type NodeObject = object & {
  id?: string | number;
  name?: string;
  x?: number;
  y?: number;
  isActive?: boolean;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
};

export interface Node extends NodeObject {
  name?: string;
  connect_count?: number;
  isActive?: boolean;
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
  updateNodeInfo: (id: number | string, isActive: boolean) => void;
}

// WirteModal
export interface WriteModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  updateNodeInfo: (id: number | string, isActive: boolean) => void;
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
  error: string;
  message: string;
  status: number;
}
