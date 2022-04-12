import { Launch, Search } from '@mui/icons-material';
import {
  Container, IconButton, Paper, Stack,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';
import TextFieldWithButton from '../../Components/TextFieldWithButton/TextFieldWithButton';

const columns: GridColDef[] = [
  { field: 'plan_name', headerName: 'Plan Name', flex: 1 },
  { field: 'username', headerName: 'Creator', flex: 1 },
  { field: 'description', headerName: 'Description', flex: 5 },
  {
    field: 'open',
    headerName: 'Open',
    sortable: false,
    renderCell: ({ row }) => <IconButton component={Link} to={`/t/published/${encodeURIComponent(row.plan_name)}/${encodeURIComponent(row.username)}`}><Launch /></IconButton>,
  },
];

export interface PlanSearchInfo {
  username: string,
  // eslint-disable-next-line camelcase
  plan_name: string,
  description: string,
}

export default function PlanShare() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<PlanSearchInfo[]>([]);

  const doSearch = () => {
    axios.get<PlanSearchInfo[]>('/plan/search', { params: { s: String(searchText) } })
      .then(({ data }) => {
        setSearchResults(data);
      })
      .catch(() => { });
  };

  useEffect(() => {
    doSearch();
  }, []);

  return (
    <Stack alignItems="center" spacing={2}>
      <NavBar />
      <Container>

        <Stack alignItems="center" spacing={2}>
          <Paper sx={{ width: '100%', maxWidth: '40rem' }}>
            <TextFieldWithButton
              buttonText=""
              label="Search"
              helperText=""
              onChange={(text) => { setSearchText(text); }}
              onClick={doSearch}
              endIcon={<Search />}
              sx={{ width: '100%', maxWidth: '40rem' }}
            />
          </Paper>
          <Paper sx={{ width: '100%' }}>
            <DataGrid
              rows={searchResults}
              columns={columns}
              getRowId={(row) => row.plan_name + row.username}
              autoHeight
              rowCount={20}
              rowsPerPageOptions={[]}
              disableSelectionOnClick
              sx={{ width: '100%' }}
            />
          </Paper>
        </Stack>
      </Container>
    </Stack>
  );
}
