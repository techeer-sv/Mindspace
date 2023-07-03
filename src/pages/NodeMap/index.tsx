import { useEffect, useRef, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { NodeObject, Node, Context } from '@/utils/types';
import Navbar from '@/components/Navbar';
import Loading from '@/components/Loading';
import Modal from 'react-modal';
import NodeModal from '@/pages/NodeMap/components/Modal';
import { useRecoilState } from 'recoil';
import { nodeAtom } from '@/recoil/state/nodeAtom';
import { useNodeListQuery } from '@/hooks/queries/node';
const NodeMap = () => {
  // eslint-disable-next-line
  const [nodeData, setNodeData] = useState(null);
  const fgRef = useRef<any>();
  const nodeRelSize = 3;
  const nodeVal = 3;

  // modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  Modal.setAppElement('#root');

  // recoil
  const [nodeInfo, setNodeInfo] = useRecoilState(nodeAtom);

  const { data, isLoading, status } = useNodeListQuery();

  const handleClick = (node: NodeObject) => {
    fgRef.current?.centerAt(node.x, node.y, 1000);
    setNodeInfo({ id: node.id, isWritten: node.isWritten, name: node.name });
    setModalIsOpen(true);
  };

  const drawStart = (ctx: Context, node: Node, nodeSize: number) => {
    node.x = node.x || 0;
    node.y = node.y || 0;

    ctx.beginPath();
    ctx.moveTo(node.x + nodeSize, node.y);
    for (let i = 1; i < 5 * 2; i++) {
      const angle = (i * Math.PI) / 5;
      const radius = i % 2 === 0 ? nodeSize : nodeSize * 0.5;
      ctx.lineTo(
        node.x + radius * Math.cos(angle),
        node.y + radius * Math.sin(angle),
      );
    }
    ctx.closePath();
    ctx.fill();
  };

  /**
   * 작성자 : 정태원
   * 날짜 : 4/2
   * 내용 :  "초승달" 모양에 대한 focus조절 이슈로 인해 주석처리 하였습니다.
   * @param ctx
   * @param node
   * @param nodeSize
   */
  const drawCrescent = (ctx: Context, node: Node, nodeSize: number) => {
    node.x = node.x || 0;
    node.y = node.y || 0;

    ctx.beginPath();
    const crescentSize = nodeSize;
    const crescentWidth = crescentSize * 1.1;
    const startAngle = Math.PI / 2.3;
    const endAngle = (3 * Math.PI) / 1.9;
    const centerXOffset = crescentWidth / 4;

    ctx.arc(
      node.x + centerXOffset,
      node.y,
      crescentSize,
      startAngle,
      endAngle,
      false,
    );
    ctx.arc(
      node.x - centerXOffset,
      node.y,
      crescentWidth,
      endAngle,
      startAngle,
      true,
    );
    ctx.closePath();
    ctx.fill();
  };

  const drawCircle = (ctx: Context, node: Node, nodeSize: number) => {
    node.x = node.x || 0;
    node.y = node.y || 0;

    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  };

  const nodeCanvasObject = (node: Node, ctx: Context) => {
    node.connectCount = node.connectCount || 0;
    node.x = node.x || 0;
    node.y = node.y || 0;
    node.name = node.name || '';

    const nodeSize = nodeVal * nodeRelSize * (node.connectCount * 0.2 + 1);

    if (node.isWritten) {
      ctx.fillStyle = 'yellow';
    } else {
      ctx.fillStyle = 'white';
    }

    switch (true) {
      case node.connectCount <= 2:
        drawStart(ctx, node, nodeSize);
        break;
      case node.connectCount >= 3 && node.connectCount < 5:
        drawStart(ctx, node, nodeSize);
        break;
      case node.connectCount >= 5:
        drawCircle(ctx, node, nodeSize);
        break;
      default:
        break;
    }

    ctx.font = '5px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText(node.name, node.x, node.y + nodeSize + 12);
  };

  const handleNodeInfoUpdate = (id: number | string, isWritten: boolean) => {
    const updatedNodeData = {
      nodes: nodeData.nodes.map((node: Node) =>
        node.id === id ? { ...node, isWritten: isWritten } : node,
      ),
      links: nodeData.links,
    };
    setNodeData(updatedNodeData);
  };

  useEffect(() => {
    if (status === 'success') {
      setNodeData(data);
      setTimeout(() => {
        fgRef.current?.d3Force('charge').strength(-500).distanceMax(300);
        fgRef.current?.d3Force('link').distance(70);
      }, 100);

      setTimeout(() => {
        if (fgRef.current) {
          fgRef.current.zoomToFit(1000);
          nodeData.nodes.forEach((node: Node) => {
            node.fx = node.x;
            node.fy = node.y;
          });
        }
      }, 500);
    }
  }, [data, status]);

  return (
    <div>
      <Navbar />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {nodeData && (
            <ForceGraph2D
              ref={fgRef}
              nodeRelSize={nodeRelSize}
              nodeVal={nodeVal}
              nodeCanvasObject={nodeCanvasObject}
              onNodeClick={handleClick}
              graphData={nodeData}
              linkColor={() => 'white'}
              enableNodeDrag={false}
            />
          )}

          {nodeInfo && (
            <>
              <NodeModal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                updateNodeInfo={handleNodeInfoUpdate}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NodeMap;
