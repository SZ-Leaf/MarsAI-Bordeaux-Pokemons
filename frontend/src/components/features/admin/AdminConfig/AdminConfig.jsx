import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useLanguage } from '../../../../context/LanguageContext';
import AdminJury from './AdminJury';
import AdminAwards from './AdminAwards';
import AdminSponsors from './AdminSponsors';
import AdminCMS from '../AdminCMS/AdminCMS';

const AdminConfig = () => {
   const [tab, setTab] = useState('jury');
   const {language} = useLanguage();
 
   const handleChange = (event, newValue) => {
     setTab(newValue);
   };
 
   return (
     <Box sx={{ width: '100%' }}>
         <Tabs
            value={tab}
            onChange={handleChange}
            aria-label={language === 'fr' ? 'Configuration' : 'Configuration'}
            textColor="secondary"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
               borderBottom: 1, 
               borderColor: 'rgba(255,255,255,0.1)',
               '& .MuiTab-root': {
                 color: 'rgba(255,255,255,0.5)', // inactive
                 textTransform: 'none',
                 fontWeight: 700,
                 fontSize: { xs: '0.75rem', md: '0.875rem' },
                 minWidth: { xs: 'auto', md: 120 },
                 padding: { xs: '12px 16px', md: '12px 24px' },
               },
               '& .Mui-selected': {
                 color: '#ffffff', // active
               },
               '& .MuiTabs-indicator': {
                 backgroundColor: '#3b82f6', // blue-500
               }
            }}
         >
            <Tab label="Jury" value="jury" />
            <Tab label={language === 'fr' ? 'Prix' : 'Awards'} value="awards" />
            <Tab label="Sponsors" value="sponsors" />
            <Tab label="CMS" value="cms" />
         </Tabs>
   
         <Box sx={{ mt: 3 }}>
         {tab === 'jury' && <AdminJury />}
         {tab === 'awards' && <AdminAwards />}
         {tab === 'sponsors' && <AdminSponsors />}
         {tab === 'cms' && <AdminCMS />}
         </Box>
     </Box>
   );
};

export default AdminConfig;