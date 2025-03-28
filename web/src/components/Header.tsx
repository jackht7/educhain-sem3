// components/Header.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';

import { MenuBar } from '@/components/HeaderMenu';

export function Header() {
  return (
    <header className='bg-background border-b border-border'>
      <div className='container mx-auto flex items-center justify-between px-4'>
        <Link href='/contracts' className='text-2xl font-bold'>
          <Image src='/snapture_black.svg' alt='Next.js logo' width={104} height={32} priority />
        </Link>
        <MenuBar />
      </div>
    </header>
  );
}
