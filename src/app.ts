import express from 'express';
import cors from 'cors';
import 'express-async-errors';

//imports from src/middlewares
import handleError from './middlewares/errorHandlerMiddleware.js';

//imports from src/routes
import router from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router)
app.use(handleError);

export default app;