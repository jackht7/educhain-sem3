'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import { v4 as uuidv4 } from 'uuid';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, BackgroundVariant, Connection, Position } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';

import { useEthersSigner } from '@/app/hooks/useEthersSigner';
import { useContractStore } from '@/store/ContractStore';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import Job from './Job';
import Payment from './Payment';
import CustomEdge from './CustomEdge';
import Menu from './Menu';
import { Workflow__factory } from '../../../typechain';

import '@xyflow/react/dist/style.css';

const nodeTypes = {
  job: Job,
  payment: Payment,
  menu: Menu,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

// TODO: Add sidebar to add new nodes
const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: -80 }, type: 'menu', data: {} },
  { id: '2', position: { x: 0, y: 0 }, type: 'job', data: { label: 'Job', name: 'job-1' } },
];
const initialEdges: Edge[] = [];

export function Builder() {
  const { address, chainId } = useAccount();
  const signer = useEthersSigner();
  const router = useRouter();
  const contracts = useContractStore((state) => state.contracts);
  const addContract = useContractStore((state) => state.addContract);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge: Edge = { ...connection, animated: true, id: `${edges.length + 1}`, type: 'customEdge' };
      setEdges((prevEdge) => addEdge(edge, prevEdge));
    },
    [edges.length, setEdges]
  );

  const onCreate = async () => {
    try {
      setIsCreating(true);

      const scaleFactor = 0.5;

      const contractNodes = nodes
        .filter((node) => node.type !== 'menu')
        .map(({ type, position, ...rest }) => ({
          ...rest,
          position: {
            x: position.x * scaleFactor,
            y: position.y * scaleFactor,
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        }));
      const contractEdges = edges.map(({ type, ...rest }) => rest);

      // TODO: Create contract based on actual nodes
      const paymentNode = contractNodes.filter((node) => node.data.label === 'payment')[0];
      const amount: number = (paymentNode?.data.amount as number) || 0;
      const contractAddress = await createContract(amount);
      addContract({ id: contractAddress!, nodes: contractNodes, edges: contractEdges });
      toast.success(`Contract has been created successfully`);
      router.push('/contracts');
    } catch (error) {
      console.error('Error creating contract:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const onBack = () => {
    router.push('/contracts');
  };

  const createContract = async (amount: number) => {
    if (!signer?.address) return;

    try {
      const workflowFactory = new Workflow__factory(signer);
      const deployedContract = await workflowFactory.deploy(process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ?? '');
      const contractAddress = await deployedContract.getAddress();
      console.log('Contract deployed at:', contractAddress);
      return contractAddress;
    } catch (error) {
      console.error('Error deploying contract:', error);
    }
  };

  return (
    <>
      <br />
      <div className='container flex justify-between'>
        <h1 className='text-xl font-semibold tracking-tight'>New Contract</h1>
        <div className='space-x-2'>
          <Button size='sm' variant='outline' onClick={onBack}>
            Back
          </Button>

          <Button size='sm' onClick={onCreate} disabled={isCreating}>
            {isCreating && <Loader2 className='animate-spin' />}Create
          </Button>
        </div>
      </div>

      <div className='container mx-auto space-y-4 p-4'>
        <div style={{ width: '100%', height: '70vh' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultViewport={{ x: 100, y: 100, zoom: 0.7 }}
          >
            <Controls />
            <MiniMap />
            <Background bgColor='#fafaf9' variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
      <Toaster />
    </>
  );
}
