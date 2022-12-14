const Product = require('../models/Product');
const Sku = require('../models/Sku');
const paginationHandler = require('../utils/pagination');
const convertToSlug = require('../utils/slug');

const addProduct = async (req, res) => {
  try {
    const { skus, title } = req.body;
    const newProduct = await Product.create({ ...req.body, slug: convertToSlug(title) });
    if (skus) {
      const updatedSku = skus.map((e) => ({ ...e, product: newProduct._id }));
      await Sku.insertMany(updatedSku);
    }
    res.status(200).send({
      message: 'Product Added Successfully!',
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addAllProducts = async (req, res) => {
  try {
    await Product.deleteMany();
    await Product.insertMany(req.body);
    res.status(200).send({
      message: 'Product Added successfully!',
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getShowingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'Show' }).sort({ _id: -1 });
    res.send(products);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getDiscountedProducts = async (req, res) => {
  try {
    const products = await Product.find({ discount: { $gt: 5 } }).sort({
      _id: -1,
    });
    res.send(products);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { sort_by, search_keyword } = req.query;
    const { perPage, pageNo, startIndex } = paginationHandler(req);
    let sort = -1;
    if (sort_by && sort_by === 'highest') {
      sort = -1;
    } else {
      sort = 1;
    }
    query = {
      title: { $regex: search_keyword || '', $options: 'i' },
    };
    const total = await Product.countDocuments({});
    const products = await Product.aggregate([
      {
        $match: query,
      },
      {
        $skip: startIndex,
      },
      {
        $limit: perPage,
      },
      {
        $lookup: {
          from: 'skus',
          localField: '_id',
          foreignField: 'product',
          as: 'skus',
        },
      },
      {
        $lookup: {
          from: 'sellers',
          localField: 'seller',
          foreignField: '_id',
          as: 'seller',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'parentCategory',
          foreignField: '_id',
          as: 'parentCategory',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'childCategory',
          foreignField: '_id',
          as: 'childCategory',
        },
      },
      {
        $addFields: {
          sale_price: {
            $subtract: ['$price', { $divide: [{ $multiply: ['$price', '$discount'] }, 100] }],
          },
        },
      },
      {
        $sort: {
          price: sort,
        },
      },
    ]);
    res.send({ data: products, currentPage: pageNo, totalPages: Math.ceil(total / perPage) });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getStockOutProducts = async (req, res) => {
  try {
    const products = await Product.find({ quantity: { $lt: 1 } }).sort({
      _id: -1,
    });

    res.send(products);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.aggregate([
      {
        $match: { slug: req.params.slug },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: 'skus',
          localField: '_id',
          foreignField: 'product',
          as: 'skus',
        },
      },
      {
        $lookup: {
          from: 'sellers',
          localField: 'seller',
          foreignField: '_id',
          as: 'seller',
        },
      },
      {
        $addFields: {
          sale_price: {
            $subtract: ['$price', { $divide: [{ $multiply: ['$price', '$discount'] }, 100] }],
          },
        },
      },
    ]);
    res.send(product[0]);
  } catch (err) {
    res.status(500).send({
      message: `Slug problem, ${err.message}`,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.sku = req.body.sku;
      product.title = req.body.title;
      product.slug = req.body.slug;
      product.description = req.body.description;
      product.parent = req.body.parent;
      product.children = req.body.children;
      product.type = req.body.type;
      product.unit = req.body.unit;
      product.quantity = req.body.quantity;
      product.originalPrice = req.body.originalPrice;
      product.price = req.body.price;
      product.discount = req.body.discount;
      product.image = req.body.image;
      product.tag = req.body.tag;
      await product.save();
      res.send({ data: product, message: 'Product updated successfully!' });
    }
    // handleProductStock(product);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

const updateStatus = (req, res) => {
  const newStatus = req.body.status;
  Product.updateOne(
    { _id: req.params.id },
    {
      $set: {
        status: newStatus,
      },
    },
    (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: `Product ${newStatus} Successfully!`,
        });
      }
    }
  );
};

const deleteProduct = (req, res) => {
  Product.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: 'Product Deleted Successfully!',
      });
    }
  });
};

module.exports = {
  addProduct,
  addAllProducts,
  getAllProducts,
  getShowingProducts,
  getDiscountedProducts,
  getStockOutProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateStatus,
  deleteProduct,
};
