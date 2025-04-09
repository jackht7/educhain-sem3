'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useContractStore } from '@/store/ContractStore';
import { createContractBuilder } from '@/components/ContractBuilder';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

const Snapflow = () => {
  const router = useRouter();
  const contracts = useContractStore((state) => state.contracts);

  return (
    <>
      <br />
      <div className='container flex justify-between'>
        <h1 className='text-xl font-semibold tracking-tight'>Contracts</h1>
        <Button size='sm' onClick={() => router.push('/contracts/create')}>
          Create Contract
        </Button>
      </div>
      <br />
      <main className='container mx-auto p-4'>
        {contracts.length > 0 ? (
          contracts.map((contract) => (
            <div key={contract.id} className='mb-6'>
              <h2 className='font-medium mb-2 text-gray-700'>
                Contract:{' '}
                <Link
                  href={`https://edu-chain-testnet.blockscout.com/address/${contract.id}?tab=txs`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500'
                >
                  {contract.id}
                </Link>
              </h2>
              {createContractBuilder(contract)()}
            </div>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center min-h-[50vh]'>
            <h1 className='text-2xl font-semibold text-gray-700'>No contracts found</h1>
            <p className='mt-2 text-gray-500'>Create a new contract to get started</p>
          </div>
        )}
        <Toaster />
      </main>
    </>
  );
};

export default Snapflow;
