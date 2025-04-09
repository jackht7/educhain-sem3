'use client';

import Image from 'next/image';

import { useOCAuth } from '@opencampus/ocid-connect-js';
import { Button } from '@/components/ui/button';

export default function OCLoginButton() {
  const { ocAuth } = useOCAuth();

  const handleLogin = async () => {
    try {
      await ocAuth.signInWithRedirect({ state: 'opencampus' });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Button variant='secondary' onClick={handleLogin}>
      <Image src='/oc_logo.svg' alt='' width={35} height={35} priority className='mr-[-5px]' />
      Connect<strong>OCID</strong>
    </Button>
  );
}
