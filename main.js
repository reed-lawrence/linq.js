"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var JSLinqArrayGrouped = /** @class */ (function () {
    function JSLinqArrayGrouped(key, values) {
        this.Key = key;
        if (values !== null) {
            this.Collection = values;
        }
        else {
            this.Collection = new JSLinqArray();
        }
    }
    return JSLinqArrayGrouped;
}());
exports.JSLinqArrayGrouped = JSLinqArrayGrouped;
var JSLinqArray = /** @class */ (function (_super) {
    __extends(JSLinqArray, _super);
    function JSLinqArray(arr) {
        var _this = _super.apply(this, arr) || this;
        _this.where = function (predicate) {
            var tempArr = new JSLinqArray();
            for (var i = 0; i < _this.length; i++) {
                var something = _this[i];
                if (predicate(_this[i]) === true) {
                    tempArr.push(_this[i]);
                }
            }
            return tempArr;
        };
        _this.mapToExplicit = function (type) {
            console.log(Object.keys(type));
            var output = new JSLinqArray();
            for (var i = 0; i < _this.length; i++) {
                // var temp: U = Object.create(<any>typeRef);
                var temp = new type();
                var anyExists = false;
                for (var _i = 0, _a = Object.keys(temp); _i < _a.length; _i++) {
                    var newKey = _a[_i];
                    var keyExists = false;
                    for (var _b = 0, _c = Object.keys(_this[i]); _b < _c.length; _b++) {
                        var existKey = _c[_b];
                        if (existKey === newKey) {
                            temp[newKey] = _this[i][existKey];
                            anyExists = true;
                            keyExists = true;
                        }
                    }
                    if (keyExists === false && temp[newKey] === undefined) {
                        temp[newKey] = null;
                    }
                }
                if (anyExists === true) {
                    console.log(temp);
                    output.push(temp);
                }
            }
            return output;
        };
        _this.mapToImplicit = function (typeRef) {
            console.log(Object.keys(typeRef));
            var output = new JSLinqArray();
            for (var i = 0; i < _this.length; i++) {
                var temp = Object.create(typeRef);
                var anyExists = false;
                for (var _i = 0, _a = Object.keys(typeRef); _i < _a.length; _i++) {
                    var newKey = _a[_i];
                    var keyExists = false;
                    for (var _b = 0, _c = Object.keys(_this[i]); _b < _c.length; _b++) {
                        var existKey = _c[_b];
                        if (existKey === newKey) {
                            temp[newKey] = _this[i][existKey];
                            anyExists = true;
                            keyExists = true;
                        }
                    }
                    if (keyExists === false && (temp[newKey] === undefined || temp[newKey] === null)) {
                        temp[newKey] = null;
                    }
                }
                if (anyExists === true) {
                    output.push(temp);
                }
            }
            return output;
        };
        _this.pushUnique = function (obj, key, logVerbose) {
            if (key === void 0) { key = null; }
            if (logVerbose === void 0) { logVerbose = false; }
            if (logVerbose === true) {
                console.log('pushUnique called');
            }
            if (typeof obj === 'object' && key === null) {
                console.warn('Object defined in pushUnique is complex, but a key was not specified.');
            }
            else if (typeof obj !== 'object' && key !== null) {
                console.warn('Object is not complex, but a key was specified');
            }
            var index = key !== null ? _this._findIndex(_this, obj, function (o) { return key(o) === key(obj); }) : _this.indexOf(obj);
            if (index === -1) {
                _this.push(obj);
            }
            else {
                if (logVerbose === true) {
                    console.log('Duplicate object, not added');
                }
            }
        };
        _this.spliceIfExists = function (obj, key) {
            if (key === void 0) { key = null; }
            if (typeof obj === 'object' && key === null) {
                console.warn('Object defined in pushUnique is complex, but a key was not specified.');
            }
            else if (typeof obj !== 'object' && key !== null) {
                console.warn('Object is not complex, but a key was specified');
            }
            var index = key !== null ? _this._findIndex(_this, obj, function (o) { return key(o) === key(obj); }) : _this.indexOf(obj);
            if (index !== -1) {
                _this.splice(index);
            }
        };
        _this.spliceWhere = function (predicate) {
            for (var i = 0; i < _this.length; i++) {
                if (predicate(_this[i]) === true) {
                    _this.splice(i, 1);
                    i--;
                }
            }
        };
        _this.ofType = function (type) {
            var output = new JSLinqArray();
            var objectKeys = Object.keys(type);
            for (var i = 0; i < _this.length; i++) {
                if (typeof type === 'object') {
                    var allKeysMatch = true;
                    var _keys = Object.keys(_this[i]);
                    for (var j = 0; j < objectKeys.length; j++) {
                        var exists = _keys.indexOf(objectKeys[j]) !== -1;
                        // console.log(_keys[j] + ' ' + exists);
                        if (exists === false) {
                            allKeysMatch = false;
                        }
                    }
                    if (allKeysMatch === true) {
                        output.push(_this[i]);
                    }
                }
                else {
                    if (typeof _this[i] === type) {
                        output.push(_this[i]);
                    }
                }
            }
            return output;
        };
        _this.orderByDescending = function (key) {
            return _this.sort(function (a, b) { return key(a) > key(b) ? -1 : key(a) < key(b) ? 1 : 0; });
        };
        _this.orderByAscending = function (key) {
            return _this.sort(function (a, b) { return key(a) > key(b) ? 1 : key(a) < key(b) ? -1 : 0; });
        };
        _this.groupBy = function (key) {
            var groups = _this.distinct(key).map(key);
            var output = new JSLinqArray();
            var _loop_1 = function (i) {
                output.pushUnique(new JSLinqArrayGrouped(groups[i], _this.where(function (o) { return key(o) === groups[i]; })), function (g) { return g.Key; });
            };
            for (var i = 0; i < groups.length; i++) {
                _loop_1(i);
            }
            return output;
        };
        _this.count = function (predicate) {
            if (predicate === void 0) { predicate = null; }
            if (predicate === null) {
                return _this.length;
            }
            else {
                var count = 0;
                for (var i = 0; i < _this.length; i++) {
                    if (predicate(_this[i]) === true) {
                        count++;
                    }
                }
                return count;
            }
        };
        _this.distinct = function (key) {
            var output = new JSLinqArray();
            for (var i = 0; i < _this.length; i++) {
                output.pushUnique(_this[i], key);
            }
            return output;
        };
        _this.contains = function (predicate) {
            return _this.where(predicate).length > 0;
        };
        _this.sum = function (key) {
            if (key === void 0) { key = null; }
            var total = 0;
            if (key !== null) {
                for (var i = 0; i < _this.length; i++) {
                    var num = parseInt(key(_this[i]).toString(), 10);
                    if (typeof num === 'number') {
                        total += num;
                    }
                    else {
                        console.warn('Non number detected');
                    }
                }
                return total;
            }
        };
        _this.average = function (key) {
            var sum = _this.sum(key);
            return sum / _this.length;
        };
        _this.min = function (key) {
            var min = null;
            for (var i = 0; i < _this.length; i++) {
                var val = parseInt(key(_this[i]).toString(), 10);
                if (typeof val === 'number') {
                    if (min === null) {
                        min = val;
                    }
                    else {
                        if (val < min) {
                            min = val;
                        }
                    }
                }
                else {
                    console.warn('Non number detected');
                }
            }
            return min;
        };
        _this.max = function (key) {
            var max = null;
            for (var i = 0; i < _this.length; i++) {
                var val = parseInt(key(_this[i]).toString(), 10);
                if (typeof val === 'number') {
                    if (max === null) {
                        max = val;
                    }
                    else {
                        if (val > max) {
                            max = val;
                        }
                    }
                }
                else {
                    console.warn('Non number detected');
                }
            }
            return max;
        };
        _this.toArray = function () {
            var temp = [];
            for (var i = 0; i < this.length; i++) {
                temp.push(this[i]);
            }
            return temp;
        };
        _this._findIndex = function (arr, obj, key) {
            var index = -1;
            for (var i = 0; i < arr.length; i++) {
                if (key(arr[i]) === key(obj)) {
                    index = i;
                    break;
                }
            }
            return index;
        };
        return _this;
    }
    return JSLinqArray;
}(Array));
exports.JSLinqArray = JSLinqArray;
var TestClass = /** @class */ (function () {
    function TestClass(key, value) {
        if (key === void 0) { key = null; }
        if (value === void 0) { value = null; }
        this.key = key;
        this.value = value;
    }
    return TestClass;
}());
exports.TestClass = TestClass;
var Person = /** @class */ (function () {
    function Person(name, age) {
        var _this = this;
        this.print = function () {
            return 'Name: ' + _this.name + ' | Age: ' + _this.age;
        };
        this.name = name;
        this.age = age;
    }
    return Person;
}());
exports.Person = Person;
var Student = /** @class */ (function (_super) {
    __extends(Student, _super);
    function Student(id, name, age) {
        var _this = _super.call(this, name, age) || this;
        _this.id = id;
        return _this;
    }
    return Student;
}(Person));
exports.Student = Student;
var objArr = new JSLinqArray([{
        name: 'John',
        age: 18,
        id: 1
    }, {
        name: 'Steve',
        age: 17,
        id: 2
    }, {
        name: 'Bill',
        age: 20,
        id: 3
    }, {
        name: 'Clark',
        age: 18,
        id: 4
    }, {
        name: 'Ron',
        age: 19,
        id: 5
    }, {
        name: 'Mary',
        age: 17,
        id: 6
    }, {
        name: 'Sue',
        age: 21,
        id: 7
    }]);
console.log(objArr.toArray());
var test = objArr.mapToExplicit(Person).groupBy(function (p) { return p.age; });
console.log('-------------------');
// console.log(test.toArray());
// console.log('-------------------');
for (var _i = 0, test_1 = test; _i < test_1.length; _i++) {
    var group = test_1[_i];
    console.log(group.Key);
    for (var _a = 0, _b = group.Collection; _a < _b.length; _a++) {
        var sub = _b[_a];
        console.log(sub.print());
    }
}
// console.log(new Student(1, 'test', 25));
