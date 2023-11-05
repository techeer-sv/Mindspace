"use client";
import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import { NodeObject, Node, Context } from "@/constants/types";
import { useNodeListQuery } from "@/api/hooks/queries/node";
import Loading from "@/components/MoonLoadSpinner";

import { useRecoilState } from "recoil";
import { nodeAtom } from "@/recoil/state/nodeAtom";

const NODE_REL_SIZE = 3;
const NODE_VAL = 3;

const NodeModalLazy = lazy(() => import("./components/Modal"));

export default function MapPage() {
  const [nodeData, setNodeData] = useState<any>(null);
  const fgRef = useRef<any>();

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [isInitialSetupDone, setIsInitialSetupDone] = useState(false);
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
    node.name = node.name || "";

    const nodeSize = NODE_VAL * NODE_REL_SIZE * (node.connectCount * 0.2 + 1);

    if (node.isWritten) {
      ctx.fillStyle = "yellow";
    } else {
      ctx.fillStyle = "white";
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

    ctx.font = "5px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(node.name, node.x, node.y + nodeSize + 12);
  };

  const handleNodeInfoUpdate = (id: number | undefined, isWritten: boolean) => {
    const updatedNodeData = {
      nodes: nodeData.nodes.map((node: Node) =>
        node.id === id ? { ...node, isWritten: isWritten } : node,
      ),
      links: nodeData.links,
    };
    setNodeData(updatedNodeData);
    setNodeInfo({ ...nodeInfo, isWritten: isWritten });
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    // charge : 노드간의 반발력
    // link : 링크 사이의 거리 설정
    const initNodeGraphSetting = () => {
      fgRef.current.d3Force("charge").strength((node: Node) => {
        return -1 * (10 + node.connectCount * 5);
      });
      fgRef.current.d3Force("link").distance(80);

      timeoutId = setTimeout(() => {
        nodeData.nodes.forEach((node: Node) => {
          node.fx = node.x;
          node.fy = node.y;
        });
        fgRef.current.zoomToFit(1000, 100);
        setIsInitialSetupDone(true);
      }, 500);
    };

    if (nodeData && !isInitialSetupDone) {
      initNodeGraphSetting();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [nodeData, isInitialSetupDone]);

  useEffect(() => {
    if (status === "success") {
      setNodeData(data);
    }
  }, [status]);

  return (
    <div>
      {nodeData && (
        <ForceGraph2D
          ref={fgRef}
          nodeRelSize={NODE_REL_SIZE}
          nodeVal={NODE_VAL}
          nodeCanvasObject={nodeCanvasObject}
          onNodeClick={handleClick}
          graphData={nodeData}
          linkColor={() => "white"}
          enableNodeDrag={false}
        />
      )}

      {nodeData && isInitialSetupDone && (
        <Suspense fallback={<div style={{ color: "red" }}>asdasdasd</div>}>
          <NodeModalLazy
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            updateNodeInfo={handleNodeInfoUpdate}
          />
        </Suspense>
      )}
    </div>
  );
}
