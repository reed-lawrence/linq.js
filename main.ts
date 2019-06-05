import * as _ from 'lodash';

export class GroupedList<T, U>{
  key: U;
  collection: List<T>;
  constructor(key: U, items: T[] = null) {
    this.key = key;
    if (items === null) {
      this.collection = new List<T>();
    } else {
      this.collection = new List<T>(items.map(i => i));
    }
  }
}

export class zScoreListItem<T>{
  zScore: number;
  object: T;
  constructor(zScore: number = null, object: T = null) {
    this.object = object;
    this.zScore = zScore;
  }
}

export class List<T> {
  private _values: T[];
  private static _classTypes: 'string' | 'number' | 'undefined' | 'boolean' | 'bigint' | 'symbol' | 'object' | 'function';
  constructor(items?: T[]) {
    if (items === undefined || items === null) {
      this._values = new Array();
    } else {
      this._values = items;
    }

  }

  get(i: number): T {
    return this._values[i];
  }

  get values(): T[] {
    return this._values;
  }

  set(index: number, obj: T): List<T> {
    this._values[index] = obj;
    return this;
  }

  /// STATIC METHODS
  static repeat<T>(obj: T, count: number): List<T> {
    const output: T[] = [];
    for (let i = 0; i < count; i++) {
      output.push(obj);
    }
    return new List(output);
  }

  getRange(start?: number, end?: number): List<T> {
    if (start > this._values.length - 1) {
      throw new Error('Index out of range exception. The specified index ' + start + ' does not exist in target List.');
    } else if (end > this._values.length - 1) {
      throw new Error('Index out of range exception. The specified index ' + end + ' does not exist in target List.');
    } else if (start < 0) {
      throw new Error('Index out of range exception. The specified index ' + start + ' does not exist in target List.');
    } else if (end < 0) {
      throw new Error('Index out of range exception. The specified index ' + end + ' does not exist in target List.');
    } else if ((start !== null && end !== null) && (start > end)) {
      throw new Error('Starting index must be less than or equal to the ending index in the getRange method');
    }

    const output = new List<T>();
    if (start === null && end !== null) {
      for (let i = 0; i <= end; i++) {
        output.add(this._values[i]);
      }
    } else if (start !== null && end === null) {
      for (let i = start; i < this._values.length; i++) {
        output.add(this._values[i]);
      }
    } else if (start !== null && end !== null) {
      for (let i = start; i <= end; i++) {
        output.add(this._values[i]);
      }
    } else {
      throw new Error('getRange must specify either start, end, or both.');
    }
    return output;
  }

  clear(): List<T> {
    this._values = new Array();
    return this;
  }

  findIndex<U>(predicate: (o: T) => boolean, fromIndex = 0): number {
    for (let i = fromIndex; i < this._values.length; i++) {
      if (predicate(this._values[i]) === true) {
        return i;
      }
    }
    return -1;
  }

  indexOf(obj: T, fromIndex = 0): number {
    for (let i = fromIndex; i < this._values.length; i++) {
      if (_.isEqual(obj, this._values[i])) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Get the length of the current List
   */
  get length(): number {
    return this._values.length;
  }

  /**
   * Get the index of the last object in the List. Returns -1 if the List is empty.
   */
  get lastIndex(): number {
    if (this._values.length > 0) {
      return this._values.length - 1;
    } else {
      return -1;
    }
  }

  /**
   * Add an object to the List. If no index is specified, object will be appended to the end of the List.
   * @param obj Object to add to the List
   * @param atIndex Optional: Add to a specified location in the List
   */
  add(obj: T, atIndex?: number): List<T> {
    if (atIndex === undefined || atIndex === null) {
      this._values.push(obj);
    } else {
      if (atIndex > this._values.length - 1) {
        throw new Error('Index out of range exception. The specified index ' + atIndex + ' does not exist in target List.');
      } else if (atIndex !== null && atIndex < 0) {
        throw new Error('Index out of range exception. The specified index ' + atIndex + ' does not exist in target List.');
      }

      const tempArr1: T[] = [];
      const tempArr2: T[] = [];
      for (let i = 0; i < this._values.length; i++) {
        if (i < atIndex) {
          tempArr1.push(this._values[i]);
        } else {
          tempArr2.push(this._values[i]);
        }
      }
      this._values = new Array();
      for (let i = 0; i < tempArr1.length; i++) {
        this._values.push(tempArr1[i]);
      }
      this._values.push(obj);
      for (let i = 0; i < tempArr2.length; i++) {
        this._values.push(tempArr2[i]);
      }
    }
    return this;
  }

  /**
   * Appends a value to the end of the List<T>.
   * @param obj The object<T> to append to the List<T>
   * @returns Returns the modified List<T>
   */
  append(obj: T): List<T> {
    this.add(obj);
    return this;
  }

  /**
   * Adds a value to the beginning of the List<T>.
   * @param obj The value to prepend to source.
   * @returns Returns the modified List<T>
   */
  prepend(obj: T): List<T> {
    const arr: T[] = [obj];
    for (let i = 0; i < this._values.length; i++) {
      arr.push(this._values[i]);
    }
    this._values = arr;
    return this;
  }

  /**
   * Add a range of items from an array to the List.
   * @param items array of objects to be added
   * @returns Returns the modified List<T>
   */
  addRange(items: T[]): List<T> {
    if (items !== null) {
      const temp = _.cloneDeep(items);
      for (let i = 0; i < temp.length; i++) {
        this._values.push(temp[i]);
      }
    }
    return this;
  }

  /**
   * Add a range of items from a List<T>
   * @param list List object to be added
   * @returns Returns the modified List<T>
   */
  addRangeFromList(...lists: List<T>[]): List<T> {
    for (let i = 0; i < lists.length; i++) {
      this._values = this.addRange(lists[i].values).values;
    }
    return this;
  }

  /**
   * Concatenate a second List<T> to an existing List<T>. Elements will be added in order to the end of the existing List<T>.
   * @param list List<T> to concatenate
   * @returns Returns the modified List<T>
   */
  concat(list: List<T>): List<T> {
    return this.addRangeFromList(_.cloneDeep(list));
  }



  /**
   * Creates a List of unique values, in order, from all of the provided arrays using SameValueZero for equality comparisons.
   * @param array The arrays to inspect.
   * @returns New sorted and decoupled List of unioned objects
   */
  union(array: T[]): List<T> {
    return new List(_.cloneDeep(_.union(this._values, array)));
  }

  /**
   * This method is like .union except that it accepts iteratee which is invoked for each element of each List to generate the criterion by which uniqueness is computed. The iteratee is invoked with one argument: (value).
   * @param array The arrays to inspect.
   * @param key The iteratee invoked per element.
   * @returns New sorted and decoupled List of unioned objects
   */
  unionBy<U>(array: T[], key: (o: T) => U): List<T> {
    return new List(_.cloneDeep(_.unionBy(this._values, array, key)));
  }

  /**
   * This method is like _.union except that it accepts comparator which is invoked to compare elements of Lists. The comparator is invoked with two arguments: (arrVal, othVal).
   * @param array The arrays to inspect.
   * @param comparator The comparator invoked per element.
   * @returns New sorted and decoupled List of unioned objects
   */
  unionWith(array: T[], comparator: _.Comparator<T>): List<T> {
    return new List(_.cloneDeep(_.unionWith(this._values, array, comparator)));
  }

  /**
   * Creates a List of unique values, in order, from all of the provided arrays using SameValueZero for equality comparisons.
   * @param list The List to inspect.
   * @returns New sorted and decoupled List of unioned objects
   */
  unionList(list: List<T>): List<T> {
    return this.union(list.toArray());
  }

  /**
   * This method is like .unionList except that it accepts iteratee which is invoked for each element of each List to generate the criterion by which uniqueness is computed. The iteratee is invoked with one argument: (value).
   * @param array The List to inspect.
   * @param key The iteratee invoked per element.
   * @returns New sorted and decoupled List of unioned objects
   */
  unionListBy<U>(list: List<T>, key: (o: T) => U): List<T> {
    return this.unionBy(list.toArray(), key);
  }

  /**
   * This method is like _.unionList except that it accepts comparator which is invoked to compare elements of Lists. The comparator is invoked with two arguments: (arrVal, othVal).
   * @param array The List to inspect.
   * @param comparator The comparator invoked per element.
   * @returns New sorted and decoupled List of unioned objects
   */
  unionListWith(list: List<T>, comparator: _.Comparator<T>): List<T> {
    return this.unionWith(list.toArray(), comparator);
  }

  /**
   * Filters a sequence of values based on a predicate.
   * @param predicate Callback function of the conditions to check against the elements
   * @returns A List<T> that contains elements from the input sequence that satisfy the condition.
   */
  where(predicate: (o: T) => boolean): List<T> {
    const tempArr = new List<T>();
    for (let i = 0; i < this._values.length; i++) {
      if (predicate(this._values[i]) === true) {
        tempArr.add(this._values[i]);
      }
    }
    return _.cloneDeep(tempArr);
  }

  /**
   * Return true or false if specified object exists in the List<T>
   * @param predicate Callback function to evaluate each iteration of the List<T>
   * @returns Returns boolean of expression
   */
  contains<U>(obj: T): boolean {
    return this.indexOf(obj) !== -1;
  }

  /**
   * Return true or false if specified condition exists in one or more iterations of the List<T>
   * @param predicate Callback function to evaluate each iteration of the List<T>
   * @returns Returns boolean of expression
   */
  exists(predicate: (o: T) => boolean): boolean {
    for (let i = 0; i < this._values.length; i++) {
      if (predicate(this._values[i]) === true) {
        return true;
      }
    }
    return false;
  }

  /**
   * (Alias of List<T>.exists())
   * Return true or false if specified condition exists in one or more iterations of the List<T>
   * @param predicate Callback function to evaluate each iteration of the List<T>
   * @returns Returns boolean of expression
   */
  any(predicate: (o: T) => boolean): boolean {
    return this.exists(predicate);
  }

  toArray(): T[] {
    return this._values.map(i => i);
  }

  addIfDistinct<U>(obj: T, atIndex: number = null, key: (o: T) => U = null): List<T> {
    if (typeof obj === 'object' && key === null) {
      console.warn('Object defined in pushUnique is complex, but a key was not specified.');
    } else if (typeof obj !== 'object' && key !== null) {
      console.warn('Object is not complex, but a key was specified');
    }

    const index = key !== null ? this.findIndex(o => key(o) === key(obj)) : this._values.indexOf(obj);
    if (index === -1) {
      this.add(obj, atIndex);
    }

    return this;
  }

  distinct<U>(key: (o: T) => U = null): List<T> {
    const output = new List<T>();
    for (let i = 0; i < this._values.length; i++) {
      output.addIfDistinct(this.values[i], null, key);
    }
    return _.cloneDeep(output);
  }

  /**
   * Removes an object from the List by performing deep comparison
   * @param obj The object to remove
   * @returns The modified List Object
   */
  remove(obj: T): List<T> {
    for (let i = 0; i < this._values.length; i++) {
      const index = this.indexOf(obj);
      if (index !== -1) {
        this._values.splice(i, 1);
      } else {
        i = this._values.length;
      }
    }
    return this;
  }

  /**
   * Remove all objects within the List<T> where the predicate expression evaluates to true.
   * @param predicate Callback expression to evaluate over each iteration of the List<T>
   * @returns Returns the modified List<T>
   */
  removeAll(predicate: (o: T) => boolean): List<T> {
    for (let i = 0; i < this.length; i++) {
      if (predicate(this._values[i]) === true) {
        this._values.splice(i, 1);
        i--;
      }
    }
    return this;
  }

  /**
   * (Alias of Array.splice())
   * Remove a single object from the List<T> at the specified index.
   * @param index The zero-based index of the element to remove.
   * @returns Returns the modified List<T>
   */
  removeAt(index: number): List<T> {
    if (index < 0 || index > this._values.length - 1) {
      throw new Error('Index out of range: List<T>.removeAt() index specified does not exist in List');
    }

    this._values.splice(index, 1);
    return this;
  }



  /**
   * (Alias of Array.splice())
   * Remove a range of elements from List<T>
   * @param start The zero-based starting index of the range of elements to remove.
   * @param count The number of elements to remove.
   * @returns Returns the modified List<T>
   */
  removeRange(start: number = 0, count: number = 1): List<T> {
    if (start < 0 || start > this._values.length - 1 || start === null || start === undefined) {
      throw new Error('Index out of range: List<T>.removeRange() start index specified does not exist in List');
    } else if (count === null || count === undefined) {
      throw new Error('Argument exception: List<T>.removeRange() count must not be null or undefined');
    }
    this._values.splice(start, count);
    return this;
  }



  /**
   * Sorts a List.
   * @param compareFn The name of the function used to determine the order of the elements. If omitted, the elements are sorted in ascending, ASCII character order.
   */
  sort(compareFn?: (a: T, b: T) => number): List<T> {
    this._values = this._values.sort(compareFn)
    return this;
  }

  /**
   * Orders a List<T>. Specify an optional key and Ascending or Descending order.
   * @param key The callback to specify which parameter of <T> to order by
   * @param order Specify 'asc' for Ascending, 'desc' for Descending. Ascending by default.
   */
  orderBy<U>(key: (o: T) => U = null, order: 'desc' | 'asc' = 'asc'): List<T> {
    if (order !== 'asc' && order !== 'desc') {
      throw new Error('Argument Exception: order must be asc or desc.');
    }
    if (key !== null) {
      if (order === 'asc') {
        this._values.sort((a, b) => key(a) > key(b) ? 1 : key(a) < key(b) ? -1 : 0);
      } else if (order === 'desc') {
        this._values.sort((a, b) => key(a) > key(b) ? -1 : key(a) < key(b) ? 1 : 0);
      }
    } else {
      if (order === 'asc') {
        this.values.sort((a, b) => a > b ? 1 : a < b ? -1 : 0);
      } else if (order === 'desc') {
        this.values.sort((a, b) => a > b ? -1 : a < b ? 1 : 0);
      }
    }
    return this;
  }

  orderByAscending<U>(key: (o: T) => U = null): List<T> {
    if (key !== null) {
      this._values.sort((a, b) => key(a) > key(b) ? 1 : key(a) < key(b) ? -1 : 0);
    } else {
      this.values.sort((a, b) => a > b ? 1 : a < b ? -1 : 0);
    }
    return this;
  }

  /**
   * Get the count of elements in List<T> as defined by a predicate callback function.
   * @param predicate Callback function of the conditions to check against the elements
   * @returns Returns count
   */
  count(predicate: (o: T) => boolean = null): number {
    if (predicate === null) {
      return this._values.length;
    } else {
      let count = 0;
      for (let i = 0; i < this._values.length; i++) {
        if (predicate(this._values[i]) === true) {
          count++;
        }
      }
      return count;
    }
  }

  /// MATH FUNCTIONS

  /**
   * Calculate the sum of a List<T>. Optional numeric key callback.
   * @param key Numeric key of values to calculate
   * @returns Returns sum
   */
  sum<U>(key: (o: T) => U = null): number {
    let total = 0;
    if (key !== null) {
      for (let i = 0; i < this.length; i++) {
        const num = parseInt(key(this._values[i]).toString(), 10);
        if (typeof num === 'number') {
          total += num;
        } else {
          console.warn('Argument Exception: List<T>.sum: Non number detected in List');
        }
      }
      return total;
    }
  }

  /**
   * Calculate the mean of a List<T>. Optional numeric key callback.
   * @param key Numeric key of values to calculate
   * @returns Returns mean
   */
  mean(key: (o: T) => number = null): number {
    const sum = this.sum(key);
    return sum / this._values.length;
  }

  /**
   * Get the minimum value of a List<T>. Optional numeric key callback.
   * @param key Numeric key of values to calculate
   * @returns Returns minimum
   */
  min(key: (o: T) => number = null): number {
    let min = null;
    for (let i = 0; i < this._values.length; i++) {
      const val = parseInt(key(this._values[i]).toString(), 10);
      if (typeof val === 'number') {
        if (min === null) {
          min = val;
        } else {
          if (val < min) {
            min = val;
          }
        }
      } else {
        console.warn('Argument Exception: List<T>.min: Non number detected in List');
      }
    }
    return min;
  }

  /**
   * Get the maximum value of a List<T>. Optional numeric key callback.
   * @param key Numeric key of values to calculate
   * @returns Returns maximum
   */
  max(key: (o: T) => number = null): number {
    let max = null;
    for (let i = 0; i < this._values.length; i++) {
      const val = parseInt(key(this._values[i]).toString(), 10);
      if (typeof val === 'number') {
        if (max === null) {
          max = val;
        } else {
          if (val > max) {
            max = val;
          }
        }
      } else {
        console.warn('Argument Exception: List<T>.max: Non number detected in List');
      }
    }
    return max;
  }

  /**
   * Calculate median of a List<T>. Optional numeric key callback.
   * @param key Numeric key of values to calculate
   * @returns Returns median
   */
  median(key: (o: T) => number = null): number {
    const nums: number[] = this._values.map(o => key(o)).sort((a, b) => a - b);
    const midpoint = nums.length / 2;
    if (nums.length % 2 === 0) {
      return nums[midpoint];
    } else {
      return (nums[midpoint - 1] + nums[midpoint]) / 2;
    }
  }

  /**
   * Calculate modes of a List<T>.nOptional numeric key callback.
   * @param key Numeric key of values to calculate
   * @returns Returns array of modes
   */
  modes(key: (o: T) => number = null): number[] {
    const list = new List<{ num: number; count: number }>();
    for (let i = 0; i < this._values.length; i++) {
      const index = list.findIndex(o => o.num === key(this._values[i]));
      if (index !== -1) {
        list.values[index].count++;
      } else {
        list.add({ count: 1, num: key(this._values[i]) });
      }
    }

    const max = list.max(o => o.count);
    return list.where(o => o.count === max).map(o => o.num).toArray();
  }

  /**
   * Caluclate range of a List<T>. Optional numeric key callback.
   * @param key Numeric key of values to calculate
   * @returns Returns range
   */
  range(key: (o: T) => number = null): number {
    const list = new List(this._values.map(key));
    return this.max(key) - this.min(key);
  }

  /**
   * Calculate midrange of List. Optional numeric key callback.
   * @param key Numeric key of values to calculate
   * @returns Returns midrange
   */
  midrange(key: (o: T) => number = null): number {
    const list = new List(this._values.map(key));
    return this.range(key) / 2;
  }

  /**
   * Calculate Variance of List. Optional numeric key callback.
   * @param key Numeric key of values to calculate
   * @returns Returns variance
   */
  variance(key: (o: T) => number = null): number {
    const mean = this.mean(key);
    const nums: number[] = this._values.map(key);
    return new List(nums.map(num => Math.pow(num - mean, 2))).mean();
  }

  /**
   * Calculate Standard Deviation. Optional numeric key callback.
   * @param key Numeric key of values to calculate
   * @returns Returns standard deviation
   */
  stdDev(key: (o: T) => number = null): number {
    return Math.sqrt(this.variance(key));
  }

  /**
   * Calculate Mean Absolute Deviation. Optional numeric key callback.
   * @param key Numeric key of values to calculate
   * @returns Returns mean absolute deviation
   */
  meanAbsDev(key: (o: T) => number = null): number {
    const mean = this.mean(key);
    const nums: number[] = this._values.map(key);
    return new List(nums.map(num => Math.abs(num - mean))).mean();
  }

  /**
   * Calculate Z-Score from a given list. Returns object of zScoreListItems that contains the oringial object and it's respective zScore. Optional numeric key callback.
   * @param key Numeric key of values to calculate Z-Score
   * @returns Returns List of zScoreListItems
   */
  zScores(key: (o: T) => number = null): List<zScoreListItem<T>> {
    const mean = this.mean(key);
    const stdDev = this.stdDev(key);
    const output = new List<zScoreListItem<T>>();
    for (let i = 0; i < this._values.length; i++) {
      output.add(new zScoreListItem(
        (key(this._values[i]) - mean) / stdDev, this._values[i]
      ));
    }
    return output;
  }

  /**
   * Determines whether every element in the List<T> matches the conditions defined by the specified predicate.
   * @param predicate Callback function of the conditions to check against the elements.
   * @returns Returns true or false
   */
  trueForAll(predicate: (o: T) => boolean): boolean {
    let output = true;
    for (let i = 0; i < this._values.length; i++) {
      if (predicate(this._values[i]) === false) {
        output = false;
      }
    }
    return output;
  }

  /**
   * Copies a range of elements from the List<T> to a compatible one-dimensional array, starting at the specified index of the target array.
   * @param array The one-dimensional Array that is the destination of the elements copied from List<T>. The Array must have zero-based indexing.
   * @param fromIndex The zero-based index in the source List<T> at which copying begins.
   * @param atIndex The zero-based index in array at which copying begins.
   * @param count The number of elements to copy.
   */
  copyTo(array: T[], fromIndex = 0, atIndex = 0, count = this._values.length): void {
    if (fromIndex < 0 || fromIndex > this._values.length) {
      throw new Error('Index out of range: fromIndex (' + fromIndex + ') does not exist in specified array.');
    } else if (atIndex < 0 || atIndex > array.length) {
      throw new Error('Index out of range: atIndex (' + atIndex + ') does not exist in target array.');
    } else if (count < 1 || count > this._values.length) {
      throw new Error('Argument Exception: count (' + count + ') is less than 1 or greater than the length of the specified array');
    }

    const output: T[] = array.slice(0, atIndex);
    _.cloneDeep(this._values.slice(fromIndex, count)).forEach(v => { output.push(v) });
    array.slice(atIndex, array.length).forEach(v => output.push(v));
    array = output;
  }

  /**
   * Copies a range of elements from the List<T> to a compatible List<T>, starting at the specified index of the target List.
   * @param list The List<T> that is the destination of the elements copied from List<T>.
   * @param fromIndex The zero-based index in the source List<T> at which copying begins.
   * @param atIndex The zero-based index in List at which copying begins.
   * @param count The number of elements to copy.
   */
  copyToList(list: List<T>, fromIndex = 0, atIndex = 0, count = this._values.length): void {
    const arr: T[] = _.cloneDeep(list.values);
    this.copyTo(arr, fromIndex, atIndex, count);
    list._values = arr;
  }

  /**
   * Group the List<T> by a specified Key
   * @param key 
   * @returns Returns new List of GroupList<T> on Key of U
   */
  groupBy<U>(key: (o: T) => U): List<GroupedList<T, U>> {
    const groups: U[] = this.distinct(key).toArray().map(key);
    const output = new List<GroupedList<T, U>>();

    for (let i = 0; i < groups.length; i++) {
      output.addIfDistinct(new GroupedList<T, U>(groups[i], this.where(o => key(o) === groups[i]).toArray()), null, g => g.key);
    }
    return output;
  }

  /**
   * Ungroup a grouped List<T>. TypeScript Note: Specify type upon function call for best results.
   * @returns Returns a new decoupled ungrouped List<U>.
   */
  unGroup<U>(): List<U> {
    const output = new List<U>();
    let temp: List<GroupedList<U, any>> = new List(<any>this._values);
    for (let i = 0; i < temp.values.length; i++) {
      for (let j = 0; j < temp.values[i].collection.values.length; j++) {
        output.add(temp.values[i].collection.values[j]);
      }
    }
    return _.cloneDeep(output);
  }

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
  join<TInner, TKey, TResult>(inner: List<TInner>, outerKeySelector: (o: T) => TKey, innerKeySelector: (o: TInner) => TKey, resultSelector: (outer: T, inner: TInner) => TResult): List<TResult> {
    const output = new List<TResult>();
    for (const _inner of inner._values) {
      for (const _outer of this._values) {
        if (_.isEqual(innerKeySelector(_inner), outerKeySelector(_outer)) === true) {
          output.add(resultSelector(_outer, _inner));
        }
      }
    }
    return _.cloneDeep(output);
  }

  /**
   * Filter and return a new decoupled List<U> containing only elements of a specified type.
   * @param type Pick from predefined types, or pass a Class reference to filter by
   * @returns Returns List<U> 
   */
  ofType<U>(type: typeof List._classTypes | U): List<U> {
    const output = new List<U>();
    const objectKeys = Object.keys(type);
    for (let i = 0; i < this._values.length; i++) {
      if (typeof type === 'object') {
        let allKeysMatch = true;
        const _keys = Object.keys(this._values[i]);
        for (let j = 0; j < objectKeys.length; j++) {
          let exists = _keys.indexOf(objectKeys[j]) !== -1;
          if (exists === false) {
            allKeysMatch = false;
          }
        }

        if (allKeysMatch === true) {
          output.add(<any>this._values[i]);
        }
      } else {
        if (typeof this[i] === type) {
          output.add(<any>this._values[i]);
        }
      }
    }
    return _.cloneDeep(output);
  }

  /**
   * Returns the first element that matches the specified criteria. Returns null if not found.
   * Note: Does not decouple the object from the List.
   * @param predicate The expression to evaluate
   * @returns First matching element or null if not found.
   */
  first(predicate: (o: T) => boolean): T {
    for (let i = 0; i < this._values.length; i++) {
      if (predicate(this._values[i]) === true) {
        return this._values[i];
      }
    }
    return null;
  }

  /**
   * Select a list of columns, this method will flatten any class methods;
   */
  select<TResult>(selector: (o: T, index: number) => TResult): List<TResult> {
    let output = new List<TResult>();
    for (let i = 0; i < this._values.length; i++) {
      output.add(selector(this._values[i], i));
    }
    return _.cloneDeep(output);
  }

  /**
   * (Alias of Array.prototype.map)
   * Calls a defined callback function on each element of a List<T>, and returns a decoupled List<U> that contains the results.
   * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   * @returns Returns a decoupled List<U> mapped to the desired type.
   */
  map<U>(callbackfn: (o: T, index: number, array: T[]) => U, thisArg?: any): List<U> {
    const mappedVals = _.cloneDeep(this._values.map(callbackfn, thisArg));
    return new List<U>(mappedVals);
  }

  /**
   * (Alias of List<T>.map)
   * Calls a defined callback function on each element of a List<T>, and returns a decoupled List<U> that contains the results.
   * @param converter Callback function to map type T into type U
   * @returns Returns a decoupled List<U> converted to the desired type.
   */
  convert<U>(converter: (o: T) => U): List<U> {
    return this.map(converter);
  }

  /**
   * Override method to force TypeScript compiler to treat values as specified by the type declaration. 
   * **For type conversions use List<T>.convert() or List<T>.map()** 
   */
  cast<CastTo>(): List<CastTo> {
    return new List<CastTo>(this._values.map(i => <any>i));
  }

  /// LODASH REPRO METHODS

  /**
   * Creates an array of elements split into groups the length of size. If collection can’t be split evenly, the final chunk will be the remaining elements.
   * @param chunkSize size of each chunk
   * @returns Returns a List of Lists object
   */
  chunk(chunkSize: number): List<List<T>> {
    const output = new List<List<T>>();
    const chunks: T[][] = _.chunk(this._values, chunkSize);
    for (let i = 0; i < chunks.length; i++) {
      output.add(new List(chunks[i]));
    }
    return output;
  }

  /**
   * Decouples and returns an array with all false-y values removed.
   * @returns Returns the modified List<T> object
   */
  compact(): List<T> {
    const decoupledArr = _.cloneDeep(this._values);
    this._values = _.compact(decoupledArr);
    return this;
  }

  /**
   * Creates a slice of array with n elements dropped from the beginning.
   * @param toDrop number of elements to drop. 1 by default.
   * @returns Returns the modified List<T> object
   */
  drop(toDrop: number = 1): List<T> {
    this._values = _.drop(this._values, toDrop);
    return this;
  }

  /**
   * Creates a slice of array excluding elements dropped from the beginning. 
   * Elements are dropped until predicate returns falsey. 
   * The predicate is invoked with three arguments: (value, index, array).
   * @param predicate function evoked per iteration 
   * @returns Returns the modified List<T> object
   */
  dropWhile(predicate: (o: T) => boolean): List<T> {
    this._values = _.dropWhile(this._values, predicate);
    return this;
  }

  /**
   * Creates a slice of array with n elements dropped from the end.
   * @param toDrop number of elements to drop. 1 by default.
   * @returns Returns the modified List<T> object
   */
  dropRight(toDrop: number = 1): List<T> {
    this._values = _.dropRight(this._values, toDrop);
    return this;
  }

  /**
   * Creates a slice of array excluding elements dropped from the end. 
   * Elements are dropped until predicate returns falsey. 
   * The predicate is invoked with three arguments: (value, index, array).
   * @param predicate The function invoked per iteration.
   * @returns Returns the modified List<T> object
   */
  dropRightWhile(predicate: (o: T) => boolean): List<T> {
    this._values = _.dropRightWhile(this._values, predicate);
    return this;
  }

  /**
   * Fills elements of array with value from start up to, but not including, end.
   * @param value The value to fill array with.
   * @param start The start position.
   * @param end The end position.
   * @returns Returns the modified List<T> object
   */
  fill(value: T, start: number = 0, end: number = this._values.length): List<T> {
    this._values = _.fill(this._values, value);
    return this;
  }

  /**
   * Find the last index of a specified criteria
   * @param predicate The expression to evaluate.
   * @param fromIndex Index to start search. Default is 0;
   * @returns Returns the modified List<T> object
   */
  findLastIndex(predicate: (o: T) => boolean, fromIndex: number = 0): number {
    let index = -1;
    for (let i = 0; i < this._values.length; i++) {
      if (predicate(this._values[i]) === true) {
        index = i;
      }
    }
    return index;
  }

  /**
   * Flattens the List a single level deep.
   * @returns Returns the modified List<T> object
   */
  flatten(): List<T> {
    this._values = _.flatten(this._values);
    return this;
  }

  /**
   * Recursively flattens the List.
   * @returns Returns the modified List<T> object
   */
  flattenDeep(): List<T> {
    this._values = _.flatMapDeep(this._values);
    return this;
  }

  /**
   * Recursively flattens the List up to a depth.
   * @param depth The maximum recursion depth.
   * @returns Returns the modified List<T> object
   */
  flattenDepth(depth: number = 1): List<T> {
    this._values = _.flattenDepth(this._values, depth);
    return this;
  }

  /**
   * @returns The first element in the array. Note: Element is not decoupled.
   */
  head(): T {
    if (this._values.length > 0) {
      return this._values[0];
    } else {
      return null;
    }
  }


  /**
   * @returns Returns all but the last element of the List 
   */
  initial(): List<T> {
    return new List<T>(_.initial(this._values));
  }

  /**
   * Adds all the elements of an array separated by the specified separator string.
   * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
   */
  split(separator = ','): string {
    return this._values.join(separator);
  }

  /**
   * @returns The last element in the List. Note: Does not decouple the returned object.
   */
  last(): T {
    return this._values[this._values.length - 1];
  }

  /**
   * @param obj The object to find within the List
   * @param fromIndex The starting index of the search. Default is 0.
   * @returns Returns the last index of an object
   */
  lastIndexOf(obj: T, fromIndex = 0): number {
    let index = -1;
    for (let i = fromIndex; i < this._values.length; i++) {
      if (_.isEqual(obj, this._values[i]) === true) {
        index = i;
      }
    }
    return index;
  }

  /** 
   * @returns The modified List with the order reversed.
  */
  reverse(): List<T> {
    this._values = _.reverse(this._values);
    return this;
  }

  /**
   * Returns a decoupled List of sliced objects.
   * @param start The beginning of the specified portion of the List.
   * @param end The end of the specified portion of the List.
   * @returns A new decoupled List of the sliced objects
   */
  slice(start = 0, end = this._values.length): List<T> {
    return new List(_.cloneDeep(this._values.slice(start, end)));
  }

  /**
   * Uses a binary search to determine the lowest index at which value should be inserted into the List in order to maintain its sort order.
   * @param obj The value to evaluate.
   * @returns Returns the index of the matched value, else -1.
   */
  sortedIndex(obj: T): number {
    return _.sortedIndex(this._values, obj);
  }

  /**
   * This method is like .sortedIndex except that it accepts a key which is invoked for value and each element of the List to compute their sort ranking. The iteratee is invoked with one argument: (value).
   * @param obj The value to evaluate.
   * @param key The iteratee invoked per element.
   * @returns Returns the index of the matched value, else -1.
   */
  sortedIndexBy<U>(obj: T, key: (o: T) => U): number {
    return _.sortedIndexBy(this._values, obj, key);
  }

  /**
   * This method is like .indexOf except that it performs a binary search on a sorted List.
   * @param obj The value to evaluate.
   * @returns Returns the index of the matched value, else -1.
   */
  sortedIndexOf(obj: T): number {
    return _.sortedIndexOf(this._values, obj);
  }

  /**
   * This method is like .sortedIndex except that it returns the highest index at which value should be inserted into the List in order to maintain its sort order.
   * @param obj The value to evaluate.
   * @returns Returns the index of the matched value, else -1.
   */
  sortedLastIndex(obj: T): number {
    return _.sortedLastIndex(this._values, obj);
  }

  /**
   * This method is like .sortedLastIndex except that it accepts iteratee which is invoked for value and each element of the List to compute their sort ranking. The iteratee is invoked with one argument: (value).
   * @param obj The value to evaluate.
   * @param key The iteratee invoked per element.
   * @returns Returns the index of the matched value, else -1.
   */
  sortedLastIndexBy<U>(obj: T, key: (o: T) => U): number {
    return _.sortedLastIndexBy(this._values, obj, key);
  }

  /**
   * This method is like .lastIndexOf except that it performs a binary search on a sorted List.
   * @param obj The value to evaluate.
   * @returns Returns the index of the matched value, else -1.
   */
  sortedLastIndexOf(obj: T): number {
    return _.sortedLastIndexOf(this._values, obj);
  }

  /**
   * Gets all but the first element of List. List returned is decoupled.
   * @returns new decoupled list containing all but first element of original List
   */
  tail(): List<T> {
    return new List(_.cloneDeep(_.tail(this._values)));
  }

  /**
   * Gets a random element from the List.
   * @returns Returns the random element.
   */
  sample(): T {
    return _.sample(this._values);
  }

  /**
   * Gets n random elements at unique keys from the List up to the size of collection. Note: Sample is not decoupled.
   * @param n The number of elements to sample.
   * @returns Returns List<T> of the random elements.
   */
  sampleSize(n: number = 1): List<T> {
    return new List(_.sampleSize(this._values, n));
  }


  /**
   * Creates a List<T> of shuffled values, using a version of the Fisher-Yates shuffle.
   * @returns Returns the new shuffled List<T>.
   */
  shuffle(): List<T> {
    _.shuffle(this._values);
    return this;
  }


  /// NATIVE REPRO

  /**
   * Performs the specified action for each element in an array.
   * @param callbackfn A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void {
    this._values.forEach(callbackfn);
  }

  /**
   * Removes the last element from an array and returns it.
   */
  pop(): T {
    return this._values.pop();
  }

  /**
   * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function. Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
   */
  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T = null): T {
    if (initialValue === null) {
      return this._values.reduce(callbackfn);
    } else {
      return this._values.reduce(callbackfn, initialValue);
    }
  }





}


export class Person {
  name: string;
  constructor(name: string = null) {
    this.name = name;
  }
}

export class Pet {
  name: string;
  age: number;
  owner: Person;
  constructor(name: string = null, age: number = null, owner: Person = null) {
    this.name = name;
    this.age = age;
    if (this.owner === null) {
      this.owner = new Person();
    } else {
      this.owner = owner
    }
  }
}


const people = new List([
  new Person('Terry'),
  new Person('Magnus'),
  new Person('Charlotte')
]);

const pets = new List([
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

const query = pets.select((pet, index) => {
  return { index: index, str: pet.name };
});

for(const obj of query.values){
  console.log('index ' + obj.index + ' str: ' + obj.str);
}


