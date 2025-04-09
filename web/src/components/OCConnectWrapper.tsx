'use client';

import { ReactNode } from 'react';
import { OCConnect } from '@opencampus/ocid-connect-js';

export default function OCConnectWrapper({ children, opts, sandboxMode }: Readonly<{ children: ReactNode; opts: unknown; sandboxMode: boolean }>) {
  return (
    <OCConnect opts={opts} sandboxMode={sandboxMode}>
      {children}
    </OCConnect>
  );
}
