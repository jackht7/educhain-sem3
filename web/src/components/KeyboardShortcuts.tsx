'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

export function KeyboardShortcuts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  // Check if current path starts with /auth/
  const isAuthPage = pathname?.startsWith('/auth/');

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  const router = useRouter();

  useEffect(() => {
    // Don't add the event listener if we're on an auth page
    if (isAuthPage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.key && !event.ctrlKey) return;

      const ctrlKey = event.ctrlKey;
      const key = event.key.toLowerCase();
      if (ctrlKey && key === 'n') {
        event.preventDefault();
        router.push('/contracts/create');
      }
      if (ctrlKey && key === 'm') {
        event.preventDefault();
        router.push('/contracts');
      }
      if (ctrlKey && key === 'a') {
        event.preventDefault();
        router.push('/chat');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleModal, isAuthPage]);

  // Don't render the modal if we're on an auth page
  // if (isAuthPage) return null;

  // return isModalOpen ? (
  //   <CreateNewProject isOpen={isModalOpen} onClose={toggleModal} />
  // ) : null;
}
