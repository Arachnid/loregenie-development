'use client';

import { Entry, World } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import AlertDialog from '@/components/AlertDialog';
import PageHeader from '@/components/PageHeader';
import ParentDropDown from '@/components/entry/ParentDropDown';
import CategoryDropDown from '@/components/entry/CategoryDropDown';
import ImageSettings from '@/components/ImageSettings';

interface Props {
  currentEntry: Entry;
  world: World;
  entries: Entry[];
  permissions: string[];
}

const ClientEntryPage = ({
  currentEntry,
  world,
  entries,
  permissions,
}: Props) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [parentDropDownOpen, setParentDropDownOpen] = useState(false);
  const [categoryDropDownOpen, setCategoryDropDownOpen] = useState(false);
  const [entryData, setEntryData] = useState<Entry>(currentEntry);
  const [editDescription, setEditDescription] = useState(false);
  const [editImage, setEditImage] = useState(false);

  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/entry/delete', {
        method: 'POST',
        body: JSON.stringify({
          entryID: currentEntry.id,
          worldID: world.id,
          permissions,
        }),
      });
      router.push(`/world/${world.id}`);
      router.refresh();
    } catch (error) {
      console.log('error deleting entry: ', error);
    }
  };

  return (
    <div className='flex flex-col w-full h-full mb-12'>
      <PageHeader
        entryData={entryData}
        permissions={permissions}
        worldID={world.id}
      />
      <div className='flex flex-col items-start h-full gap-10 px-16 py-6 overflow-y-scroll bg-white isolate scrollbar-hide'>
        <div className='flex items-start self-stretch gap-6 h-[170px] min-w-max'>
          <div className='flex flex-col items-start gap-4 p-6 rounded-lg grow bg-lore-beige-400'>
            <div className='flex items-center self-stretch gap-4'>
              <p className='font-medium w-14'>Parent</p>
              <div className='relative flex flex-col items-center self-stretch w-full gap-4'>
                <button
                  className='flex items-center justify-center w-full gap-2 px-4 py-3 bg-white rounded-lg cursor-pointer h-11 disabled:cursor-default'
                  onClick={() => setParentDropDownOpen(!parentDropDownOpen)}
                  disabled={!permissions.includes('writer')}
                >
                  <p className='flex grow'>
                    {entryData.parent ? entryData.parent.name : world.name}
                  </p>
                  {permissions.includes('writer') &&
                    (parentDropDownOpen ? (
                      <span className='text-[20px] material-icons'>
                        expand_less
                      </span>
                    ) : (
                      <span className='text-[20px] material-icons'>
                        expand_more
                      </span>
                    ))}
                </button>
                {parentDropDownOpen && (
                  <ParentDropDown
                    {...{
                      world,
                      entries,
                      setParentDropDownOpen,
                      setEntryData,
                      entryData,
                    }}
                  />
                )}
              </div>
            </div>
            <div className='bg-lore-beige-500 h-[2px] self-stretch' />
            <div className='flex items-center self-stretch gap-4'>
              <p className='font-medium w-14'>Type</p>
              <div className='relative flex flex-col items-center self-stretch w-full gap-4'>
                <button
                  className='flex items-center justify-center w-full gap-2 px-4 py-3 bg-white rounded-lg cursor-pointer h-11 disabled:cursor-default'
                  onClick={() => setCategoryDropDownOpen(!categoryDropDownOpen)}
                  disabled={!permissions.includes('writer')}
                >
                  <p className='flex grow'>
                    {entryData.category ? entryData.category : 'Select one'}
                  </p>
                  {permissions.includes('writer') &&
                    (categoryDropDownOpen ? (
                      <span className='text-[20px] material-icons'>
                        expand_less
                      </span>
                    ) : (
                      <span className='text-[20px] material-icons'>
                        expand_more
                      </span>
                    ))}
                </button>
                {categoryDropDownOpen && (
                  <CategoryDropDown
                    {...{ setCategoryDropDownOpen, setEntryData, entryData }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className='relative w-[170px] h-full rounded-lg bg-lore-beige-400'>
            <div className='absolute flex bottom-2 right-2'>
              {editImage && (
                <ImageSettings
                  showRemoveButton={Boolean(entryData.image)}
                  data={entryData}
                  setData={setEntryData}
                  setOpen={setEditImage}
                />
              )}
              {permissions.includes('writer') && (
                <button
                  className='flex items-center justify-center gap-2 p-3 transition-all duration-300 ease-out rounded-full w-11 h-11 bg-lore-red-400 hover:bg-lore-red-500'
                  onClick={() => setEditImage(!editImage)}
                >
                  <span className='text-[20px] text-white material-icons'>
                    more_vert
                  </span>
                </button>
              )}
            </div>
            {entryData.image && (
              <img
                className='object-cover w-full h-full rounded-lg'
                src={entryData.image}
                alt=''
              />
            )}
          </div>
        </div>
        <input
          className='flex text-[40px] font-bold w-full placeholder:text-black/50 focus-visible:outline-none disabled:bg-white disabled:cursor-text'
          value={entryData.name}
          placeholder='Title'
          onChange={(e) => setEntryData({ ...entryData, name: e.target.value })}
          disabled={!permissions.includes('writer')}
        />
        {permissions.includes('writer') && (
          <button
            className='p-2 text-white rounded bg-lore-red-400'
            onClick={() => setEditDescription(!editDescription)}
          >
            {editDescription ? 'save description' : 'edit description'}
          </button>
        )}
        {editDescription ? (
          <textarea
            className='w-full h-full'
            value={entryData.description}
            placeholder='Description'
            onChange={(e) =>
              setEntryData({ ...entryData, description: e.target.value })
            }
          />
        ) : (
          <ReactMarkdown
            className='markdown'
            children={entryData.description}
          />
        )}
        {permissions.includes('admin') && (
          <button
            className='p-2 text-white rounded bg-lore-red-400'
            onClick={() => setAlertOpen(true)}
          >
            Delete Entry
          </button>
        )}
        {alertOpen && (
          <AlertDialog
            title={`Delete ${currentEntry.name}?`}
            alertOpen={alertOpen}
            setAlertOpen={setAlertOpen}
            action={onDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ClientEntryPage;
