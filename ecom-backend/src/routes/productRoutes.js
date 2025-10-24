const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const { authRequired, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

router.post(
  '/',
  authRequired,
  requireAdmin,
  [
    body('title').notEmpty(),
    body('slug').notEmpty(),
    body('description').notEmpty(),
    body('price').isFloat({ gt: 0 }),
    body('stock').isInt({ min: 0 })
  ],
  productController.createProduct
);

router.put(
  '/:id',
  authRequired,
  requireAdmin,
  [
    body('title').optional().notEmpty(),
    body('slug').optional().notEmpty(),
    body('description').optional().notEmpty(),
    body('price').optional().isFloat({ gt: 0 }),
    body('stock').optional().isInt({ min: 0 })
  ],
  productController.updateProduct
);

router.delete('/:id', authRequired, requireAdmin, productController.deleteProduct);

module.exports = router;
