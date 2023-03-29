import { ForceGraph2D } from 'react-force-graph';

const NodeMap = () => {
  const myData = {
    nodes: [
      {
        id: 'id1',
        name: 'name1',
        connect_count: 2,
        isActive: true,
      },
      {
        id: 'id2',
        name: 'name2',
        connect_count: 5,
        isActive: true,
      },
      {
        id: 'id3',
        name: 'name3',
        connect_count: 3,
        isActive: true,
      },
      {
        id: 'id4',
        name: 'name4',
        connect_count: 1,
        isActive: false,
      },
      {
        id: 'id5',
        name: 'name5',
        connect_count: 1,
        isActive: false,
      },
      {
        id: 'id6',
        name: 'name6',
        connect_count: 1,
        isActive: true,
      },
      {
        id: 'id7',
        name: 'name6',
        connect_count: 1,
        isActive: true,
      },
      {
        id: 'id8',
        name: 'name6',
        connect_count: 1,
        isActive: false,
      },
      {
        id: 'id9',
        name: 'name6',
        connect_count: 1,
        isActive: false,
      },
      {
        id: 'id10',
        name: 'name1',
        connect_count: 2,
        isActive: true,
      },
      {
        id: 'id11',
        name: 'name1',
        connect_count: 2,
        isActive: true,
      },
    ],
    links: [
      {
        source: 'id1',
        target: 'id2',
      },
      {
        source: 'id1',
        target: 'id3',
      },
      {
        source: 'id2',
        target: 'id4',
      },
      {
        source: 'id2',
        target: 'id5',
      },
      {
        source: 'id2',
        target: 'id6',
      },
      {
        source: 'id2',
        target: 'id7',
      },
      {
        source: 'id3',
        target: 'id8',
      },
      {
        source: 'id3',
        target: 'id9',
      },
    ],
  };

  const handleClick = (node: any) => {
    console.log(node.id, '클릭 됨(향후 팝업창을 띄우기');
  };

  const nodeRelSize = 3; // 노드 크기 상대값
  const nodeVal = 3; // 노드 크기 절대값

  const nodeCanvasObject = (node: any, ctx: any) => {
    const nodeSize = nodeVal * nodeRelSize * (node.connect_count / 10 + 1);

    if (node.isActive) {
      ctx.fillStyle = 'yellow';
    } else {
      ctx.fillStyle = 'white';
    }

    if (node.connect_count <= 2) {
      // Draw star shape for nodes with connect_count <= 2
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
    } else if (node.connect_count >= 3 && node.connect_count < 5) {
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
    } else if (node.connect_count >= 5) {
      // Draw circle shape for nodes with connect_count >= 5
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
    }

    ctx.font = '5px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText(node.name, node.x, node.y + nodeSize + 12);
  };
  return (
    <ForceGraph2D
      nodeRelSize={nodeRelSize}
      nodeVal={nodeVal}
      nodeCanvasObject={nodeCanvasObject}
      onNodeClick={handleClick}
      graphData={myData}
      linkColor={() => 'white'}
    />
  );
};

export default NodeMap;
