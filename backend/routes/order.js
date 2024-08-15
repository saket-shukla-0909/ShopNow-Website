import express from "express";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
import { allOrders, deleteOrder, getOrderDetails, myOrders, newOrder, updateOrder } from "../controllers/orderControllers.js";
const router = express.Router();

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').post(isAuthenticatedUser, getOrderDetails);
router.route('/me/orders').post(isAuthenticatedUser, myOrders);
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), allOrders);
router.route('/admin/orders/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder);
router.route('/admin//:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);





export default router;