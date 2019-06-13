"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enumerable_1 = require("./enumerable");
var _ = require("lodash");
var List = /** @class */ (function (_super) {
    tslib_1.__extends(List, _super);
    function List(items, decouple) {
        if (decouple === void 0) { decouple = false; }
        var _this = _super.call(this, items) || this;
        /** PROPERTIES */
        _this._decouple = false;
        _this._decouple = decouple;
        if (_this._decouple === true && items !== null && items !== undefined && items.length > 0) {
            _this._values = _.cloneDeep(_this._values);
            _this.reIndexKeys();
        }
        return _this;
    }
    /** METHODS */
    /**
     * Add an object to the List. If no index is specified, object will be appended to the end of the List.
     * @param obj Object to add to the List
     * @param atIndex Optional: Add to a specified location in the List
     */
    List.prototype.add = function (obj, atIndex) {
        if (atIndex === undefined || atIndex === null) {
            this.append(obj);
        }
        else {
            if (atIndex > this.length - 1) {
                throw new Error('Index out of range exception. The specified index ' + atIndex + ' does not exist in target List.');
            }
            else if (atIndex !== null && atIndex < 0) {
                throw new Error('Index out of range exception. The specified index ' + atIndex + ' does not exist in target List.');
            }
            var tempArr1 = [];
            var tempArr2 = [];
            for (var i = 0; i < this.length; i++) {
                if (i < atIndex) {
                    tempArr1.push(this[i]);
                }
                else {
                    tempArr2.push(this[i]);
                }
            }
            this.clear();
            for (var i = 0; i < tempArr1.length; i++) {
                this.append(tempArr1[i]);
            }
            this.append(obj);
            for (var i = 0; i < tempArr2.length; i++) {
                this.append(tempArr2[i]);
            }
        }
        return this;
    };
    /**
     * Add a range of items from a List<T>
     * @param list List object to be added
     * @returns Returns the modified List<T>
     */
    List.prototype.addRange = function (collection) {
        for (var i = 0; i < collection.length; i++) {
            this._values.push(collection[i]);
        }
        this.reIndexKeys();
        return this;
    };
    // TODO: asReadOnly();
    // TODO: binarySearch();
    /**
     * (Alias of List<T>.map)
     * Calls a defined callback function on each element of a List<T>, and returns a decoupled List<U> that contains the results.
     * @param converter Callback function to map type T into type U
     * @returns Returns a decoupled List<U> converted to the desired type.
     */
    List.prototype.convertAll = function (converter) {
        return this.map(converter, null, true).toList();
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
        if (count === void 0) { count = this.length; }
        if (fromIndex < 0 || fromIndex > this.length) {
            throw new Error('Index out of range: fromIndex (' + fromIndex + ') does not exist in specified array.');
        }
        else if (atIndex < 0 || atIndex > array.length) {
            throw new Error('Index out of range: atIndex (' + atIndex + ') does not exist in target array.');
        }
        else if (count < 1 || count > this.length) {
            throw new Error('Argument Exception: count (' + count + ') is less than 1 or greater than the length of the specified array');
        }
        var output = array.slice(0, atIndex);
        _.cloneDeep(this._values.slice(fromIndex, count)).forEach(function (v) { output.push(v); });
        // console.log(output);
        array.slice(atIndex, array.length).forEach(function (v) { return output.push(v); });
        for (var i = 0; i < array.length; i++) {
            array.pop();
        }
        for (var i = 0; i < output.length; i++) {
            array.push(output[i]);
        }
    };
    /**
     * (Alias of List.Any())
     * Return true or false if specified condition exists in one or more iterations of the List<T>
     * @param predicate Callback function to evaluate each iteration of the List<T>
     * @returns Returns boolean of expression
     */
    List.prototype.exists = function (predicate) {
        return this.any(predicate);
    };
    /**
     * Returns the first element that matches the specified criteria. Returns the optionally specified default object or null if not specified.
     * Note: Decouples from List<T>.
     * @param predicate The expression to evaluate
     * @param _default Optional default value. Null if not specified.
     * @returns First matching element or optionally specified default (null if not specified).
     */
    List.prototype.find = function (predicate, _default) {
        if (_default === void 0) { _default = null; }
        return this.firstOrDefault(predicate, _default);
    };
    /**
     * Decouples and retrieves all the elements that match the conditions defined by the specified predicate.
     * @param predicate The callback that defines the conditions of the elements to search for.
     * @returns A List<T> containing all the elements that match the conditions defined by the specified predicate, if found; otherwise, an empty List<T>.
     */
    List.prototype.findAll = function (predicate) {
        var output = new List();
        for (var i = 0; i < this.length; i++) {
            if (predicate(this[i]) === true) {
                output.append(this[i]);
            }
        }
        return _.cloneDeep(output);
    };
    /**
     * Returns the last element of a sequence that satisfies a specified condition or the last element if a condition is not specified. Optionally declare default value if not found.
     * @param predicate A function to test each element for a condition.
     * @param _default Optional default value. Null if not specified.
     * @returns The last element in the List. Note: Does not decouple the returned object.
     */
    List.prototype.findLast = function (predicate, _default) {
        if (_default === void 0) { _default = null; }
        return this.lastOrDefault(predicate, _default);
    };
    // TODO: getEnumerator();
    // TODO: insert();
    // TODO: insertRange();
    /**
     * Removes an object from the List by performing deep comparison
     * @param obj The object to remove
     * @returns The modified List Object
     */
    List.prototype.remove = function (obj) {
        for (var i = 0; i < this.length; i++) {
            var index = this.indexOf(obj);
            if (index !== -1) {
                this.splice(i, 1);
            }
            else {
                i = this.length;
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
            if (predicate(this[i]) === true) {
                this.splice(i, 1);
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
        if (index < 0 || index > this.length - 1) {
            throw new Error('Index out of range: List<T>.removeAt() index specified does not exist in List');
        }
        this.splice(index);
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
        if (start < 0 || start > this.length - 1 || start === null || start === undefined) {
            throw new Error('Index out of range: List<T>.removeRange() start index specified does not exist in List');
        }
        else if (count === null || count === undefined) {
            throw new Error('Argument exception: List<T>.removeRange() count must not be null or undefined');
        }
        this.splice(start, count);
        return this;
    };
    /**
     * (Alias of List.All())
     * Determines whether every element in the List<T> matches the conditions defined by the specified predicate.
     * @param predicate Callback function of the conditions to check against the elements.
     * @returns Returns true or false
     */
    List.prototype.trueForAll = function (predicate) {
        return this.all(predicate);
    };
    /** START NON .NET METHODS */
    /**
     * Add an object to the List<T> if it is distinct. Optionally specify key and/or index to add at. Performs deep object comparison to determine distinctivity.
     * @param obj Object to add
     * @param key Optional callback to determine unique key
     * @param atIndex Optional position to add the object at in the List
     */
    List.prototype.addIfDistinct = function (obj, key, atIndex) {
        if (key === void 0) { key = null; }
        if (atIndex === void 0) { atIndex = null; }
        if (typeof obj === 'object' && key === null) {
            console.warn('Object defined in pushUnique is complex, but a key was not specified.');
        }
        else if (typeof obj !== 'object' && key !== null) {
            console.warn('Object is not complex, but a key was specified');
        }
        var index = key !== null ? this.findIndex(function (o) { return key(o) === key(obj); }) : this.indexOf(obj);
        if (index === -1) {
            this.add(obj, atIndex);
        }
        return this;
    };
    /*************************************************************************************************** */
    /** START IEnumerable Methods */
    /*************************************************************************************************** */
    List.prototype.clear = function () {
        this._values = new Array();
        this.reIndexKeys();
        return this;
    };
    List.prototype.findIndex = function (predicate, fromIndex) {
        if (fromIndex === void 0) { fromIndex = 0; }
        for (var i = fromIndex; i < this.length; i++) {
            if (predicate(this[i]) === true) {
                return i;
            }
        }
        return -1;
    };
    List.prototype.indexOf = function (obj, fromIndex) {
        if (fromIndex === void 0) { fromIndex = 0; }
        for (var i = fromIndex; i < this.length; i++) {
            if (_.isEqual(obj, this[i])) {
                return i;
            }
        }
        return -1;
    };
    // TODO: aggregate()
    /**
     * Determines whether every element in the List<T> matches the conditions defined by the specified predicate.
     * @param predicate Callback function of the conditions to check against the elements.
     * @returns Returns true or false
     */
    List.prototype.all = function (predicate) {
        var output = true;
        for (var i = 0; i < this.length; i++) {
            if (predicate(this[i]) === false) {
                output = false;
            }
        }
        return output;
    };
    /**
     * (Alias of List<T>.exists())
     * Return true or false if specified condition exists in one or more iterations of the List<T>
     * @param predicate Callback function to evaluate each iteration of the List<T>
     * @returns Returns boolean of expression
     */
    List.prototype.any = function (predicate) {
        for (var i = 0; i < this._values.length; i++) {
            if (predicate(this[i]) === true) {
                return true;
            }
        }
        return false;
    };
    /**
     * appends a value to the end of the List<T>.
     * @param obj The object<T> to append to the List<T>
     * @returns Returns the modified List<T>
     */
    List.prototype.append = function (obj) {
        this._values.push(obj);
        this[this.length - 1] = obj;
        return this;
    };
    // TODO: asEnumerable()
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
                var num = parseInt(key(this[i]).toString(), 10);
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
     * Override method to force TypeScript compiler to treat values as specified by the type declaration.
     * **For type conversions use List<T>.convert() or List<T>.map()**
     */
    List.prototype.cast = function () {
        return new List(this._values.map(function (i) { return i; }));
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
            for (var i = 0; i < this.length; i++) {
                if (predicate(this[i]) === true) {
                    count++;
                }
            }
            return count;
        }
    };
    // TODO: defaultIfEmpty()
    /**
     * Returns distinct elements from a sequence.
     * @param key Optional specification of key to compare uniqueness
     * @returns An List<T> that contains distinct elements from the source sequence.
     */
    List.prototype.distinct = function (key) {
        var _this = this;
        if (key === void 0) { key = null; }
        var output = new List();
        var _loop_1 = function (i) {
            var index = key !== null ? this_1.findIndex(function (o) { return key(o) === key(_this[i]); }) : this_1._values.indexOf(this_1[i]);
            if (index === -1) {
                output.append(this_1[i]);
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.length; i++) {
            _loop_1(i);
        }
        return _.cloneDeep(output);
    };
    /**
     * Returns the element at a specified index in a sequence.
     * @param index The zero-based index of the element to retrieve.
     * @returns The decoupled element at the specified position in the source sequence.
     */
    List.prototype.elementAt = function (index) {
        if (index > this.length - 1 || index < 0 || index === null || index === undefined) {
            return undefined;
        }
        return _.cloneDeep(this[index]);
    };
    /**
     * Returns the element at a specified index in a sequence or a default value if the index is out of range. You may optionally specify
     * the default object that is returned. Returns null if not specified.
     * @param index The zero-based index of the element to retrieve.
     * @param _default Optional object to return if index is out of range or does not exist.
     * @returns The decoupled element at the specified position in the source sequence or the default specified.
     */
    List.prototype.elementAtOrDefault = function (index, _default) {
        if (_default === void 0) { _default = null; }
        var elem = this.elementAt(index);
        if (elem === undefined) {
            return _.cloneDeep(_default);
        }
    };
    /**
     * Returns an empty List<T> that has the specified type argument.
     * @typedef TResult type to assign to the type parameter of the returned generic IList<T>.
     * @returns An empty List<T> whose type argument is TResult.
     */
    List.empty = function () {
        return new List();
    };
    // TODO: except()
    /**
     * Returns the first element that matches the specified criteria. Returns undefined if not found.
     * Note: Decouples from List<T>.
     * @param predicate The expression to evaluate
     * @returns First matching element or undefined if not found.
     */
    List.prototype.first = function (predicate, decouple) {
        if (predicate === void 0) { predicate = null; }
        if (decouple === void 0) { decouple = this._decouple; }
        if (predicate === null) {
            if (this.length > 0) {
                return decouple === true ? _.cloneDeep(this[0]) : this[0];
            }
            else {
                return undefined;
            }
        }
        else {
            for (var i = 0; i < this.length; i++) {
                if (predicate(this[i]) === true) {
                    return decouple === true ? _.cloneDeep(this[i]) : this[i];
                }
            }
            return undefined;
        }
    };
    /**
     * Returns the first element that matches the specified criteria. Returns the optionally specified default object or null if not specified.
     * Note: Decouples from List<T>.
     * @param predicate The expression to evaluate
     * @returns First matching element or optionally specified default (null if not specified).
     */
    List.prototype.firstOrDefault = function (predicate, _default, decouple) {
        if (predicate === void 0) { predicate = null; }
        if (_default === void 0) { _default = null; }
        if (decouple === void 0) { decouple = this._decouple; }
        var elem = this.first(predicate, decouple);
        if (elem === undefined && (_default === null || _default === undefined)) {
            return null;
        }
        else if (elem === undefined && (_default !== null && _default !== undefined)) {
            return elem;
        }
        else {
            return elem;
        }
    };
    /**
     * Group the List<T> by a specified Key. Note: Decouples groups from original List<T>
     * @param key Callback function to specify Key to group by
     * @returns Returns new List of GroupList<T> on Key of U
     */
    List.prototype.groupBy = function (key) {
        var _this = this;
        var output = new List();
        var _loop_2 = function (i) {
            var index = output.findIndex(function (o) { return o.key === key(_this[i]); });
            if (index === -1) {
                output.append({ key: _.cloneDeep(key(this_2[i])), collection: new List([_.cloneDeep(this_2[i])]) });
            }
            else {
                output[index].collection.append(_.cloneDeep(this_2[i]));
            }
        };
        var this_2 = this;
        for (var i = 0; i < this.length; i++) {
            _loop_2(i);
        }
        return output;
    };
    // TODO: groupJoin()
    // TODO: intersect()
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
        var e_1, _a, e_2, _b;
        var output = new List();
        try {
            for (var inner_1 = tslib_1.__values(inner), inner_1_1 = inner_1.next(); !inner_1_1.done; inner_1_1 = inner_1.next()) {
                var _inner = inner_1_1.value;
                try {
                    for (var _c = tslib_1.__values(this), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var _outer = _d.value;
                        if (_.isEqual(innerKeySelector(_inner), outerKeySelector(_outer)) === true) {
                            output.append(resultSelector(_outer, _inner));
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (inner_1_1 && !inner_1_1.done && (_a = inner_1.return)) _a.call(inner_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return _.cloneDeep(output);
    };
    /**
     * Returns the last element of a sequence that satisfies a specified condition or the last element if a condition is not specified.
     * @param predicate A function to test each element for a condition.
     * @returns The last element in the List. Note: Does not decouple the returned object.
     */
    List.prototype.last = function (predicate) {
        if (predicate === void 0) { predicate = null; }
        if (predicate === null) {
            return this[this.length - 1];
        }
        else {
            var output = undefined;
            for (var i = 0; i < this.length; i++) {
                if (predicate(this[i]) === true) {
                    output = this[i];
                }
            }
            return output;
        }
    };
    /**
     * Returns the last element of a sequence that satisfies a specified condition or the last element if a condition is not specified. Optionally declare default value if not found.
     * @param predicate A function to test each element for a condition.
     * @param _default Optional default value. Null if not specified.
     * @returns The last element in the List<T>. Note: Does not decouple the returned object.
     */
    List.prototype.lastOrDefault = function (predicate, _default) {
        if (predicate === void 0) { predicate = null; }
        if (_default === void 0) { _default = null; }
        var obj = this.last(predicate);
        if (obj === undefined) {
            return _default;
        }
        else {
            return obj;
        }
    };
    /**
     * TODO: Needs improvement
     * Filter and return a new decoupled List<U> containing only elements of a specified type.
     * @param type Pick from predefined types, or pass a Class reference to filter by
     * @returns Returns List<U>
     */
    List.prototype.ofType = function (type) {
        var output = new List();
        var objectKeys = Object.keys(type);
        for (var i = 0; i < this.length; i++) {
            if (typeof type === 'object') {
                var allKeysMatch = true;
                var _keys = Object.keys(this[i]);
                for (var j = 0; j < objectKeys.length; j++) {
                    var exists = _keys.indexOf(objectKeys[j]) !== -1;
                    if (exists === false) {
                        allKeysMatch = false;
                    }
                }
                if (allKeysMatch === true) {
                    output.append(this[i]);
                }
            }
            else {
                if (typeof this[i] === type) {
                    output.append(this[i]);
                }
            }
        }
        return _.cloneDeep(output);
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
                this._values.sort(function (a, b) { return a > b ? 1 : a < b ? -1 : 0; });
            }
            else if (order === 'desc') {
                this._values.sort(function (a, b) { return a > b ? -1 : a < b ? 1 : 0; });
            }
        }
        return this;
    };
    /**
     * Adds a value to the beginning of the List<T>.
     * @param obj The value to prepend to source.
     * @returns Returns the modified List<T>
     */
    List.prototype.prepend = function (obj) {
        var arr = [obj];
        for (var i = 0; i < this.length; i++) {
            arr.push(this[i]);
        }
        this._values = arr;
        this.reIndexKeys();
        return this;
    };
    List.prototype.getRange = function (start, end) {
        if (start > this.length - 1) {
            throw new Error('Index out of range exception. The specified index ' + start + ' does not exist in target List.');
        }
        else if (end > this.length - 1) {
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
                output.append(this[i]);
            }
        }
        else if (start !== null && end === null) {
            for (var i = start; i < this.length; i++) {
                output.append(this[i]);
            }
        }
        else if (start !== null && end !== null) {
            for (var i = start; i <= end; i++) {
                output.append(this[i]);
            }
        }
        else {
            throw new Error('getRange must specify either start, end, or both.');
        }
        return output;
    };
    List.repeat = function (obj, count) {
        var output = [];
        for (var i = 0; i < count; i++) {
            output.push(obj);
        }
        return new List(output);
    };
    List.prototype.toArray = function () {
        return _.cloneDeep(this._values);
    };
    /**
     * Select a list of columns, this method will flatten any class methods;
     */
    List.prototype.select = function (selector) {
        var output = new List();
        for (var i = 0; i < this.length; i++) {
            output.append(selector(this[i], i));
        }
        return _.cloneDeep(output);
    };
    // TODO: selectMany();
    // TODO: sequenceEqual();
    // TODO: single();
    // TODO: singleOrDefault();
    // TODO: skip();
    // TODO: skipLast();
    // TODO: skipWhile();
    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
     */
    List.prototype.split = function (separator) {
        if (separator === void 0) { separator = ','; }
        return this._values.join(separator);
    };
    // TODO: take();
    // TODO: takeLast();
    // TODO: takeWhile();
    // TODO: thenBy();
    // TODO: thenByDescending();
    List.prototype.toList = function () {
        return new List(_.cloneDeep(this._values));
    };
    // TODO: toLookup();
    /**
     * Creates an List of unique values, in order, from all of the provided arrays using SameValueZero for equality comparisons.
     * @param array The arrays to inspect.
     * @returns New sorted and decoupled List<T> of unioned objects
     */
    List.prototype.union = function (collection) {
        return new List(_.cloneDeep(_.union(this, collection)));
    };
    /**
     * This method is like .union except that it accepts iteratee which is invoked for each element of each List to generate the criterion by which uniqueness is computed. The iteratee is invoked with one argument: (value).
     * @param array The arrays to inspect.
     * @param key The iteratee invoked per element.
     * @returns New sorted and decoupled List<T> of unioned objects
     */
    List.prototype.unionBy = function (collection, key) {
        return new List(_.cloneDeep(_.unionBy(this, collection, key)));
    };
    /**
     * This method is like _.union except that it accepts comparator which is invoked to compare elements of Lists. The comparator is invoked with two arguments: (arrVal, othVal).
     * @param array The arrays to inspect.
     * @param comparator The comparator invoked per element.
     * @returns New sorted and decoupled List<T> of unioned objects
     */
    List.prototype.unionWith = function (collection, comparator) {
        return new List(_.cloneDeep(_.unionWith(this, collection, comparator)));
    };
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate Callback function of the conditions to check against the elements
     * @returns A List<T> that contains elements from the input sequence that satisfy the condition.
     */
    List.prototype.where = function (predicate, decouple) {
        if (decouple === void 0) { decouple = this._decouple; }
        var outputArr = this._values.filter(predicate);
        return decouple === true ? _.cloneDeep(new List(outputArr)) : new List(outputArr);
    };
    // TODO: Zip
    /** END List METHODS */
    /*************************************************************************************************** */
    /** MATH FUNCTIONS */
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
        var _loop_3 = function (i) {
            var index = list.findIndex(function (o) { return o.num === key(_this._values[i]); });
            if (index !== -1) {
                list[index].count++;
            }
            else {
                list.append({ count: 1, num: key(this_3._values[i]) });
            }
        };
        var this_3 = this;
        for (var i = 0; i < this._values.length; i++) {
            _loop_3(i);
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
            output.append({ zScore: (key(this._values[i]) - mean) / stdDev, obj: this._values[i] });
        }
        return output;
    };
    /*************************************************************************************************** */
    /** NATIVE JS ARRAY REPRO */
    /**
     * Concatenate a second List<T> to an existing List<T>. Elements will be added in order to the end of the existing List<T>.
     * @param collection List<T> to concatenate
     * @returns Returns the modified List<T>
     */
    List.prototype.concat = function (collection) {
        for (var i = 0; i < collection.length; i++) {
            this.append(collection[i]);
        }
        return this;
    };
    // copyWithin
    /**
     * (Alias of Array.copyWithin)
     * Returns the this object after copying a section of the List identified by start and end to the same List starting at position target
     * @param target If target is negative, it is treated as length+target where length is the length of the List.
     * @param start If start is negative, it is treated as length+start. If end is negative, it is treated as length+end.
     * @param end If not specified, length of the this object is used as its default value.
     */
    List.prototype.copyWithin = function (target, start, end) {
        this._values.copyWithin(target, start, end);
        this.reIndexKeys();
        return this;
    };
    /** Decouples and returns an iterable of key, value pairs for every entry in the List */
    List.prototype.entries = function () {
        return _.cloneDeep(this._values.entries());
    };
    /**
     * (Alias of Array.every)
     * Determines whether all the members of an List satisfy the specified test.
     * @param callbackfn A function that accepts up to three arguments. The every method calls the callbackfn function for each element in List until the callbackfn returns false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    List.prototype.every = function (callbackfn, thisArg) {
        return this._values.every(callbackfn, thisArg);
    };
    /**
     * Fills elements of List with value from start up to, but not including, end.
     * @param value The value to fill List with.
     * @param start The start position.
     * @param end The end position.
     * @returns Returns the modified List<T> object
     */
    List.prototype.fill = function (value, start, end) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = this._values.length; }
        this._values = this._values.fill(value, start, end);
        this.reIndexKeys();
        return this;
    };
    // filter
    /**
     * Decouples and returns the elements of an List that meet the condition specified in a callback function.
     * @param callbackfn A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the List.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    List.prototype.filter = function (callbackfn, thisArg) {
        return _.cloneDeep(this._values.filter(callbackfn, thisArg));
    };
    /**
     * Performs the specified action for each element in an List.
     * @param callbackfn A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the List.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    List.prototype.forEach = function (callbackfn, thisArg) {
        this._values.forEach(callbackfn);
    };
    /**
     * Returns an iterable of keys in the List
     * TODO: return keys of object not the internal array
     */
    List.prototype.keys = function () {
        return _.cloneDeep(this._values.keys());
    };
    /**
     * Find the last index of a specified criteria
     * @param predicate The expression to evaluate.
     * @param fromIndex Index to start search. Default is 0;
     * @param count The number of elements in the section to search.
     * @returns Returns the modified List<T> object
     */
    List.prototype.lastIndexOf = function (obj, fromIndex, count) {
        if (fromIndex === void 0) { fromIndex = 0; }
        if (count === void 0) { count = this.length - fromIndex; }
        var index = -1;
        for (var i = fromIndex; i < count; i++) {
            if (_.isEqual(obj, this[i])) {
                index = i;
            }
        }
        return index;
    };
    /**
     * (Alias of Array.prototype.map)
     * Calls a defined callback function on each element of a List<T>, and returns a decoupled List<U> that contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     * @returns Returns a decoupled List<U> mapped to the desired type.
     */
    List.prototype.map = function (callbackfn, thisArg, decouple) {
        if (decouple === void 0) { decouple = this._decouple; }
        var mappedVals = this._values.map(callbackfn, thisArg);
        return decouple === true ? new List(_.cloneDeep(mappedVals)) : new List(mappedVals);
    };
    /**
     * Removes the last element from an List and returns it.
     */
    List.prototype.pop = function () {
        var val = this._values.pop();
        delete this[this.length];
        return val;
    };
    // push
    List.prototype.push = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        if (items !== null && items !== undefined) {
            for (var i = 0; i < items.length; i++) {
                this.append(items[i]);
            }
        }
    };
    // TODO: 
    // /**
    //  * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function. Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    //  * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
    //  * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    //  */
    // reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T = null): T {
    //   if (initialValue === null) {
    //     return this._values.reduce(callbackfn);
    //   } else {
    //     return this._values.reduce(callbackfn, initialValue);
    //   }
    // }
    // reduceRight TODO:
    /**
     * @returns The modified List with the order reversed.
    */
    List.prototype.reverse = function () {
        this._values = this._values.reverse();
        this.reIndexKeys();
        return this;
    };
    /**
     * Removes the first element from an List and returns it.
     */
    List.prototype.shift = function () {
        var obj = this._values.shift();
        this.reIndexKeys();
        return obj;
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
    * Determines whether the specified callback function returns true for any element of an List.
    * @param callbackfn A function that accepts up to three arguments. The some method calls the callbackfn function for each element in array1 until the callbackfn returns true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
    */
    List.prototype.some = function (callbackfn, thisArg) {
        return this._values.some(callbackfn, thisArg);
    };
    /**
     * Sorts an List.
     * @param compareFn The name of the function used to determine the order of the elements. If omitted, the elements are sorted in ascending, ASCII character order.
     */
    List.prototype.sort = function (compareFn) {
        this._values = this._values.sort(compareFn);
        this.reIndexKeys();
        return this;
    };
    /**
    * Removes elements from an List and, if necessary, inserts new elements in their place, returning the deleted elements.
    * @param start The zero-based location in the List from which to start removing elements.
    * @param deleteCount The number of elements to remove.
    */
    List.prototype.splice = function (start, deleteCount) {
        if (deleteCount === void 0) { deleteCount = 1; }
        this._values.splice(start, deleteCount);
        this.reIndexKeys();
        return this;
    };
    /**
     * Returns a string representation of an List. The elements are converted to string using their toLocalString methods.
     */
    List.prototype.toLocaleString = function () {
        return this._values.toLocaleString();
    };
    /**
     * Returns a string representation of an List.
     */
    List.prototype.toString = function () {
        return this._values.toString();
    };
    /**
     * Inserts new elements at the start of an List.
     * @param items Elements to insert at the start of the List
     */
    List.prototype.unshift = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var _a;
        var output = (_a = this._values).unshift.apply(_a, tslib_1.__spread(items));
        this.reIndexKeys();
        return output;
    };
    // values(){
    //   return this._values.v
    // }
    /*****************************************************************************************************/
    /** LODASH REPRO */
    /*****************************************************************************************************/
    /**
     * Decouples and returns an array with all false-y values removed.
     * @returns Returns the modified List<T> object
     */
    List.prototype.compact = function () {
        var decoupledArr = _.cloneDeep(this.toArray());
        return new List(_.compact(decoupledArr));
    };
    /**
     * Creates an array of elements split into groups the length of size. If collection can’t be split evenly, the final chunk will be the remaining elements.
     * @param chunkSize size of each chunk
     * @returns Returns a List of Lists object
     */
    List.prototype.chunk = function (chunkSize) {
        var output = new List();
        var chunks = _.chunk(this, chunkSize);
        for (var i = 0; i < chunks.length; i++) {
            output.append(new List(chunks[i]));
        }
        return output;
    };
    /**
     * Creates a slice of array with n elements dropped from the beginning.
     * @param toDrop number of elements to drop. 1 by default.
     * @returns Returns the modified List<T> object
     */
    List.prototype.drop = function (toDrop) {
        if (toDrop === void 0) { toDrop = 1; }
        this._values = _.drop(this._values, toDrop);
        this.reIndexKeys();
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
        this.reIndexKeys();
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
        this.reIndexKeys();
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
        this.reIndexKeys();
        return this;
    };
    /**
     * Flattens the List a single level deep.
     * @returns Returns the modified List<T> object
     */
    List.prototype.flatten = function () {
        this._values = _.flatten(this._values);
        this.reIndexKeys();
        return this;
    };
    /**
     * Recursively flattens the List.
     * @returns Returns the modified List<T> object
     */
    List.prototype.flattenDeep = function () {
        this._values = _.flatMapDeep(this._values);
        this.reIndexKeys();
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
        this.reIndexKeys();
        return this;
    };
    /**
     * @returns The first element in the array. Note: Element is not decoupled.
     */
    List.prototype.head = function () {
        if (this.length > 0) {
            return this[0];
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
        this.reIndexKeys();
        return this;
    };
    return List;
}(enumerable_1.Enumerable));
exports.List = List;
//# sourceMappingURL=list.js.map