"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const r2config_1 = require("../config/r2config");
const category_model_1 = __importDefault(require("../models/category.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, category, stock, images, colors, sizes } = req.body;
    const files = req.files;
    try {
        if (!name || !description || !price || !category || !stock) {
            res.status(400).json({ message: "Please enter all fields" });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(category)) {
            res.status(400).json({ message: "Invalid category ID" });
            return;
        }
        const existingCategory = yield category_model_1.default.findById(category);
        if (!existingCategory) {
            res.status(400).json({ message: "Category does not exist in store" });
            return;
        }
        const existingProduct = yield product_model_1.default.findOne({ name });
        if (existingProduct) {
            res
                .status(400)
                .json({ message: "A product with this name already exists." });
            return;
        }
        if (!files || files.length === 0) {
            res.status(400).json({ message: "Please uplaod atleast one image" });
            return;
        }
        const imageUrls = yield Promise.all(files.map((file) => (0, r2config_1.uploadToR2)(file)));
        const product = yield product_model_1.default.create({
            name,
            description,
            price,
            category: existingCategory,
            stock,
            images: imageUrls,
            colors,
            sizes,
        });
        res.status(201).json({ product });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
        return;
    }
});
exports.createProduct = createProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.default.find();
        if (products && products.length === 0) {
            res.status(404).json({ message: "No products found" });
            return;
        }
        res.status(200).json({ products });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
        return;
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield product_model_1.default.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ product });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
        return;
    }
});
exports.getProductById = getProductById;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, category, stock, images, colors, sizes } = req.body;
    const { id } = req.params;
    try {
        const product = yield product_model_1.default.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        product.images = images || product.images;
        product.colors = colors || product.colors;
        product.sizes = sizes || product.sizes;
        yield product.save();
        res.status(200).json({ product });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
        return;
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield product_model_1.default.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        yield product.remove();
        res.status(200).json({ message: "Product removed" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
        return;
    }
});
exports.deleteProduct = deleteProduct;
