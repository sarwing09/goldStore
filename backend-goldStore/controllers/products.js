const fs = require("node:fs");
const Product = require("../models/product");

// Obtener todos los productos con filtros opcionales
exports.getProducts = async (req, res) => {
  try {
    const { categoria, material, minPrice, maxPrice } = req.query;
    const filters = {};

    // Aplicar filtros si están presentes en la consulta
    if (categoria) filters.categoria = categoria;
    if (material) filters.material = material;
    if (minPrice || maxPrice) {
      filters.precioDeCompra = {};
      if (minPrice) filters.precioDeCompra.$gte = parseFloat(minPrice);
      if (maxPrice) filters.precioDeCompra.$lte = parseFloat(maxPrice);
    }

    // Buscar productos con los filtros aplicados
    const products = await Product.find(filters);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un producto por su ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo producto
exports.addProduct = async (req, res) => {
  try {
    // Obtener la ruta de la imagen subida
    const imagePath = req.file ? `http://localhost:4000/uploads/${req.file.originalname}` : null;

    // Crear un nuevo producto con los datos del cuerpo de la solicitud
    const productData = {
      ...req.body,
      picture: imagePath, // Asignar la ruta de la imagen al campo picture
    };

    saveImage(req.file);

    const product = new Product(productData);

    // Guardar el producto en la base de datos
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

function saveImage(file) {
  const newPath = `./uploads/${file.originalname}`;
  fs.renameSync(file.path, newPath);
  return newPath;
}

// Actualizar un producto existente
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Subir imagen
exports.subirImagen = async (req, res) => {
  try {
    const imagePath = req.file ? `http://localhost:4000/uploads/${req.file.originalname}` : null;
    res.status(200).json({ imagePath });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Subir múltiples imágenes
exports.subirImagenes = async (req, res) => {
  try {
    const imagePaths = req.files.map(file => `http://localhost:4000/uploads/${file.originalname}`);
    res.status(200).json({ imagePaths });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
