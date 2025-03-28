import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow, type EdgeProps } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function CustomEdge(props: EdgeProps) {
  const { setEdges } = useReactFlow();
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, style } = props;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <Button style={{ pointerEvents: 'all' }} variant='ghost' size='sm' onClick={onEdgeClick}>
            <X color='red' />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
