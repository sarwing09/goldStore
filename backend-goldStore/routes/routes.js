const { Router } = require('express');
const multer = require('multer');
const { 
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  subirImagen,
  subirImagenes
} = require('../controllers/products');

const upload = multer({ dest: 'uploads/' });
const router = Router();

// Productos
router.post('/agregar', upload.single('image'), addProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Imágenes
router.post('/images/single', upload.single('image'), subirImagen);
router.post('/images/multi', upload.array('image', 10), subirImagenes);

module.exports = router;
