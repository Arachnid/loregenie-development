import { ReactNode } from 'react';
import './/globals.css';

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang='en'>
      <head />
      <body className='flex flex-col w-full h-screen bg-lore-beige tracking-wide'>
        {children}
      </body>
    </html>
  );
}
