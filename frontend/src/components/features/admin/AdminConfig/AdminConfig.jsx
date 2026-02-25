import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useLanguage } from '../../../../context/LanguageContext';
import AdminJury from './AdminJury';
import AdminSponsors from './AdminSponsors';


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
            centered
            sx={{
               '& .MuiTab-root': {
                 color: 'rgba(255,255,255,0.5)', // inactive
                 textTransform: 'none',
                 fontWeight: 500,
               },
               '& .Mui-selected': {
                 color: '#ffffff', // active
               },
            }}
         >
            <Tab label="Jury" value="jury" />
            <Tab label={language === 'fr' ? 'Prix' : 'Awards'} value="awards" />
            <Tab label="Sponsors" value="sponsors" />
            <Tab label="CMS" value="cms" />
         </Tabs>
   
         <Box sx={{ mt: 3 }}>
            {tab === 'jury' && <AdminJury />}
            {tab === 'awards' && <div>Awards content</div>}
            {tab === 'sponsors' && <AdminSponsors />}
            {tab === 'cms' && <div>CMS content</div>}
         </Box>
     </Box>
   );
};

export default AdminConfig;