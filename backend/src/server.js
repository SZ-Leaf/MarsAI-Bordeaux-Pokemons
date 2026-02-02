import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();




const PORT = process.env.PORT;

if(!PORT){
    console.log('PORT variable missing');
    process.exit(1);
}

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});
