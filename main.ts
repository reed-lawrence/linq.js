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
   * Add a range of items from an array to the List.
   * @param items array of objects to be added
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
   * @param list List object to be added
   */
  addRangeFromList(...lists: List<T>[]): List<T> {
    for (let i = 0; i < lists.length; i++) {
      this._values = this.addRange(lists[i].values).values;
    }
    return this;
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


  where(predicate: (o: T) => boolean): List<T> {
    const tempArr = new List<T>();
    for (let i = 0; i < this._values.length; i++) {
      if (predicate(this._values[i]) === true) {
        tempArr.add(this._values[i]);
      }
    }
    return tempArr;
  }

  contains<U>(predicate: (o: T) => boolean): boolean {
    return this.where(predicate).length > 0;
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

  spliceIfExists<U>(obj: T, key: (o: T) => U = null): List<T> {
    if (typeof obj === 'object' && key === null) {
      console.warn('Object defined in pushUnique is complex, but a key was not specified.');
    } else if (typeof obj !== 'object' && key !== null) {
      console.warn('Object is not complex, but a key was specified');
    }

    const index = key !== null ? this.findIndex(o => key(o) === key(obj)) : this._values.indexOf(obj);
    if (index !== -1) {
      this._values.splice(index);
    }
    return this;
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

  removeWhere(predicate: (o: T) => boolean): List<T> {
    for (let i = 0; i < this.length; i++) {
      if (predicate(this._values[i]) === true) {
        this._values.splice(i, 1);
        i--;
      }
    }
    return this;
  }

  orderByDescending<U>(key: (o: T) => U): List<T> {
    this._values.sort((a, b) => key(a) > key(b) ? -1 : key(a) < key(b) ? 1 : 0);
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

  sum<U>(key: (o: T) => U = null): number {
    let total = 0;
    if (key !== null) {
      for (let i = 0; i < this.length; i++) {
        const num = parseInt(key(this._values[i]).toString(), 10);
        if (typeof num === 'number') {
          total += num;
        } else {
          console.warn('Non parseable number detected');
        }
      }
      return total;
    }
  }

  average<U>(key: (o: T) => U): number {
    const sum = this.sum(key);
    return sum / this._values.length;
  }

  min<U>(key: (o: T) => U): number {
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
        console.warn('Non parseable number detected');
      }
    }
    return min;
  }

  max<U>(key: (o: T) => U): number {
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
        console.warn('Non number detected');
      }
    }
    return max;
  }

  groupBy<U>(key: (o: T) => U): List<GroupedList<T, U>> {
    const groups: U[] = this.distinct(key).toArray().map(key);
    const output = new List<GroupedList<T, U>>();

    for (let i = 0; i < groups.length; i++) {
      output.addIfDistinct(new GroupedList<T, U>(groups[i], this.where(o => key(o) === groups[i]).toArray()), null, g => g.key);
    }
    return output;
  }

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
    return output;
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
  select<U>(...keys: (keyof T)[]): List<U> {
    let output = new List<U>();

    const _values = this._values.map(i => i);
    for (let i = 0; i < _values.length; i++) {
      let temp: any = {};
      for (let key of keys) {
        const keyType = typeof _values[i][<any>key]
        if (keyType === 'function') {
          console.warn('Function ' + key + ' used as key, will flatten and may perform unexpectedly.');
        } else if (keyType === 'object') {
          // console.warn('Object ${key} used as key, will flatten and may perform unexpectedly.');
          temp[key] = _values[i][<any>key];
        } else {
          temp[key] = _values[i][<any>key];
        }

      }
      output.add(<any>temp);
    }
    return output;
  }

  map<U>(callbackfn: (o: T, index: number, array: T[]) => U): List<U> {
    const mappedVals = _.cloneDeep(this._values.map(callbackfn));
    const output = new List<U>(mappedVals);
    return output;
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
   * Creates a new array decoupling and concatenating array with any additional arrays and/or values
   * @param values the values to concatenate
   * @returns Returns the modified List<T> object
   */
  concat(values: T[]): List<T> {
    const decoupledValues = _.cloneDeep(values);
    _.concat(this._values, decoupledValues)
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
  join(separator = ','): string {
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
   * Performs the specified action for each element in an array.
   * @param callbackfn A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void {
    this._values.forEach(callbackfn);
  }


}



export class TestClass {
  constructor(key: number = null, value: string = null) {
    this.key = key;
    this.value = value;
  }
  key: number;
  value: string;
}

export class StudentClass {
  constructor(name?: string, id?: string, credits?: number) {
    this.name = name;
    this.id = id;
    this.credits = credits;
  }

  name: string;
  id: string;
  credits: number;
}

export class Person {
  constructor(name?: string, age?: number) {
    this.name = name;
    this.age = age;
  }

  name: string;
  age: number;

  print = (): string => {
    return 'Name: ' + this.name + ' | Age: ' + this.age;
  }
}

export class Student extends Person {
  constructor(id?: number, name?: string, age?: number, classes: List<StudentClass> = null) {
    super(name, age);
    this.id = id;
    if (classes === null) {
      this.classes = new List();
    } else {
      this.classes = new List(classes.toArray());
    }

  }
  id: number;
  classes: List<StudentClass>;
}

const objArr = new List<{ name: string, age: number, id: number }>([{
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



const complexObjArray = new List([
  new Student(1, 'Test1', 25, new List<StudentClass>([
    new StudentClass('Intro to Economics', 'ECON 101', 3),
    new StudentClass('Intro to Finance', 'FIN 101', 3)
  ])),
  new Student(2, 'Test2', 22, new List<StudentClass>([
    new StudentClass('Intro to Economics', 'ECON 101', 3),
    new StudentClass('Calculus II', 'MATH 165', 4)
  ])),
  new Student(3, 'Test3', 30, new List<StudentClass>([
    new StudentClass('Calculus II', 'MATH 165', 4),
    new StudentClass('Intro to Java', 'CSCI 121', 3)
  ]))
]);

const objArr2 = new List([
  new Student(1, 'Test4', 26),
  new Student(4, 'Test5', 27)
]);


