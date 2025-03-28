'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import { useAccount } from 'wagmi';

const Home = () => {
  // const { address, isConnected } = useAccount();
  const router = useRouter();
  useEffect(() => {
    router.push('/auth/login')
    const handleKeyDown = (event: { ctrlKey: any; key: string; preventDefault: () => void; }) => {
      if (event.ctrlKey && event.key.toLowerCase() === "n") {
        event.preventDefault();
        router.push('/contracts/create');
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
    // isConnected && address
    //   ? router.push('/contracts')
    //   : router.push('/auth/login');
  // }, [isConnected, address, router]);
  return <></>;
};

export default Home;

function toggleModal() {
  throw new Error('Function not implemented.');
}
