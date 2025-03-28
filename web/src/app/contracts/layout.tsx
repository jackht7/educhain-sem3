import { Header } from '@/components/Header';

export default function SnapflowLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header /> {children}
    </>
  );
}
