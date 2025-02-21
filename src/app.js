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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const limiter_1 = require("./config/limiter");
const swaggerConfig_1 = __importDefault(require("./swaggerConfig"));
const database_1 = __importDefault(require("./config/database"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const banner_routes_1 = __importDefault(require("./routes/banner.routes"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const cors_2 = require("./config/cors");
const logger_1 = __importDefault(require("./config/logger"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, swaggerConfig_1.default)(app);
app.use((0, cors_1.default)(cors_2.corsOptions));
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, hpp_1.default)());
app.use((0, compression_1.default)());
app.use(logger_1.default);
app.use(limiter_1.globalLimiter);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static("public/uploads"));
app.use("/", index_routes_1.default);
app.use("/api", index_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/payment", payment_routes_1.default);
app.use("/api/orders", order_routes_1.default);
app.use("/api/category", category_routes_1.default);
app.use("/api/banners", banner_routes_1.default);
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.default)();
        const NODE_ENV = process.env.NODE_ENV || "development";
        const PORT = parseInt(process.env.PORT || "3000", 10);
        const HOST = process.env.HOST || "127.0.0.1";
        app.listen(PORT, HOST, () => {
            console.log(`🚀 Server is running on at http://${HOST}:${PORT} in ${NODE_ENV} mode`);
        });
    }
    catch (error) {
        console.error("❌ Error starting server: ", error);
        process.exit(1);
    }
});
startServer();
