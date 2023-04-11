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
  placeholder?: string;
  url?: string;
  text?: string;
}

// modal
export interface ModalProps {
  isOpen: boolean;
  onRequestClose: any;
  onClick: any;
  nodeName: string;
  buttonName1?: string;
  buttonName2?: string;
  button2Click: any;
  listOpen: boolean;
  onListClick: any;
  onListRequestClose: any;
}

export interface WriteModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  nodeInfo: Node;
  updateNodeInfo: (id: number | string, isActive: boolean) => void;
}
