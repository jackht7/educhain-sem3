import React from 'react';
import { NodeProps, Node, Position, useReactFlow } from '@xyflow/react';
import { usePathname } from 'next/navigation';
import CustomHandle from './CustomHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components//ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export type JobNode = Node<{
  id: string;
  name?: string;
  description?: string;
}>;

export default function Job(props: NodeProps<JobNode>) {
  const { setNodes } = useReactFlow();
  const pathname = usePathname();
  
  // Disable modal on the create page
  const isCreatePage = pathname?.includes('/contracts/create');

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              name: e.target.value,
            },
          };
        }
        return node;
      })
    );
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              description: e.target.value,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <>
      <Card className='shadow-lg cursor-pointer'>
        <CardHeader>
          <CardTitle>Job</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid w-full items-center gap-4'>
            <div className='flex flex-col space-y-1.5 items-start'>
              <Label htmlFor='name'>Name</Label>
              <Input 
                className='bg-white' 
                id='name' 
                placeholder='Job name' 
                defaultValue={props.data.name} 
                onChange={onNameChange} 
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className='flex flex-col space-y-1.5 items-start'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                className='bg-white'
                rows={5}
                cols={30}
                id='description'
                placeholder='Description...'
                defaultValue={props.data.description}
                onChange={onDescriptionChange}
                style={{ resize: 'none' }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <CustomHandle type='source' position={Position.Right} />
      <CustomHandle type='target' position={Position.Left} />
    </>
  );
}
