import JournalEntryForm from '@/components/journalEntry/JournalEntryForm';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    worldID: string;
    campaignID: string;
  };
}

export default async function NewJournalEntryPage({ params }: Props) {
  const session = await unstable_getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  return (
    <>
      <h1>Create New Journal Entry</h1>
      <JournalEntryForm worldID={params.worldID} campaignID={params.campaignID} />
    </>
  );
}
