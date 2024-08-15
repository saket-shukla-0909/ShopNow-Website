import express from 'express';
import { authorizeRoles, isAuthenticatedUser } from '../middlewares/auth.js';
import { createProductReview, deleteProduct, deleteReview, getProductDetails, getProductReviews, getProducts, newProduct, updateProduct } from '../controllers/productControllers.js';
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);

router.route("/products/:id").get(getProductDetails);

router.route("/products/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
router.route("/products/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/products/:id").put(isAuthenticatedUser,  createProductReview);
router.route("/products/:id").get(isAuthenticatedUser, getProductReviews);

router.route("/products/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

export default router;