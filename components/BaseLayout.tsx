'use client';

import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

interface Props {
    nav: React.ReactNode;
    children: React.ReactNode;
}

export default function BaseLayout({ nav, children }: Props) {
    return (
        <Grid container spacing={2}>
        <Grid xs={4}>
            <Box sx={{bgcolor: 'background.paper'}}>
                <nav>
                    {nav}
                </nav>
            </Box>
        </Grid>
        <Grid xs={8}>
          {children}
        </Grid>
        </Grid>
    )
}
