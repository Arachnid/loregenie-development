'use client';

import { Campaign, Entry } from '@/types';
import { getActiveID } from '@/utils/getActiveID';
import { getIcon } from '@/utils/getIcon';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  children: JSX.Element;
  entries: Entry[];
  campaigns: Campaign[];
  worldID: string;
  permissions: string[];
}

interface FilteredSearch {
  id: string;
  name: string;
  category: string;
  url: string;
}

const ClientEntriesNav = ({
  children,
  entries,
  campaigns,
  worldID,
  permissions,
}: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredSearch, setFilteredSearch] = useState<FilteredSearch[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const activeID = getActiveID(pathname);

  const unFilteredSearch = (): {
    id: string;
    name: string;
    category: string;
    url: string;
  }[] => {
    const result: {
      id: string;
      name: string;
      category: string;
      url: string;
    }[] = [];
    entries.map((entry) =>
      result.push({
        id: entry.id,
        name: entry.name,
        category: entry.category,
        url: `/world/${worldID}/entry/${entry.id}`,
      })
    );
    campaigns.map((campaign) =>
      result.push({
        id: campaign.id,
        name: campaign.name,
        category: 'Campaign',
        url: `/world/${worldID}/campaign/${campaign.id}`,
      })
    );
    campaigns.map((campaign) =>
      campaign.entries.map((campaignEntry) =>
        result.push({
          id: campaignEntry.id,
          name: campaignEntry.name,
          category: campaignEntry.category,
          url: `/world/${worldID}/campaign/${campaign.id}/entry/${campaignEntry.id}`,
        })
      )
    );
    return result;
  };

  useEffect(() => {
    const filterSearch = unFilteredSearch().filter((element) => {
      if (element.name.toLowerCase().includes(searchValue.toLowerCase())) {
        return element;
      }
    });
    setFilteredSearch(filterSearch);
  }, [searchValue]);

  return (
    <div className='w-full'>
      <div className='flex flex-col h-full justify-between'>
        <div className='flex justify-between items-center bg-white py-[18px] px-4 gap-2 self-stretch mb-[2px] text-lore-blue'>
          <input
            className='grow font-light leading-5 placeholder:text-lore-blue focus-visible:outline-none'
            placeholder='Search'
            type='search'
            autoComplete='off'
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          {searchValue ? (
            <span
              className='material-icons cursor-pointer'
              onClick={() => setSearchValue('')}
            >
              close
            </span>
          ) : (
            <span className='material-icons-outlined'>search</span>
          )}
        </div>
        {searchValue ? (
          <div className='bg-lore-light-beige p-4 gap-4 text-lore-blue overflow-y-scroll scrollbar-hide h-full'>
            {filteredSearch.map((element) => (
              <button
                className={`flex items-center p-2  gap-2 self-stretch ${
                  element.id === activeID && 'text-lore-red'
                }`}
                onClick={() => router.push(element.url)}
              >
                {getIcon(
                  element.category,
                  'material-icons-outlined text-[20px]'
                )}
                <div className='flex font-medium leading-5 grow'>
                  {element.name}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className='bg-lore-light-beige p-4 gap-4 overflow-y-scroll scrollbar-hide h-full'>
            {children}
          </div>
        )}
        <div className='absolute bottom-20'>
          {permissions.includes('writer') && (
            <div>
              <Link href={`/world/${worldID}/entry/new`}>New Entry</Link>
              <br />
              <Link href={`/world/${worldID}/campaign/new`}>New Campaign</Link>
            </div>
          )}
        </div>
        <div className='flex bg-lore-light-beige'>
          <button
            className='flex justify-center items-center text-white w-full py-3 px-4 m-4 gap-2 rounded-lg bg-lore-red'
            onClick={() => router.push(`/world/${worldID}/page/generate`)}
          >
            <span className='text-[20px] material-icons'>add</span>
            <div className='text-[16px] font-medium'>Create new page</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientEntriesNav;
