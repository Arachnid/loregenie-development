'use client';

import { Setting } from '@/types';
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Link from 'next/link';

type Props = {
  settings: Setting[];
};

const SettingsList = ({ settings }: Props) => {
  return (
    <List
      disablePadding
      subheader={
        <ListSubheader>
          Settings
          <Link href='/setting/new'>
            <AddIcon />
          </Link>
        </ListSubheader>
      }
    >
      {settings.map((setting: Setting, index) => {
        return (
          <ListItem key={index}>
            <ListItemButton component={Link} href={`/setting/${setting.id}`}>
              <ListItemText primary={setting.name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default SettingsList;
