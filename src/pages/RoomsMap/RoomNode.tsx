/* eslint-disable max-len */
import React, { useCallback } from 'react';
import { Handle, Node, NodeToolbar, Position, useReactFlow } from '@xyflow/react';
import './RoomNode.css';
import Button from '../../components/Button';


function RoomNode({ id, data }) {
  const flow = useReactFlow();
  const handleDelete = useCallback(() => {
    // const nodes = flow.getNodes();
    flow.setNodes((nodes: Node[]) => nodes.filter((node) => node.id !== id),);
  }, [flow.setNodes]);
  return (
    <>
      <NodeToolbar
        position={Position.Top}
      >
        <Button className="text-green-nr text-base justify-self-center pb-2 mr-1">Edit</Button>
        <Button className="text-green-nr text-base justify-self-center pb-2 ml-1" onClick={handleDelete}>Delete</Button>
      </NodeToolbar>
      <div className="w-[120px] h-[60px] border-2 border-green-nr relative bg-black rounded-xl flex justify-center items-center font-bold text-green-nr font-mono text-[8px] p-1.5">
        <Handle type="source" id={`${id}.left`} position={Position.Left} isValidConnection={() => true} />
        <Handle type="source" id={`${id}.top`} position={Position.Top} isValidConnection={() => true} />
        <div>{data.label}</div>
        <Handle type="source" id={`${id}.right`} position={Position.Right} isValidConnection={() => true} />
        <Handle type="source" id={`${id}.bottom`} position={Position.Bottom} isValidConnection={() => true} />
      </div>
    </>
  );
}

export default RoomNode;
