import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import { Inter } from '@next/font/google'
import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

export default async function Home() {
  const session = await unstable_getServerSession(authOptions);
  return (
    <div className={styles.container}>
      <h1>Lore Genie</h1>
    </div>
  )
}
