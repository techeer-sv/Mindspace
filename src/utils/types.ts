// NodeMap
export type NodeObject = object & {
  id?: string | number;
  name?: string;
  x?: number;
  y?: number;
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
  placeholder?: string;
  url?: string;
  text?: string;
}

// Modal
export interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  selectedNodeInfo: Node;
  updateNodeInfo: (id: number | string, isActive: boolean) => void;
}

// WirteModal
export interface WriteModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  nodeInfo: Node;
  updateNodeInfo: (id: number | string, isActive: boolean) => void;
}

// ListModal
export interface ListModalProps {
  listModalOpen: boolean;
  onListRequestClose: () => void;
}
