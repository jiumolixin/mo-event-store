"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = void 0;
function isObject(obj) {
    var type = typeof obj;
    return type === 'object' && !!obj;
}
exports.isObject = isObject;
