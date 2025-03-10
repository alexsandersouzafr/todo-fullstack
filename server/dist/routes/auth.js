"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
let users = [
    { id: (0, uuid_1.v4)(), username: "fulano@internet.com", password: "123456" },
];
router.post("/signup", (req, res, next) => {
    //todo
});
exports.default = router;
