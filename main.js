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
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var GroupedList = /** @class */ (function () {
    function GroupedList(key, items) {
        if (items === void 0) { items = null; }
        this.key = key;
        if (items === null) {
            this.collection = new List();
        }
        else {
            this.collection = new List(items.map(function (i) { return i; }));
        }
    }
    return GroupedList;
}());
exports.GroupedList = GroupedList;
var List = /** @class */ (function () {
    function List(items) {
        if (items === undefined || items === null) {
            this._values = new Array();
        }
        else {
            this._values = items;
        }
    }
    List.prototype.get = function (i) {
        return this._values[i];
    };
    Object.defineProperty(List.prototype, "values", {
        get: function () {
            return this._values;
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.set = function (index, obj) {
        this._values[index] = obj;
        return this;
    };
    List.prototype.getRange = function (start, end) {
        if (start > this._values.length - 1) {
            throw new Error('Index out of range exception. The specified index ' + start + ' does not exist in target List.');
        }
        else if (end > this._values.length - 1) {
            throw new Error('Index out of range exception. The specified index ' + end + ' does not exist in target List.');
        }
        else if (start < 0) {
            throw new Error('Index out of range exception. The specified index ' + start + ' does not exist in target List.');
        }
        else if (end < 0) {
            throw new Error('Index out of range exception. The specified index ' + end + ' does not exist in target List.');
        }
        else if ((start !== null && end !== null) && (start > end)) {
            throw new Error('Starting index must be less than or equal to the ending index in the getRange method');
        }
        var output = new List();
        if (start === null && end !== null) {
            for (var i = 0; i <= end; i++) {
                output.add(this._values[i]);
            }
        }
        else if (start !== null && end === null) {
            for (var i = start; i < this._values.length; i++) {
                output.add(this._values[i]);
            }
        }
        else if (start !== null && end !== null) {
            for (var i = start; i <= end; i++) {
                output.add(this._values[i]);
            }
        }
        else {
            throw new Error('getRange must specify either start, end, or both.');
        }
        return output;
    };
    List.prototype.clear = function () {
        this._values = new Array();
        return this;
    };
    List.prototype.findIndex = function (predicate, fromIndex) {
        if (fromIndex === void 0) { fromIndex = 0; }
        for (var i = fromIndex; i < this._values.length; i++) {
            if (predicate(this._values[i]) === true) {
                return i;
            }
        }
        return -1;
    };
    List.prototype.indexOf = function (obj, fromIndex) {
        if (fromIndex === void 0) { fromIndex = 0; }
        for (var i = fromIndex; i < this._values.length; i++) {
            if (_.isEqual(obj, this._values[i])) {
                return i;
            }
        }
        return -1;
    };
    Object.defineProperty(List.prototype, "length", {
        /**
         * Get the length of the current List
         */
        get: function () {
            return this._values.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "lastIndex", {
        /**
         * Get the index of the last object in the List. Returns -1 if the List is empty.
         */
        get: function () {
            if (this._values.length > 0) {
                return this._values.length - 1;
            }
            else {
                return -1;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add an object to the List. If no index is specified, object will be appended to the end of the List.
     * @param obj Object to add to the List
     * @param atIndex Optional: Add to a specified location in the List
     */
    List.prototype.add = function (obj, atIndex) {
        if (atIndex === undefined || atIndex === null) {
            this._values.push(obj);
        }
        else {
            if (atIndex > this._values.length - 1) {
                throw new Error('Index out of range exception. The specified index ' + atIndex + ' does not exist in target List.');
            }
            else if (atIndex !== null && atIndex < 0) {
                throw new Error('Index out of range exception. The specified index ' + atIndex + ' does not exist in target List.');
            }
            var tempArr1 = [];
            var tempArr2 = [];
            for (var i = 0; i < this._values.length; i++) {
                if (i < atIndex) {
                    tempArr1.push(this._values[i]);
                }
                else {
                    tempArr2.push(this._values[i]);
                }
            }
            this._values = new Array();
            for (var i = 0; i < tempArr1.length; i++) {
                this._values.push(tempArr1[i]);
            }
            this._values.push(obj);
            for (var i = 0; i < tempArr2.length; i++) {
                this._values.push(tempArr2[i]);
            }
        }
        return this;
    };
    /**
     * Add a range of items from an array to the List.
     * @param items array of objects to be added
     */
    List.prototype.addRange = function (items) {
        if (items !== null) {
            var temp = _.cloneDeep(items);
            for (var i = 0; i < temp.length; i++) {
                this._values.push(temp[i]);
            }
        }
        return this;
    };
    /**
     * @param list List object to be added
     */
    List.prototype.addRangeFromList = function () {
        var lists = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            lists[_i] = arguments[_i];
        }
        for (var i = 0; i < lists.length; i++) {
            this._values = this.addRange(lists[i].values).values;
        }
        return this;
    };
    /**
     * Creates a List of unique values, in order, from all of the provided arrays using SameValueZero for equality comparisons.
     * @param array The arrays to inspect.
     * @returns New sorted and decoupled List of unioned objects
     */
    List.prototype.union = function (array) {
        return new List(_.cloneDeep(_.union(this._values, array)));
    };
    /**
     * This method is like .union except that it accepts iteratee which is invoked for each element of each List to generate the criterion by which uniqueness is computed. The iteratee is invoked with one argument: (value).
     * @param array The arrays to inspect.
     * @param key The iteratee invoked per element.
     * @returns New sorted and decoupled List of unioned objects
     */
    List.prototype.unionBy = function (array, key) {
        return new List(_.cloneDeep(_.unionBy(this._values, array, key)));
    };
    /**
     * This method is like _.union except that it accepts comparator which is invoked to compare elements of Lists. The comparator is invoked with two arguments: (arrVal, othVal).
     * @param array The arrays to inspect.
     * @param comparator The comparator invoked per element.
     * @returns New sorted and decoupled List of unioned objects
     */
    List.prototype.unionWith = function (array, comparator) {
        return new List(_.cloneDeep(_.unionWith(this._values, array, comparator)));
    };
    /**
     * Creates a List of unique values, in order, from all of the provided arrays using SameValueZero for equality comparisons.
     * @param list The List to inspect.
     * @returns New sorted and decoupled List of unioned objects
     */
    List.prototype.unionList = function (list) {
        return this.union(list.toArray());
    };
    /**
     * This method is like .unionList except that it accepts iteratee which is invoked for each element of each List to generate the criterion by which uniqueness is computed. The iteratee is invoked with one argument: (value).
     * @param array The List to inspect.
     * @param key The iteratee invoked per element.
     * @returns New sorted and decoupled List of unioned objects
     */
    List.prototype.unionListBy = function (list, key) {
        return this.unionBy(list.toArray(), key);
    };
    /**
     * This method is like _.unionList except that it accepts comparator which is invoked to compare elements of Lists. The comparator is invoked with two arguments: (arrVal, othVal).
     * @param array The List to inspect.
     * @param comparator The comparator invoked per element.
     * @returns New sorted and decoupled List of unioned objects
     */
    List.prototype.unionListWith = function (list, comparator) {
        return this.unionWith(list.toArray(), comparator);
    };
    List.prototype.where = function (predicate) {
        var tempArr = new List();
        for (var i = 0; i < this._values.length; i++) {
            if (predicate(this._values[i]) === true) {
                tempArr.add(this._values[i]);
            }
        }
        return tempArr;
    };
    List.prototype.contains = function (predicate) {
        return this.where(predicate).length > 0;
    };
    List.prototype.toArray = function () {
        return this._values.map(function (i) { return i; });
    };
    List.prototype.addIfDistinct = function (obj, atIndex, key) {
        if (atIndex === void 0) { atIndex = null; }
        if (key === void 0) { key = null; }
        if (typeof obj === 'object' && key === null) {
            console.warn('Object defined in pushUnique is complex, but a key was not specified.');
        }
        else if (typeof obj !== 'object' && key !== null) {
            console.warn('Object is not complex, but a key was specified');
        }
        var index = key !== null ? this.findIndex(function (o) { return key(o) === key(obj); }) : this._values.indexOf(obj);
        if (index === -1) {
            this.add(obj, atIndex);
        }
        return this;
    };
    List.prototype.distinct = function (key) {
        if (key === void 0) { key = null; }
        var output = new List();
        for (var i = 0; i < this._values.length; i++) {
            output.addIfDistinct(this.values[i], null, key);
        }
        return _.cloneDeep(output);
    };
    List.prototype.spliceIfExists = function (obj, key) {
        if (key === void 0) { key = null; }
        if (typeof obj === 'object' && key === null) {
            console.warn('Object defined in pushUnique is complex, but a key was not specified.');
        }
        else if (typeof obj !== 'object' && key !== null) {
            console.warn('Object is not complex, but a key was specified');
        }
        var index = key !== null ? this.findIndex(function (o) { return key(o) === key(obj); }) : this._values.indexOf(obj);
        if (index !== -1) {
            this._values.splice(index);
        }
        return this;
    };
    /**
     * Removes an object from the List by performing deep comparison
     * @param obj The object to remove
     * @returns The modified List Object
     */
    List.prototype.remove = function (obj) {
        for (var i = 0; i < this._values.length; i++) {
            var index = this.indexOf(obj);
            if (index !== -1) {
                this._values.splice(i, 1);
            }
            else {
                i = this._values.length;
            }
        }
        return this;
    };
    List.prototype.removeWhere = function (predicate) {
        for (var i = 0; i < this.length; i++) {
            if (predicate(this._values[i]) === true) {
                this._values.splice(i, 1);
                i--;
            }
        }
        return this;
    };
    List.prototype.orderByDescending = function (key) {
        this._values.sort(function (a, b) { return key(a) > key(b) ? -1 : key(a) < key(b) ? 1 : 0; });
        return this;
    };
    List.prototype.orderByAscending = function (key) {
        if (key === void 0) { key = null; }
        if (key !== null) {
            this._values.sort(function (a, b) { return key(a) > key(b) ? 1 : key(a) < key(b) ? -1 : 0; });
        }
        else {
            this.values.sort(function (a, b) { return a > b ? 1 : a < b ? -1 : 0; });
        }
        return this;
    };
    List.prototype.count = function (predicate) {
        if (predicate === void 0) { predicate = null; }
        if (predicate === null) {
            return this._values.length;
        }
        else {
            var count = 0;
            for (var i = 0; i < this._values.length; i++) {
                if (predicate(this._values[i]) === true) {
                    count++;
                }
            }
            return count;
        }
    };
    List.prototype.sum = function (key) {
        if (key === void 0) { key = null; }
        var total = 0;
        if (key !== null) {
            for (var i = 0; i < this.length; i++) {
                var num = parseInt(key(this._values[i]).toString(), 10);
                if (typeof num === 'number') {
                    total += num;
                }
                else {
                    console.warn('Non parseable number detected');
                }
            }
            return total;
        }
    };
    List.prototype.average = function (key) {
        var sum = this.sum(key);
        return sum / this._values.length;
    };
    List.prototype.min = function (key) {
        var min = null;
        for (var i = 0; i < this._values.length; i++) {
            var val = parseInt(key(this._values[i]).toString(), 10);
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
                console.warn('Non parseable number detected');
            }
        }
        return min;
    };
    List.prototype.max = function (key) {
        var max = null;
        for (var i = 0; i < this._values.length; i++) {
            var val = parseInt(key(this._values[i]).toString(), 10);
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
    List.prototype.groupBy = function (key) {
        var groups = this.distinct(key).toArray().map(key);
        var output = new List();
        var _loop_1 = function (i) {
            output.addIfDistinct(new GroupedList(groups[i], this_1.where(function (o) { return key(o) === groups[i]; }).toArray()), null, function (g) { return g.key; });
        };
        var this_1 = this;
        for (var i = 0; i < groups.length; i++) {
            _loop_1(i);
        }
        return output;
    };
    List.prototype.unGroup = function () {
        var output = new List();
        var temp = new List(this._values);
        for (var i = 0; i < temp.values.length; i++) {
            for (var j = 0; j < temp.values[i].collection.values.length; j++) {
                output.add(temp.values[i].collection.values[j]);
            }
        }
        return _.cloneDeep(output);
    };
    List.prototype.ofType = function (type) {
        var output = new List();
        var objectKeys = Object.keys(type);
        for (var i = 0; i < this._values.length; i++) {
            if (typeof type === 'object') {
                var allKeysMatch = true;
                var _keys = Object.keys(this._values[i]);
                for (var j = 0; j < objectKeys.length; j++) {
                    var exists = _keys.indexOf(objectKeys[j]) !== -1;
                    if (exists === false) {
                        allKeysMatch = false;
                    }
                }
                if (allKeysMatch === true) {
                    output.add(this._values[i]);
                }
            }
            else {
                if (typeof this[i] === type) {
                    output.add(this._values[i]);
                }
            }
        }
        return output;
    };
    /**
     * Returns the first element that matches the specified criteria. Returns null if not found.
     * Note: Does not decouple the object from the List.
     * @param predicate The expression to evaluate
     * @returns First matching element or null if not found.
     */
    List.prototype.first = function (predicate) {
        for (var i = 0; i < this._values.length; i++) {
            if (predicate(this._values[i]) === true) {
                return this._values[i];
            }
        }
        return null;
    };
    /**
     * Select a list of columns, this method will flatten any class methods;
     */
    List.prototype.select = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        var output = new List();
        var _values = this._values.map(function (i) { return i; });
        for (var i = 0; i < _values.length; i++) {
            var temp = {};
            for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
                var key = keys_1[_a];
                var keyType = typeof _values[i][key];
                if (keyType === 'function') {
                    console.warn('Function ' + key + ' used as key, will flatten and may perform unexpectedly.');
                }
                else if (keyType === 'object') {
                    // console.warn('Object ${key} used as key, will flatten and may perform unexpectedly.');
                    temp[key] = _values[i][key];
                }
                else {
                    temp[key] = _values[i][key];
                }
            }
            output.add(temp);
        }
        return output;
    };
    List.prototype.map = function (callbackfn) {
        var mappedVals = _.cloneDeep(this._values.map(callbackfn));
        var output = new List(mappedVals);
        return output;
    };
    /// LODASH REPRO METHODS
    /**
     * Creates an array of elements split into groups the length of size. If collection can’t be split evenly, the final chunk will be the remaining elements.
     * @param chunkSize size of each chunk
     * @returns Returns a List of Lists object
     */
    List.prototype.chunk = function (chunkSize) {
        var output = new List();
        var chunks = _.chunk(this._values, chunkSize);
        for (var i = 0; i < chunks.length; i++) {
            output.add(new List(chunks[i]));
        }
        return output;
    };
    /**
     * Decouples and returns an array with all false-y values removed.
     * @returns Returns the modified List<T> object
     */
    List.prototype.compact = function () {
        var decoupledArr = _.cloneDeep(this._values);
        this._values = _.compact(decoupledArr);
        return this;
    };
    /**
     * Creates a new array decoupling and concatenating array with any additional arrays and/or values
     * @param values the values to concatenate
     * @returns Returns the modified List<T> object
     */
    List.prototype.concat = function (values) {
        var decoupledValues = _.cloneDeep(values);
        _.concat(this._values, decoupledValues);
        return this;
    };
    /**
     * Creates a slice of array with n elements dropped from the beginning.
     * @param toDrop number of elements to drop. 1 by default.
     * @returns Returns the modified List<T> object
     */
    List.prototype.drop = function (toDrop) {
        if (toDrop === void 0) { toDrop = 1; }
        this._values = _.drop(this._values, toDrop);
        return this;
    };
    /**
     * Creates a slice of array excluding elements dropped from the beginning.
     * Elements are dropped until predicate returns falsey.
     * The predicate is invoked with three arguments: (value, index, array).
     * @param predicate function evoked per iteration
     * @returns Returns the modified List<T> object
     */
    List.prototype.dropWhile = function (predicate) {
        this._values = _.dropWhile(this._values, predicate);
        return this;
    };
    /**
     * Creates a slice of array with n elements dropped from the end.
     * @param toDrop number of elements to drop. 1 by default.
     * @returns Returns the modified List<T> object
     */
    List.prototype.dropRight = function (toDrop) {
        if (toDrop === void 0) { toDrop = 1; }
        this._values = _.dropRight(this._values, toDrop);
        return this;
    };
    /**
     * Creates a slice of array excluding elements dropped from the end.
     * Elements are dropped until predicate returns falsey.
     * The predicate is invoked with three arguments: (value, index, array).
     * @param predicate The function invoked per iteration.
     * @returns Returns the modified List<T> object
     */
    List.prototype.dropRightWhile = function (predicate) {
        this._values = _.dropRightWhile(this._values, predicate);
        return this;
    };
    /**
     * Fills elements of array with value from start up to, but not including, end.
     * @param value The value to fill array with.
     * @param start The start position.
     * @param end The end position.
     * @returns Returns the modified List<T> object
     */
    List.prototype.fill = function (value, start, end) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = this._values.length; }
        this._values = _.fill(this._values, value);
        return this;
    };
    /**
     * Find the last index of a specified criteria
     * @param predicate The expression to evaluate.
     * @param fromIndex Index to start search. Default is 0;
     * @returns Returns the modified List<T> object
     */
    List.prototype.findLastIndex = function (predicate, fromIndex) {
        if (fromIndex === void 0) { fromIndex = 0; }
        var index = -1;
        for (var i = 0; i < this._values.length; i++) {
            if (predicate(this._values[i]) === true) {
                index = i;
            }
        }
        return index;
    };
    /**
     * Flattens the List a single level deep.
     * @returns Returns the modified List<T> object
     */
    List.prototype.flatten = function () {
        this._values = _.flatten(this._values);
        return this;
    };
    /**
     * Recursively flattens the List.
     * @returns Returns the modified List<T> object
     */
    List.prototype.flattenDeep = function () {
        this._values = _.flatMapDeep(this._values);
        return this;
    };
    /**
     * Recursively flattens the List up to a depth.
     * @param depth The maximum recursion depth.
     * @returns Returns the modified List<T> object
     */
    List.prototype.flattenDepth = function (depth) {
        if (depth === void 0) { depth = 1; }
        this._values = _.flattenDepth(this._values, depth);
        return this;
    };
    /**
     * @returns The first element in the array. Note: Element is not decoupled.
     */
    List.prototype.head = function () {
        if (this._values.length > 0) {
            return this._values[0];
        }
        else {
            return null;
        }
    };
    /**
     * @returns Returns all but the last element of the List
     */
    List.prototype.initial = function () {
        return new List(_.initial(this._values));
    };
    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
     */
    List.prototype.join = function (separator) {
        if (separator === void 0) { separator = ','; }
        return this._values.join(separator);
    };
    /**
     * @returns The last element in the List. Note: Does not decouple the returned object.
     */
    List.prototype.last = function () {
        return this._values[this._values.length - 1];
    };
    /**
     * @param obj The object to find within the List
     * @param fromIndex The starting index of the search. Default is 0.
     * @returns Returns the last index of an object
     */
    List.prototype.lastIndexOf = function (obj, fromIndex) {
        if (fromIndex === void 0) { fromIndex = 0; }
        var index = -1;
        for (var i = fromIndex; i < this._values.length; i++) {
            if (_.isEqual(obj, this._values[i]) === true) {
                index = i;
            }
        }
        return index;
    };
    /**
     * @returns The modified List with the order reversed.
    */
    List.prototype.reverse = function () {
        this._values = _.reverse(this._values);
        return this;
    };
    /**
     * Returns a decoupled List of sliced objects.
     * @param start The beginning of the specified portion of the List.
     * @param end The end of the specified portion of the List.
     * @returns A new decoupled List of the sliced objects
     */
    List.prototype.slice = function (start, end) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = this._values.length; }
        return new List(_.cloneDeep(this._values.slice(start, end)));
    };
    /**
     * Uses a binary search to determine the lowest index at which value should be inserted into the List in order to maintain its sort order.
     * @param obj The value to evaluate.
     * @returns Returns the index of the matched value, else -1.
     */
    List.prototype.sortedIndex = function (obj) {
        return _.sortedIndex(this._values, obj);
    };
    /**
     * This method is like .sortedIndex except that it accepts a key which is invoked for value and each element of the List to compute their sort ranking. The iteratee is invoked with one argument: (value).
     * @param obj The value to evaluate.
     * @param key The iteratee invoked per element.
     * @returns Returns the index of the matched value, else -1.
     */
    List.prototype.sortedIndexBy = function (obj, key) {
        return _.sortedIndexBy(this._values, obj, key);
    };
    /**
     * This method is like .indexOf except that it performs a binary search on a sorted List.
     * @param obj The value to evaluate.
     * @returns Returns the index of the matched value, else -1.
     */
    List.prototype.sortedIndexOf = function (obj) {
        return _.sortedIndexOf(this._values, obj);
    };
    /**
     * This method is like .sortedIndex except that it returns the highest index at which value should be inserted into the List in order to maintain its sort order.
     * @param obj The value to evaluate.
     * @returns Returns the index of the matched value, else -1.
     */
    List.prototype.sortedLastIndex = function (obj) {
        return _.sortedLastIndex(this._values, obj);
    };
    /**
     * This method is like .sortedLastIndex except that it accepts iteratee which is invoked for value and each element of the List to compute their sort ranking. The iteratee is invoked with one argument: (value).
     * @param obj The value to evaluate.
     * @param key The iteratee invoked per element.
     * @returns Returns the index of the matched value, else -1.
     */
    List.prototype.sortedLastIndexBy = function (obj, key) {
        return _.sortedLastIndexBy(this._values, obj, key);
    };
    /**
     * This method is like .lastIndexOf except that it performs a binary search on a sorted List.
     * @param obj The value to evaluate.
     * @returns Returns the index of the matched value, else -1.
     */
    List.prototype.sortedLastIndexOf = function (obj) {
        return _.sortedLastIndexOf(this._values, obj);
    };
    /**
     * Gets all but the first element of List. List returned is decoupled.
     * @returns new decoupled list containing all but first element of original List
     */
    List.prototype.tail = function () {
        return new List(_.cloneDeep(_.tail(this._values)));
    };
    List.prototype.forEach = function (iterator) {
        for (var i = 0; i < this._values.length; i++) {
            iterator(this._values[i]);
        }
    };
    return List;
}());
exports.List = List;
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
var StudentClass = /** @class */ (function () {
    function StudentClass(name, id, credits) {
        this.name = name;
        this.id = id;
        this.credits = credits;
    }
    return StudentClass;
}());
exports.StudentClass = StudentClass;
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
    function Student(id, name, age, classes) {
        if (classes === void 0) { classes = null; }
        var _this = _super.call(this, name, age) || this;
        _this.id = id;
        if (classes === null) {
            _this.classes = new List();
        }
        else {
            _this.classes = new List(classes.toArray());
        }
        return _this;
    }
    return Student;
}(Person));
exports.Student = Student;
var objArr = new List([{
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
var complexObjArray = new List([
    new Student(1, 'Test1', 25, new List([
        new StudentClass('Intro to Economics', 'ECON 101', 3),
        new StudentClass('Intro to Finance', 'FIN 101', 3)
    ])),
    new Student(2, 'Test2', 22, new List([
        new StudentClass('Intro to Economics', 'ECON 101', 3),
        new StudentClass('Calculus II', 'MATH 165', 4)
    ])),
    new Student(3, 'Test3', 30, new List([
        new StudentClass('Calculus II', 'MATH 165', 4),
        new StudentClass('Intro to Java', 'CSCI 121', 3)
    ]))
]);
var objArr2 = new List([
    new Student(1, 'Test4', 26),
    new Student(4, 'Test5', 27)
]);
objArr.forEach(function (i) {
    i.name += ' test';
    console.log(i.name);
});
