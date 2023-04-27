import { useEffect, useRef, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { NodeObject, Node, Context } from 'utils/types';
import Navbar from 'components/Navbar';
import Loading from 'components/Loading';
import Modal from 'react-modal';
import NodeModal from 'pages/NodeMap/components/Modal';
import { getNodeList } from 'api/Node';

const NodeMap = () => {
  // eslint-disable-next-line

  const [initialLoad, setInitialLoad] = useState(true);
  const fgRef = useRef<any>();
  const [nodeData, setNodeData] = useState(null);
  const nodeRelSize = 3;
  const nodeVal = 3;

  // modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  Modal.setAppElement('#root');

  const handleClick = (node: NodeObject) => {
    fgRef.current?.centerAt(node.x, node.y, 1000);
    setSelectedNode(node);
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
    node.connect_count = node.connect_count || 0;
    node.x = node.x || 0;
    node.y = node.y || 0;
    node.name = node.name || '';

    const nodeSize = nodeVal * nodeRelSize * (node.connect_count * 0.2 + 1);

    if (node.isActive) {
      ctx.fillStyle = 'yellow';
    } else {
      ctx.fillStyle = 'white';
    }

    switch (true) {
      case node.connect_count <= 2:
        drawStart(ctx, node, nodeSize);
        break;
      case node.connect_count >= 3 && node.connect_count < 5:
        drawStart(ctx, node, nodeSize);
        break;
      case node.connect_count >= 5:
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

  const handleNodeInfoUpdate = (id: number | string, isActive: boolean) => {
    const updatedNodeData = {
      nodes: nodeData.nodes.map((node: Node) =>
        node.id === id ? { ...node, isActive: isActive } : node,
      ),
      links: nodeData.links,
    };
    setNodeData(updatedNodeData);
  };

  useEffect(() => {
    if (initialLoad && nodeData) {
      setTimeout(() => {
        fgRef.current?.d3Force('charge').strength(-500).distanceMax(300);
        fgRef.current?.d3Force('link').distance(70);
      }, 10);

      setTimeout(() => {
        if (fgRef.current) {
          fgRef.current.zoomToFit(1000);
          nodeData.nodes.forEach((node: Node) => {
            node.fx = node.x;
            node.fy = node.y;
          });
        }
        setInitialLoad(false);
      }, 300);
    }
  }, [nodeData, initialLoad]);

  useEffect(() => {
    const fetchNodeList = async () => {
      setNodeData(await getNodeList());
      setInitialLoad(true);
    };
    fetchNodeList();
  }, []);

  return (
    <div>
      <Navbar />
      {nodeData ? (
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
      ) : (
        <Loading />
      )}

      {selectedNode && (
        <>
          <NodeModal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            selectedNodeInfo={selectedNode}
            updateNodeInfo={handleNodeInfoUpdate}
          />
        </>
      )}
    </div>
  );
};

export default NodeMap;