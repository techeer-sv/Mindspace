import { ForceGraph2D } from 'react-force-graph';

const NodeMap = () => {
  const myData = {
    nodes: [
      {
        id: 'id1',
        name: 'name1',
        val: 1,
        effect: true,
      },
      {
        id: 'id2',
        name: 'name2',
        val: 10,
        effect: false,
      },
      {
        id: 'id3',
        name: 'name3',
        val: 20,
        effect: true,
      },
      {
        id: 'id4',
        name: 'name4',
        val: 30,
        effect: false,
      },
      {
        id: 'id5',
        name: 'name5',
        val: 30,
        effect: false,
      },
      {
        id: 'id6',
        name: 'name6',
        val: 30,
        effect: true,
      },
    ],
    links: [
      {
        source: 'id1',
        target: 'id2',
      },
      {
        source: 'id2',
        target: 'id4',
      },
      {
        source: 'id2',
        target: 'id5',
      },
    ],
  };

  const handleClick = (node: any) => {
    console.log(node.id, '클릭 됨(향후 팝업창을 띄우기');
  };

  const nodeRelSize = 1; // 노드 크기 상대값
  const nodeVal = 15; // 노드 크기 절대값
  const nodeCanvasObject = (node: any, ctx: any, globalScale: any) => {
    const r = nodeVal / globalScale;
    const starPoints = 5;

    // 노란 별 또는 검정 별 그리기
    if (node.effect) {
      ctx.fillStyle = 'yellow';
    } else {
      ctx.fillStyle = 'white';
    }

    ctx.beginPath();
    ctx.moveTo(node.x + r, node.y);
    for (let i = 1; i < starPoints * 2; i++) {
      const angle = (i * Math.PI) / starPoints;
      const radius = i % 2 === 0 ? r : r * 0.5;
      ctx.lineTo(
        node.x + radius * Math.cos(angle),
        node.y + radius * Math.sin(angle),
      );
    }
    ctx.closePath();
    ctx.fill();

    ctx.font = '5px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white'; // 검정색으로 지정
    ctx.fillText(node.name, node.x, node.y + r + 12);
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
