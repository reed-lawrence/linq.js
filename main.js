"use strict";
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
var zScoreListItem = /** @class */ (function () {
    function zScoreListItem(zScore, object) {
        if (zScore === void 0) { zScore = null; }
        if (object === void 0) { object = null; }
        this.object = object;
        this.zScore = zScore;
    }
    return zScoreListItem;
}());
exports.zScoreListItem = zScoreListItem;
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
    /// STATIC METHODS
    List.repeat = function (obj, count) {
        var output = [];
        for (var i = 0; i < count; i++) {
            output.push(obj);
        }
        return new List(output);
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
     * Appends a value to the end of the List<T>.
     * @param obj The object<T> to append to the List<T>
     * @returns Returns the modified List<T>
     */
    List.prototype.append = function (obj) {
        this.add(obj);
        return this;
    };
    /**
     * Adds a value to the beginning of the List<T>.
     * @param obj The value to prepend to source.
     * @returns Returns the modified List<T>
     */
    List.prototype.prepend = function (obj) {
        var arr = [obj];
        for (var i = 0; i < this._values.length; i++) {
            arr.push(this._values[i]);
        }
        this._values = arr;
        return this;
    };
    /**
     * Add a range of items from an array to the List.
     * @param items array of objects to be added
     * @returns Returns the modified List<T>
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
     * Add a range of items from a List<T>
     * @param list List object to be added
     * @returns Returns the modified List<T>
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
     * Concatenate a second List<T> to an existing List<T>. Elements will be added in order to the end of the existing List<T>.
     * @param list List<T> to concatenate
     * @returns Returns the modified List<T>
     */
    List.prototype.concat = function (list) {
        return this.addRangeFromList(_.cloneDeep(list));
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
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate Callback function of the conditions to check against the elements
     * @returns A List<T> that contains elements from the input sequence that satisfy the condition.
     */
    List.prototype.where = function (predicate) {
        var tempArr = new List();
        for (var i = 0; i < this._values.length; i++) {
            if (predicate(this._values[i]) === true) {
                tempArr.add(this._values[i]);
            }
        }
        return _.cloneDeep(tempArr);
    };
    /**
     * Return true or false if specified object exists in the List<T>
     * @param predicate Callback function to evaluate each iteration of the List<T>
     * @returns Returns boolean of expression
     */
    List.prototype.contains = function (obj) {
        return this.indexOf(obj) !== -1;
    };
    /**
     * Return true or false if specified condition exists in one or more iterations of the List<T>
     * @param predicate Callback function to evaluate each iteration of the List<T>
     * @returns Returns boolean of expression
     */
    List.prototype.exists = function (predicate) {
        for (var i = 0; i < this._values.length; i++) {
            if (predicate(this._values[i]) === true) {
                return true;
            }
        }
        return false;
    };
    /**
     * (Alias of List<T>.exists())
     * Return true or false if specified condition exists in one or more iterations of the List<T>
     * @param predicate Callback function to evaluate each iteration of the List<T>
     * @returns Returns boolean of expression
     */
    List.prototype.any = function (predicate) {
        return this.exists(predicate);
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
    /**
     * Remove all objects within the List<T> where the predicate expression evaluates to true.
     * @param predicate Callback expression to evaluate over each iteration of the List<T>
     * @returns Returns the modified List<T>
     */
    List.prototype.removeAll = function (predicate) {
        for (var i = 0; i < this.length; i++) {
            if (predicate(this._values[i]) === true) {
                this._values.splice(i, 1);
                i--;
            }
        }
        return this;
    };
    /**
     * (Alias of Array.splice())
     * Remove a single object from the List<T> at the specified index.
     * @param index The zero-based index of the element to remove.
     * @returns Returns the modified List<T>
     */
    List.prototype.removeAt = function (index) {
        if (index < 0 || index > this._values.length - 1) {
            throw new Error('Index out of range: List<T>.removeAt() index specified does not exist in List');
        }
        this._values.splice(index, 1);
        return this;
    };
    /**
     * (Alias of Array.splice())
     * Remove a range of elements from List<T>
     * @param start The zero-based starting index of the range of elements to remove.
     * @param count The number of elements to remove.
     * @returns Returns the modified List<T>
     */
    List.prototype.removeRange = function (start, count) {
        if (start === void 0) { start = 0; }
        if (count === void 0) { count = 1; }
        if (start < 0 || start > this._values.length - 1 || start === null || start === undefined) {
            throw new Error('Index out of range: List<T>.removeRange() start index specified does not exist in List');
        }
        else if (count === null || count === undefined) {
            throw new Error('Argument exception: List<T>.removeRange() count must not be null or undefined');
        }
        this._values.splice(start, count);
        return this;
    };
    /**
     * Sorts a List.
     * @param compareFn The name of the function used to determine the order of the elements. If omitted, the elements are sorted in ascending, ASCII character order.
     */
    List.prototype.sort = function (compareFn) {
        this._values = this._values.sort(compareFn);
        return this;
    };
    /**
     * Orders a List<T>. Specify an optional key and Ascending or Descending order.
     * @param key The callback to specify which parameter of <T> to order by
     * @param order Specify 'asc' for Ascending, 'desc' for Descending. Ascending by default.
     */
    List.prototype.orderBy = function (key, order) {
        if (key === void 0) { key = null; }
        if (order === void 0) { order = 'asc'; }
        if (order !== 'asc' && order !== 'desc') {
            throw new Error('Argument Exception: order must be asc or desc.');
        }
        if (key !== null) {
            if (order === 'asc') {
                this._values.sort(function (a, b) { return key(a) > key(b) ? 1 : key(a) < key(b) ? -1 : 0; });
            }
            else if (order === 'desc') {
                this._values.sort(function (a, b) { return key(a) > key(b) ? -1 : key(a) < key(b) ? 1 : 0; });
            }
        }
        else {
            if (order === 'asc') {
                this.values.sort(function (a, b) { return a > b ? 1 : a < b ? -1 : 0; });
            }
            else if (order === 'desc') {
                this.values.sort(function (a, b) { return a > b ? -1 : a < b ? 1 : 0; });
            }
        }
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
    /**
     * Get the count of elements in List<T> as defined by a predicate callback function.
     * @param predicate Callback function of the conditions to check against the elements
     * @returns Returns count
     */
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
    /// MATH FUNCTIONS
    /**
     * Calculate the sum of a List<T>. Optional numeric key callback.
     * @param key Numeric key of values to calculate
     * @returns Returns sum
     */
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
                    console.warn('Argument Exception: List<T>.sum: Non number detected in List');
                }
            }
            return total;
        }
    };
    /**
     * Calculate the mean of a List<T>. Optional numeric key callback.
     * @param key Numeric key of values to calculate
     * @returns Returns mean
     */
    List.prototype.mean = function (key) {
        if (key === void 0) { key = null; }
        var sum = this.sum(key);
        return sum / this._values.length;
    };
    /**
     * Get the minimum value of a List<T>. Optional numeric key callback.
     * @param key Numeric key of values to calculate
     * @returns Returns minimum
     */
    List.prototype.min = function (key) {
        if (key === void 0) { key = null; }
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
                console.warn('Argument Exception: List<T>.min: Non number detected in List');
            }
        }
        return min;
    };
    /**
     * Get the maximum value of a List<T>. Optional numeric key callback.
     * @param key Numeric key of values to calculate
     * @returns Returns maximum
     */
    List.prototype.max = function (key) {
        if (key === void 0) { key = null; }
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
                console.warn('Argument Exception: List<T>.max: Non number detected in List');
            }
        }
        return max;
    };
    /**
     * Calculate median of a List<T>. Optional numeric key callback.
     * @param key Numeric key of values to calculate
     * @returns Returns median
     */
    List.prototype.median = function (key) {
        if (key === void 0) { key = null; }
        var nums = this._values.map(function (o) { return key(o); }).sort(function (a, b) { return a - b; });
        var midpoint = nums.length / 2;
        if (nums.length % 2 === 0) {
            return nums[midpoint];
        }
        else {
            return (nums[midpoint - 1] + nums[midpoint]) / 2;
        }
    };
    /**
     * Calculate modes of a List<T>.nOptional numeric key callback.
     * @param key Numeric key of values to calculate
     * @returns Returns array of modes
     */
    List.prototype.modes = function (key) {
        var _this = this;
        if (key === void 0) { key = null; }
        var list = new List();
        var _loop_1 = function (i) {
            var index = list.findIndex(function (o) { return o.num === key(_this._values[i]); });
            if (index !== -1) {
                list.values[index].count++;
            }
            else {
                list.add({ count: 1, num: key(this_1._values[i]) });
            }
        };
        var this_1 = this;
        for (var i = 0; i < this._values.length; i++) {
            _loop_1(i);
        }
        var max = list.max(function (o) { return o.count; });
        return list.where(function (o) { return o.count === max; }).map(function (o) { return o.num; }).toArray();
    };
    /**
     * Caluclate range of a List<T>. Optional numeric key callback.
     * @param key Numeric key of values to calculate
     * @returns Returns range
     */
    List.prototype.range = function (key) {
        if (key === void 0) { key = null; }
        var list = new List(this._values.map(key));
        return this.max(key) - this.min(key);
    };
    /**
     * Calculate midrange of List. Optional numeric key callback.
     * @param key Numeric key of values to calculate
     * @returns Returns midrange
     */
    List.prototype.midrange = function (key) {
        if (key === void 0) { key = null; }
        var list = new List(this._values.map(key));
        return this.range(key) / 2;
    };
    /**
     * Calculate Variance of List. Optional numeric key callback.
     * @param key Numeric key of values to calculate
     * @returns Returns variance
     */
    List.prototype.variance = function (key) {
        if (key === void 0) { key = null; }
        var mean = this.mean(key);
        var nums = this._values.map(key);
        return new List(nums.map(function (num) { return Math.pow(num - mean, 2); })).mean();
    };
    /**
     * Calculate Standard Deviation. Optional numeric key callback.
     * @param key Numeric key of values to calculate
     * @returns Returns standard deviation
     */
    List.prototype.stdDev = function (key) {
        if (key === void 0) { key = null; }
        return Math.sqrt(this.variance(key));
    };
    /**
     * Calculate Mean Absolute Deviation. Optional numeric key callback.
     * @param key Numeric key of values to calculate
     * @returns Returns mean absolute deviation
     */
    List.prototype.meanAbsDev = function (key) {
        if (key === void 0) { key = null; }
        var mean = this.mean(key);
        var nums = this._values.map(key);
        return new List(nums.map(function (num) { return Math.abs(num - mean); })).mean();
    };
    /**
     * Calculate Z-Score from a given list. Returns object of zScoreListItems that contains the oringial object and it's respective zScore. Optional numeric key callback.
     * @param key Numeric key of values to calculate Z-Score
     * @returns Returns List of zScoreListItems
     */
    List.prototype.zScores = function (key) {
        if (key === void 0) { key = null; }
        var mean = this.mean(key);
        var stdDev = this.stdDev(key);
        var output = new List();
        for (var i = 0; i < this._values.length; i++) {
            output.add(new zScoreListItem((key(this._values[i]) - mean) / stdDev, this._values[i]));
        }
        return output;
    };
    /**
     * Determines whether every element in the List<T> matches the conditions defined by the specified predicate.
     * @param predicate Callback function of the conditions to check against the elements.
     * @returns Returns true or false
     */
    List.prototype.trueForAll = function (predicate) {
        var output = true;
        for (var i = 0; i < this._values.length; i++) {
            if (predicate(this._values[i]) === false) {
                output = false;
            }
        }
        return output;
    };
    /**
     * Copies a range of elements from the List<T> to a compatible one-dimensional array, starting at the specified index of the target array.
     * @param array The one-dimensional Array that is the destination of the elements copied from List<T>. The Array must have zero-based indexing.
     * @param fromIndex The zero-based index in the source List<T> at which copying begins.
     * @param atIndex The zero-based index in array at which copying begins.
     * @param count The number of elements to copy.
     */
    List.prototype.copyTo = function (array, fromIndex, atIndex, count) {
        if (fromIndex === void 0) { fromIndex = 0; }
        if (atIndex === void 0) { atIndex = 0; }
        if (count === void 0) { count = this._values.length; }
        if (fromIndex < 0 || fromIndex > this._values.length) {
            throw new Error('Index out of range: fromIndex (' + fromIndex + ') does not exist in specified array.');
        }
        else if (atIndex < 0 || atIndex > array.length) {
            throw new Error('Index out of range: atIndex (' + atIndex + ') does not exist in target array.');
        }
        else if (count < 1 || count > this._values.length) {
            throw new Error('Argument Exception: count (' + count + ') is less than 1 or greater than the length of the specified array');
        }
        var output = array.slice(0, atIndex);
        _.cloneDeep(this._values.slice(fromIndex, count)).forEach(function (v) { output.push(v); });
        array.slice(atIndex, array.length).forEach(function (v) { return output.push(v); });
        array = output;
    };
    /**
     * Copies a range of elements from the List<T> to a compatible List<T>, starting at the specified index of the target List.
     * @param list The List<T> that is the destination of the elements copied from List<T>.
     * @param fromIndex The zero-based index in the source List<T> at which copying begins.
     * @param atIndex The zero-based index in List at which copying begins.
     * @param count The number of elements to copy.
     */
    List.prototype.copyToList = function (list, fromIndex, atIndex, count) {
        if (fromIndex === void 0) { fromIndex = 0; }
        if (atIndex === void 0) { atIndex = 0; }
        if (count === void 0) { count = this._values.length; }
        var arr = _.cloneDeep(list.values);
        this.copyTo(arr, fromIndex, atIndex, count);
        list._values = arr;
    };
    /**
     * Group the List<T> by a specified Key
     * @param key
     * @returns Returns new List of GroupList<T> on Key of U
     */
    List.prototype.groupBy = function (key) {
        var groups = this.distinct(key).toArray().map(key);
        var output = new List();
        var _loop_2 = function (i) {
            output.addIfDistinct(new GroupedList(groups[i], this_2.where(function (o) { return key(o) === groups[i]; }).toArray()), null, function (g) { return g.key; });
        };
        var this_2 = this;
        for (var i = 0; i < groups.length; i++) {
            _loop_2(i);
        }
        return output;
    };
    /**
     * Ungroup a grouped List<T>. TypeScript Note: Specify type upon function call for best results.
     * @returns Returns a new decoupled ungrouped List<U>.
     */
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
    /**
     * Correlates the elements of two sequences based on matching keys. The default equality comparer is used to compare keys.
     * @param inner The sequence to join to the first sequence.
     * @param outerKeySelector A function to extract the join key from each element of the first sequence.
     * @param innerKeySelector A function to extract the join key from each element of the second sequence.
     * @param resultSelector A function to create a result element from two matching elements.
     * @returns Returns decoupled List<TResult> with elements that are obtained by performing an inner join on two sequences.
     * @typedef TInner The type of the elements of the second sequence.
     * @typedef TKey The type of the keys returned by the key selector functions.
     * @typedef TResult The type of the result elements.
     */
    List.prototype.join = function (inner, outerKeySelector, innerKeySelector, resultSelector) {
        var output = new List();
        for (var _i = 0, _a = inner._values; _i < _a.length; _i++) {
            var _inner = _a[_i];
            for (var _b = 0, _c = this._values; _b < _c.length; _b++) {
                var _outer = _c[_b];
                if (_.isEqual(innerKeySelector(_inner), outerKeySelector(_outer)) === true) {
                    output.add(resultSelector(_outer, _inner));
                }
            }
        }
        return _.cloneDeep(output);
    };
    /**
     * Filter and return a new decoupled List<U> containing only elements of a specified type.
     * @param type Pick from predefined types, or pass a Class reference to filter by
     * @returns Returns List<U>
     */
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
        return _.cloneDeep(output);
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
    List.prototype.select = function (selector) {
        var output = new List();
        for (var i = 0; i < this._values.length; i++) {
            output.add(selector(this._values[i], i));
        }
        return _.cloneDeep(output);
    };
    /**
     * (Alias of Array.prototype.map)
     * Calls a defined callback function on each element of a List<T>, and returns a decoupled List<U> that contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     * @returns Returns a decoupled List<U> mapped to the desired type.
     */
    List.prototype.map = function (callbackfn, thisArg) {
        var mappedVals = _.cloneDeep(this._values.map(callbackfn, thisArg));
        return new List(mappedVals);
    };
    /**
     * (Alias of List<T>.map)
     * Calls a defined callback function on each element of a List<T>, and returns a decoupled List<U> that contains the results.
     * @param converter Callback function to map type T into type U
     * @returns Returns a decoupled List<U> converted to the desired type.
     */
    List.prototype.convert = function (converter) {
        return this.map(converter);
    };
    /**
     * Override method to force TypeScript compiler to treat values as specified by the type declaration.
     * **For type conversions use List<T>.convert() or List<T>.map()**
     */
    List.prototype.cast = function () {
        return new List(this._values.map(function (i) { return i; }));
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
    List.prototype.split = function (separator) {
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
    /**
     * Gets a random element from the List.
     * @returns Returns the random element.
     */
    List.prototype.sample = function () {
        return _.sample(this._values);
    };
    /**
     * Gets n random elements at unique keys from the List up to the size of collection. Note: Sample is not decoupled.
     * @param n The number of elements to sample.
     * @returns Returns List<T> of the random elements.
     */
    List.prototype.sampleSize = function (n) {
        if (n === void 0) { n = 1; }
        return new List(_.sampleSize(this._values, n));
    };
    /**
     * Creates a List<T> of shuffled values, using a version of the Fisher-Yates shuffle.
     * @returns Returns the new shuffled List<T>.
     */
    List.prototype.shuffle = function () {
        _.shuffle(this._values);
        return this;
    };
    /// NATIVE REPRO
    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    List.prototype.forEach = function (callbackfn, thisArg) {
        this._values.forEach(callbackfn);
    };
    /**
     * Removes the last element from an array and returns it.
     */
    List.prototype.pop = function () {
        return this._values.pop();
    };
    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function. Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    List.prototype.reduce = function (callbackfn, initialValue) {
        if (initialValue === void 0) { initialValue = null; }
        if (initialValue === null) {
            return this._values.reduce(callbackfn);
        }
        else {
            return this._values.reduce(callbackfn, initialValue);
        }
    };
    return List;
}());
exports.List = List;
var Person = /** @class */ (function () {
    function Person(name) {
        if (name === void 0) { name = null; }
        this.name = name;
    }
    return Person;
}());
exports.Person = Person;
var Pet = /** @class */ (function () {
    function Pet(name, age, owner) {
        if (name === void 0) { name = null; }
        if (age === void 0) { age = null; }
        if (owner === void 0) { owner = null; }
        this.name = name;
        this.age = age;
        if (this.owner === null) {
            this.owner = new Person();
        }
        else {
            this.owner = owner;
        }
    }
    return Pet;
}());
exports.Pet = Pet;
var people = new List([
    new Person('Terry'),
    new Person('Magnus'),
    new Person('Charlotte')
]);
var pets = new List([
    new Pet('Whiskers', 3, people.values[0]),
    new Pet('Boots', 4, people.values[0]),
    new Pet('Barley', 2, people.values[1]),
    new Pet('Daisy', 5, people.values[2])
]);
// const query = people.join(pets,
//   person => person,
//   pet => pet.owner,
//   (person, pet) => {
//     return { ownerName: person.name, petName: pet.name };
//   });
// for (let obj of query.values) {
//   console.log(obj.ownerName + ' | ' + obj.petName);
// }
var query = pets.select(function (pet, index) {
    return { index: index, str: pet.name };
});
for (var _i = 0, _a = query.values; _i < _a.length; _i++) {
    var obj = _a[_i];
    console.log('index ' + obj.index + ' str: ' + obj.str);
}
