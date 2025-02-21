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
exports.updateCategory = exports.getCategoryByName = exports.getCategoryById = exports.getCategories = exports.newCategory = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const newCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        if (!name) {
            res.status(400).json({ message: "Please enter all fields" });
            return;
        }
        const existingCategory = yield category_model_1.default.findOne({
            name,
        });
        if (existingCategory) {
            res.status(400).json({ message: "Category already exists" });
            return;
        }
        yield category_model_1.default.create({
            name,
        });
        res.status(201).json({ message: "Category created" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.newCategory = newCategory;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.default.find();
        if (categories.length === 0) {
            res.status(404).json({ message: "No categories found" });
            return;
        }
        res.status(200).json({ categories });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getCategories = getCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const category = yield category_model_1.default.findById(id).populate("products");
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        res.status(200).json({ category });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getCategoryById = getCategoryById;
const getCategoryByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        const category = yield category_model_1.default.findOne({ name }).populate("products");
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        res.status(200).json({ category });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
        return;
    }
});
exports.getCategoryByName = getCategoryByName;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    try {
        if (!name) {
            res.status(400).json({ message: "Please enter all fields" });
            return;
        }
        const category = yield category_model_1.default.findById(id);
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        yield category
            .updateOne({
            name,
        })
            .exec();
        res.status(200).json({ message: "Category updated" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.updateCategory = updateCategory;
