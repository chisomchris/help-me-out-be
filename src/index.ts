import { app, PORT } from './config/config';
import dotenv from 'dotenv'

dotenv.config({ path: ".env" })

const main = async () => {
    app.listen(PORT, () => {
        console.log(`TypeScript with Express 
		http://localhost:${PORT}/`);
    });
}

main()