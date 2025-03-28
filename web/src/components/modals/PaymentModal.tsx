import React from 'react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Label } from '@/components/ui/label';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    amount?: number;
    id?: string;
    workflowAddress?: string;
  };
}

const PaymentModal = ({ isOpen, onClose, data }: PaymentModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className='bg-[#FFFFFF] p-4 rounded-lg shadow-lg max-w-[95vw] max-h-[95vh] w-[500px] flex flex-col'
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-black text-xl font-semibold'>Payment Details</h2>
              <Button onClick={onClose} variant='ghost'>
                ✖
              </Button>
            </div>

            {/* Content */}
            <div className='flex-1 overflow-y-auto [&_label]:text-black'>
              <div className='space-y-4'>
                <div className='flex items-center justify-center mb-6'>
                  <div className='text-center'>
                    <div className='text-sm text-gray-500'>Amount</div>
                    <div className='text-3xl font-bold text-gray-900'>${data.amount || 0}</div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='status'>Status</Label>
                  <div className='px-3 py-2 bg-amber-100 text-amber-800 rounded-md font-medium'>Pending</div>
                </div>

                <div className='grid grid-cols-2 gap-4 mt-4'>
                  <div>
                    <Label className='text-sm text-gray-500'>Invoice Number</Label>
                    <div className='font-medium'>INV-{Math.floor(Math.random() * 10000)}</div>
                  </div>
                  <div>
                    <Label className='text-sm text-gray-500'>Due Date</Label>
                    <div className='font-medium'>{new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className='space-y-2 mt-4'>
                  <Label>Actions</Label>
                  <div className='flex gap-2'>
                    <Button className='bg-blue-600 hover:bg-blue-700'>Send Invoice</Button>
                    <Button className='bg-green-600 hover:bg-green-700'>Mark Paid</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className='pt-4 mt-4 border-t flex justify-end'>
              <Button onClick={onClose} className='bg-neutral-900'>
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
