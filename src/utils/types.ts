// NodeMap

export type NodeObject = object & {
  id?: string | number;
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