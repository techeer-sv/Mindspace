import { useEffect, useRef, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { NodeObject, Node, Context } from 'utils/types';
import Navbar from 'components/Navbar';
import Modal from 'react-modal';
import NodeModal from 'pages/Auth/components/Modal';
import WriteModal from './components/WriteModal';

const NodeMap = () => {
  // eslint-disable-next-line
  const fgRef = useRef<any>();
  const tempNodeData = {
    nodes: [
      {
        id: 1,
        name: 'name1',
        connect_count: 2,
        isActive: true,
      },
      {
        id: 2,
        name: 'name2',
        connect_count: 5,
        isActive: true,
      },
      {
        id: 3,
        name: 'name3',
        connect_count: 3,
        isActive: true,
      },
      {
        id: 4,
        name: 'name4',
        connect_count: 1,
        isActive: false,
      },
      {
        id: 5,
        name: 'name5',
        connect_count: 1,
        isActive: false,
      },
      {
        id: 6,
        name: 'name6',
        connect_count: 1,
        isActive: true,
      },
      {
        id: 7,
        name: 'name6',
        connect_count: 1,
        isActive: true,
      },
      {
        id: 8,
        name: 'name6',
        connect_count: 1,
        isActive: false,
      },
      {
        id: 9,
        name: 'name6',
        connect_count: 1,
        isActive: false,
      },
      {
        id: 10,
        name: 'name1',
        connect_count: 2,
        isActive: true,
      },
      {
        id: 11,
        name: 'name1',
        connect_count: 2,
        isActive: true,
      },
    ],
    links: [
      {
        source: 1,
        target: 2,
      },
      {
        source: 1,
        target: 3,
      },
      {
        source: 2,
        target: 4,
      },
      {
        source: 2,
        target: 5,
      },
      {
        source: 2,
        target: 6,
      },
      {
        source: 2,
        target: 7,
      },
      {
        source: 3,
        target: 8,
      },
      {
        source: 3,
        target: 9,
      },
      {
        source: 10,
        target: 11,
      },
    ],
  };

  const [nodeData, setNodeData] = useState(tempNodeData);

  const nodeRelSize = 3;
  const nodeVal = 3;

  // modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  Modal.setAppElement('#root');

  const handleClick = (node: NodeObject) => {
    fgRef.current?.centerAt(node.x, node.y, 1000);

    setNodeName(node.name);
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
    if (selectedNode === node) {
      node.fx = node.x;
      node.fy = node.y;
    }
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
      nodes: nodeData.nodes.map((node) =>
        node.id === id ? { ...node, isActive: isActive } : node,
      ),
      links: nodeData.links,
    };
    setNodeData(updatedNodeData);
  };

  useEffect(() => {
    setTimeout(() => {
      fgRef.current?.d3Force('charge').strength(-500).distanceMax(300);
      fgRef.current?.d3Force('link').distance(70);
    }, 10);

    setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.zoomToFit(1000);
      }
    }, 300);
  }, [nodeData.links]);

  return (
    <div>
      <Navbar />
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
      {selectedNode && (
        <>
          <NodeModal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            onClick={() => setModalIsOpen(false)}
            nodeName={nodeName}
            buttonName1="작성"
            buttonName2="조회"
            selectedNodeInfo={selectedNode}
            updateNodeInfo={handleNodeInfoUpdate}
          />
        </>
      )}
    </div>
  );
};

export default NodeMap;
