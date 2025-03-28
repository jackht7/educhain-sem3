'use client';

import { useRouter } from 'next/navigation';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';
import ConnectButton from '@/components/ConnectButton';

const MenuBar = () => {
  const router = useRouter();

  return (
    <>
      <nav>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Contracts</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => router.push('/contracts/create')}>
                Create New<MenubarShortcut>Ctrl + N</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => router.push('/contracts')}>
                Manage Existing<MenubarShortcut>Ctrl + M</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Agent</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => router.push('/chat')}>
                Chat<MenubarShortcut>Ctrl + A</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          {'\u00A0'}
          <ConnectButton />
        </Menubar>
      </nav>
    </>
  );
};

export { MenuBar };
