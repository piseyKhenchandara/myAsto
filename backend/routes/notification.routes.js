// routes/notification.routes.js
import express from 'express';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead
} from '../controllers/notificatoin.controller.js';
import { authenticate } from '../middleware/autheticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();


router.get('/',authenticate,authorizeRoles('seller', 'admin'), getNotifications);


router.patch('/read-all',authenticate,authorizeRoles('seller', 'admin'), markAllAsRead);


router.patch('/:id/read',authenticate,authorizeRoles('seller', 'admin'),markAsRead);

export default router;