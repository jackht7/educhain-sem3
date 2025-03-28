import { create } from 'zustand';
import { type Edge, type Node } from '@xyflow/react';

export type Contract = {
  id: string;
  nodes: Node[];
  edges: Edge[];
};

interface ContractState {
  contracts: Contract[];
  addContract: (contract: Contract) => void;
  removeContract: (contractId: string) => void;
  clearContracts: () => void;
}

export const useContractStore = create<ContractState>((set) => ({
  contracts: [],
  addContract: (contract) =>
    set((state) => ({
      contracts: [...state.contracts, contract],
    })),
  removeContract: (contractId) =>
    set((state) => ({
      contracts: state.contracts.filter((contract) => contract.id !== contractId),
    })),
  clearContracts: () => set({ contracts: [] }),
}));
