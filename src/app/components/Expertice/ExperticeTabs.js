'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';



export default function ExperticeTabs() {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1', }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                    >
                        <Tab
                            sx={{ color: 'white' }}
                            label="Web Developer"
                            value="1"
                        />
                        <Tab
                            sx={{ color: 'white' }}
                            label="SEO Specialist"
                            value="2"
                        />
                        <Tab
                            sx={{ color: 'white' }}
                            label="Travel & Adventure"
                            value="3"
                        />
                    </TabList>
                </Box>
                <TabPanel value="1" className=''>
                    {/* <Development /> */}
                </TabPanel>
                <TabPanel value="2">
                    {/* <SearchEngine /> */}
                </TabPanel>
                <TabPanel value="3">
                    {/* <TravelGallery /> */}
                </TabPanel>

            </TabContext>
        </Box>
    );
}