import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();




const PORT = process.env.PORT;

if(!PORT){
    console.log('PORT variable missing');
    process.exit(1);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
