"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Enumerable = /** @class */ (function () {
    function Enumerable(items) {
        if (items === void 0) { items = null; }
        this._from = 0;
        this._current = 0;
        if (items === undefined || items === null) {
            this._values = new Array();
        }
        else {
            this._values = new Array();
            for (var i = 0; i < items.length; i++) {
                this._values.push(items[i]);
                this[this._values.length - 1] = items[i];
            }
        }
    }
    Object.defineProperty(Enumerable.prototype, "length", {
        get: function () {
            return this._values.length;
        },
        enumerable: true,
        configurable: true
    });
    Enumerable.prototype[Symbol.iterator] = function () {
        this._current = this._from;
        return this;
    };
    Enumerable.prototype.next = function () {
        if (this._current < this._values.length) {
            return { done: false, value: this[this._current++] };
        }
        else {
            return { done: true, value: null };
        }
    };
    Enumerable.prototype.reIndexKeys = function () {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__values(Object.keys(this)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                if (typeof key === 'number') {
                    delete this[key];
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        for (var i = 0; i < this._values.length; i++) {
            this[i] = this._values[i];
        }
    };
    return Enumerable;
}());
exports.Enumerable = Enumerable;
//# sourceMappingURL=enumerable.js.map