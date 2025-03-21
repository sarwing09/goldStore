const Stock = require('../models/Stock');

// Obtener el stock de un producto por su ID
exports.getStockByProductId = async (req, res) => {

  try {
    const stock = await Stock.findOne({ productId: req.params.productId });
    if (!stock) {
      return res.status(404).json({ message: 'Stock no encontrado.' });
    }
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar un movimiento de stock
exports.agregarMovimiento = async (req, res) => {
  try {
    const { tipo, cantidad } = req.body;
    let stock = await Stock.findOne({ productId: req.params.productId });

    if (!stock) {
      stock = new Stock({ productId: req.params.productId, cantidad: 0, movimientos: [] });
    }

    // Actualizar la cantidad
    if (tipo === 'entrada') {
      stock.cantidad += cantidad;
    } else if (tipo === 'salida') {
      stock.cantidad -= cantidad;
    }

    // Agregar el movimiento al historial
    stock.movimientos.push({ tipo, cantidad });

    await stock.save();
    res.status(201).json(stock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar la cantidad de stock
exports.actualizarStock = async (req, res) => {
  try {
    const { cantidad } = req.body;
    const stock = await Stock.findOneAndUpdate(
      { productId: req.params.productId },
      { cantidad },
      { new: true }
    );

    if (!stock) {
      return res.status(404).json({ message: 'Stock no encontrado.' });
    }

    res.json(stock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todo el stock
exports.getAllStock = async (req, res) => {
  try {
    const stock = await Stock.find();
    if (stock.length === 0) {
      return res.status(404).json({ message: 'No hay registros de stock disponibles.' });
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
