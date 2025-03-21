const { Router } = require('express');
const stockController = require('../controllers/stock');

const router = Router();

// Obtener todo el stock
router.get('/', stockController.getAllStock);

// Obtener el stock de un producto por su ID
router.get('/products/:productId', stockController.getStockByProductId);

// Agregar un movimiento de stock
router.post('/products/:productId/movimientos', stockController.agregarMovimiento);

// Actualizar la cantidad de stock
router.put('/products/:productId', stockController.actualizarStock);

module.exports = router;
