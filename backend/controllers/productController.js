const Product = require('../models/Product');

const buildProductQuery = (query) => {
  const filter = {};

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { brand: { $regex: query.search, $options: 'i' } },
      { category: { $regex: query.search, $options: 'i' } },
      { tags: { $regex: query.search, $options: 'i' } }
    ];
  }

  if (query.category && query.category !== 'All') filter.category = query.category;
  if (query.brand && query.brand !== 'All') filter.brand = query.brand;
  if (query.gender && query.gender !== 'All') filter.gender = query.gender;
  if (query.size && query.size !== 'All') filter.sizes = query.size;

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  return filter;
};

const buildSort = (sort) => {
  switch (sort) {
    case 'price-asc':
      return { price: 1 };
    case 'price-desc':
      return { price: -1 };
    case 'rating':
      return { rating: -1 };
    case 'popular':
      return { soldCount: -1 };
    case 'latest':
    default:
      return { createdAt: -1 };
  }
};

const getProducts = async (req, res) => {
  try {
    const filter = buildProductQuery(req.query);
    const sort = buildSort(req.query.sort);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter)
    ]);

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid product id' });
  }
};

const getProductMeta = async (req, res) => {
  try {
    const [categories, brands, genders, sizes] = await Promise.all([
      Product.distinct('category'),
      Product.distinct('brand'),
      Product.distinct('gender'),
      Product.distinct('sizes')
    ]);

    res.json({
      success: true,
      data: {
        categories: categories.sort(),
        brands: brands.sort(),
        genders: genders.sort(),
        sizes: sizes.filter(Boolean).sort()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductMeta
};
