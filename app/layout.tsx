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
      <body className='bg-lore-beige'>
        {children}
      </body>
    </html>
  );
}
