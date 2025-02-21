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
exports.uploadBanner = exports.getBanner = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const banner_model_1 = __importDefault(require("../models/banner.model"));
const getBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        let banners;
        if (type) {
            banners = yield banner_model_1.default.findOne({ type });
            if (!banners) {
                res.status(404).json({ message: `No ${type} banner found` });
                return;
            }
        }
        else {
            banners = yield banner_model_1.default.find();
            if (banners.length === 0) {
                res.status(404).json({ message: "No banners uploaded" });
                return;
            }
        }
        res.status(200).json({ banners });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getBanner = getBanner;
const uploadBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, title, description } = req.body;
        if (!type) {
            res.status(400).json({ message: "Please provide a banner type" });
            return;
        }
        if (!["small", "big"].includes(type)) {
            res
                .status(400)
                .json({ message: "Invalid banner type. Choose 'small' or 'big'." });
            return;
        }
        if (!req.file) {
            res.status(400).json({ message: "Please upload a banner image" });
            return;
        }
        const existing = yield banner_model_1.default.findOne({ type });
        if (existing) {
            const filePath = path_1.default.join(__dirname, "..", "public", "uploads", existing.imageUrl);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
            existing.imageUrl = `/uploads/${req.file.filename}`;
            existing.title = title || existing.title;
            existing.description = description || existing.description;
            yield existing.save();
            res.status(200).json({ message: "Banner updated successfully" });
            return;
        }
        const banner = yield banner_model_1.default.create({
            type,
            imageUrl: `/uploads/${req.file.filename}`,
            title,
            description,
        });
        res.status(201).json({ message: "Banner uploaded successfully", banner });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
        return;
    }
});
exports.uploadBanner = uploadBanner;
