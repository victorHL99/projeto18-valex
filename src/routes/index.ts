import { Router } from 'express';

import createCard from './createCardRouter.js';

const router = Router();

router.use(createCard);

export default router;