import React from 'react';
import { Handle, HandleProps } from '@xyflow/react';

export default function CustomHandle(props: HandleProps) {
  return (
    <Handle
      style={{
        width: 20,
        height: 20,
        background: 'white',
        border: '2px solid grey',
      }}
      {...props}
    />
  );
}
