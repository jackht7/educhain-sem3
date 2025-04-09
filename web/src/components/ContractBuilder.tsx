import React, { useState, useCallback } from 'react';
import { ReactFlow, Background, Node, NodeMouseHandler } from '@xyflow/react';
import { Contract } from '@/store/ContractStore';
import JobModal from './modals/JobModal';
import PaymentModal from './modals/PaymentModal';

import '@xyflow/react/dist/style.css';

export function createContractBuilder(contract: Contract) {
  const { id: workflowAddress, nodes, edges } = contract;

  return function ContractBuilder() {
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
      event.preventDefault();
      setSelectedNode(node);

      // Determine which modal to open based on node type
      const nodeType = (node.type || '').toLowerCase();
      const nodeData = node.data || {};

      // Check if it's a payment node first
      if (
        nodeType.includes('payment') ||
        typeof nodeData.amount !== 'undefined' ||
        (nodeData.type && String(nodeData.type).toLowerCase().includes('payment'))
      ) {
        setIsPaymentModalOpen(true);
      }
      // If not a payment node, treat as job node
      else {
        setIsJobModalOpen(true);
      }
    }, []);

    const closeModals = () => {
      setIsJobModalOpen(false);
      setIsPaymentModalOpen(false);
      setSelectedNode(null);
    };

    return (
      <div
        style={{
          width: '100%', // full width of the container
          height: '100px', // increased height to make nodes more visible
          backgroundColor: '#fafaf9',
          marginBottom: '1rem', // spacing between contracts
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          draggable={false}
          panOnDrag={false}
          edgesFocusable={false}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={true}
          zoomOnScroll={true}
          zoomOnDoubleClick={false}
          onNodeClick={onNodeClick}
          // fitView={true}
          minZoom={0.5}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          className='react-flow-container'
          style={{ background: '#fafaf9' }}
          defaultViewport={{ x: 10, y: 20, zoom: 1 }}
        >
          <Background color='#aaa' gap={16} />
        </ReactFlow>

        {/* Job Modal */}
        <JobModal
          isOpen={isJobModalOpen}
          onClose={closeModals}
          data={{
            name: String(selectedNode?.data?.name || selectedNode?.data?.label || ''),
            description: String(selectedNode?.data?.description || ''),
            id: selectedNode?.id ? String(selectedNode?.id) : undefined,
            workflowAddress,
          }}
        />

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closeModals}
          data={{
            amount: Number(selectedNode?.data?.amount || 0),
            id: selectedNode?.id ? String(selectedNode?.id) : undefined,
            workflowAddress,
          }}
        />
      </div>
    );
  };
}
