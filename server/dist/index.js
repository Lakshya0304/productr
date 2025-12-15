"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const middleware_1 = require("./middleware");
const product_1 = __importDefault(require("./routes/product"));
const db_1 = __importDefault(require("./database/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, db_1.default)();
app.use("/auth", auth_1.default);
app.use("/product", middleware_1.protect, product_1.default);
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
