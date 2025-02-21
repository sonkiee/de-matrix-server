"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Home route ("/")
router.get("/", (req, res) => {
    res.send(`
    <h1>Welcome to FTL E-commerce API</h1>
    <p>Use <strong>/api</strong> to interact with the API endpoints. For API documentation, visit <a href="/doc">/doc</a> .</p>
    <p><em>For more information, visit the documentation at /doc </em></p>
  `);
});
// API entry point ("/api")
router.get("/api", (req, res) => {
    res.redirect("/doc"); // Auto-redirect to Swagger documentation
});
exports.default = router;
