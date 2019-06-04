export class JSLinqArrayGrouped<T, U>{
  Key: U;
  Collection: JSLinqArray<T>;

  constructor(key: U, values?: JSLinqArray<T>) {
    this.Key = key;
    if (values !== null) {
      this.Collection = values;
    } else {
      this.Collection = new JSLinqArray<T>();
    }
  }
}

export class JSLinqArray<T> extends Array<T> {
  constructor(arr?: Array<T>) {
    super(...arr);

     this.toArray = (): T[] => {
      const temp: T[] = [];
      for (let i = 0; i < this.length; i++) {
        temp.push(this[i]);
      }
      return temp;
    }
    console.log(this);
  }

  static _classTypes: 'string' | 'number' | 'undefined' | 'boolean' | 'bigint' | 'symbol' | 'object' | 'function';

  where = (predicate: (o: T) => boolean): JSLinqArray<T> => {
    const tempArr = new JSLinqArray<T>();
    for (let i = 0; i < this.length; i++) {
      const something = this[i];
      if (predicate(this[i]) === true) {
        tempArr.push(this[i]);
      }
    }
    return tempArr;
  }

  mapToExplicit = <U>(type: new () => U): JSLinqArray<U> => {
    console.log(Object.keys(type));
    const output = new JSLinqArray<U>();
    for (let i = 0; i < this.length; i++) {
      // var temp: U = Object.create(<any>typeRef);
      const temp: U = new type();
      let anyExists = false;
      for (const newKey of Object.keys(temp)) {
        let keyExists = false;
        for (const existKey of Object.keys(this[i])) {
          if (existKey === newKey) {
            temp[newKey] = this[i][existKey];
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
  }

  mapToImplicit = <U>(typeRef: U): JSLinqArray<U> => {
    console.log(Object.keys(typeRef));
    const output = new JSLinqArray<U>();
    for (let i = 0; i < this.length; i++) {
      var temp: U = Object.create(<any>typeRef);
      let anyExists = false;
      for (const newKey of Object.keys(typeRef)) {
        let keyExists = false;
        for (const existKey of Object.keys(this[i])) {
          if (existKey === newKey) {
            temp[newKey] = this[i][existKey];
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
  }

  pushUnique = <U>(obj: T, key: (o: T) => U = null, logVerbose: boolean = false): void => {
    if (logVerbose === true) {
      console.log('pushUnique called');
    }
    if (typeof obj === 'object' && key === null) {
      console.warn('Object defined in pushUnique is complex, but a key was not specified.');
    } else if (typeof obj !== 'object' && key !== null) {
      console.warn('Object is not complex, but a key was specified');
    }

    const index = key !== null ? this._findIndex(this, obj, o => key(o) === key(obj)) : this.indexOf(obj);
    if (index === -1) {
      this.push(obj);
    } else {
      if (logVerbose === true) {
        console.log('Duplicate object, not added');
      }
    }
  }

  spliceIfExists = <U>(obj: T, key: (o: T) => U = null): void => {
    if (typeof obj === 'object' && key === null) {
      console.warn('Object defined in pushUnique is complex, but a key was not specified.');
    } else if (typeof obj !== 'object' && key !== null) {
      console.warn('Object is not complex, but a key was specified');
    }

    const index = key !== null ? this._findIndex(this, obj, o => key(o) === key(obj)) : this.indexOf(obj);
    if (index !== -1) {
      this.splice(index);
    }
  }

  spliceWhere = <U>(predicate: (o: T) => boolean): void => {
    for (let i = 0; i < this.length; i++) {
      if (predicate(this[i]) === true) {
        this.splice(i, 1);
        i--;
      }
    }
  }

  ofType = <U>(type: typeof JSLinqArray._classTypes | U): JSLinqArray<U> => {
    const output = new JSLinqArray<U>();
    const objectKeys = Object.keys(type);
    for (let i = 0; i < this.length; i++) {
      if (typeof type === 'object') {
        let allKeysMatch = true;
        const _keys = Object.keys(this[i]);
        for (let j = 0; j < objectKeys.length; j++) {
          let exists = _keys.indexOf(objectKeys[j]) !== -1;
          // console.log(_keys[j] + ' ' + exists);
          if (exists === false) {
            allKeysMatch = false;
          }
        }

        if (allKeysMatch === true) {
          output.push(<any>this[i]);
        }
      } else {
        if (typeof this[i] === type) {
          output.push(<any>this[i]);
        }
      }
    }
    return output;
  }

  orderByDescending = <U>(key: (o: T) => U): JSLinqArray<T> => {
    return this.sort((a, b) => key(a) > key(b) ? -1 : key(a) < key(b) ? 1 : 0);
  }

  orderByAscending = <U>(key: (o: T) => U): JSLinqArray<T> => {
    return this.sort((a, b) => key(a) > key(b) ? 1 : key(a) < key(b) ? -1 : 0);
  }

  groupBy = <U>(key: (o: T) => U): JSLinqArray<JSLinqArrayGrouped<T, U>> => {
    const groups: U[] = this.distinct(key).map(key);
    const output = new JSLinqArray<JSLinqArrayGrouped<T, U>>();

    for (let i = 0; i < groups.length; i++) {
      output.pushUnique(new JSLinqArrayGrouped<T, U>(groups[i], this.where(o => key(o) === groups[i])), g => g.Key);
    }
    return output;
  }

  count = (predicate: (o: T) => boolean = null): number => {
    if (predicate === null) {
      return this.length;
    } else {
      let count = 0;
      for (let i = 0; i < this.length; i++) {
        if (predicate(this[i]) === true) {
          count++;
        }
      }
      return count;
    }
  }

  distinct = <U>(key: (o: T) => U): JSLinqArray<T> => {
    const output = new JSLinqArray<T>();
    for (let i = 0; i < this.length; i++) {
      output.pushUnique(this[i], key);
    }
    return output;
  }

  contains = <U>(predicate: (o: T) => boolean): boolean => {
    return this.where(predicate).length > 0;
  }

  sum = <U>(key: (o: T) => U = null): number => {
    let total = 0;
    if (key !== null) {
      for (let i = 0; i < this.length; i++) {
        const num = parseInt(key(this[i]).toString(), 10);
        if (typeof num === 'number') {
          total += num;
        } else {
          console.warn('Non number detected');
        }
      }
      return total;
    }
  }

  average = <U>(key: (o: T) => U): number => {
    const sum = this.sum(key);
    return sum / this.length;
  }

  min = <U>(key: (o: T) => U): number => {
    let min = null;
    for (let i = 0; i < this.length; i++) {
      const val = parseInt(key(this[i]).toString(), 10);
      if (typeof val === 'number') {
        if (min === null) {
          min = val;
        } else {
          if (val < min) {
            min = val;
          }
        }
      } else {
        console.warn('Non number detected');
      }
    }
    return min;
  }

  max = <U>(key: (o: T) => U): number => {
    let max = null;
    for (let i = 0; i < this.length; i++) {
      const val = parseInt(key(this[i]).toString(), 10);
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

  // toArray = function (): T[] {
  //   const temp: T[] = [];
  //   for (let i = 0; i < this.length; i++) {
  //     temp.push(this[i]);
  //   }
  //   return temp;
  // }

  public toArray(): T[] {
    const temp: T[] = [];
    for (let i = 0; i < this.length; i++) {
      temp.push(this[i]);
    }
    return temp;
  }

  /**
   * Select a list of columns, this method will flatten any class methods;
   */
  select = <U>(...keys: (keyof T)[]): JSLinqArray<U> => {
    let output = new JSLinqArray<U>();

    for (let i = 0; i < this.length; i++) {
      let temp: any = {};
      for (let key of keys) {
        const keyType = typeof this[i][<any>key]
        if (keyType === 'function') {
          console.warn('Function ${key} used as key, will flatten and may perform unexpectedly.');
        } else if (keyType === 'object') {
          // console.warn('Object ${key} used as key, will flatten and may perform unexpectedly.');
          temp[key] = Object.create(this[i][<any>key]);
        } else {
          temp[key] = JSON.parse(JSON.stringify(this[i][<any>key]));
        }

      }
      output.push(<any>temp);
    }

    return output;
  }

  private _findIndex = <U>(arr: T[], obj: T, key: (o: T) => U): number => {
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
      if (key(arr[i]) === key(obj)) {
        index = i;
        break;
      }
    }
    return index;
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
  constructor(id?: number, name?: string, age?: number, classes?: StudentClass[]) {
    super(name, age);
    this.id = id;
    this.classes = new JSLinqArray(classes);
  }
  id: number;
  classes: JSLinqArray<StudentClass>;
}

const objArr = new JSLinqArray<{ name: string, age: number, id: number }>([{
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

// console.log(objArr.toArray())

// const test = objArr.mapToExplicit(Person).groupBy(p => p.age);

console.log('-------------------');
// // console.log(test.toArray());
// // console.log('-------------------');
// for (const group of test) {
//   console.log(group.Key);
//   for (const sub of group.Collection) {
//     console.log(sub.print());
//   }
// }

const complexObjArray = new JSLinqArray([
  new Student(1, 'Test1', 25, new JSLinqArray<StudentClass>([
    new StudentClass('Intro to Economics', 'ECON 101', 3),
    new StudentClass('Intro to Finance', 'FIN 101', 3)
  ])),
  new Student(2, 'Test2', 22, new JSLinqArray<StudentClass>([
    new StudentClass('Intro to Economics', 'ECON 101', 3),
    new StudentClass('Calculus II', 'MATH 165', 4)
  ])),
  new Student(3, 'Test3', 30, new JSLinqArray<StudentClass>([
    new StudentClass('Calculus II', 'MATH 165', 4),
    new StudentClass('Intro to Java', 'CSCI 121', 3)
  ]))
]);

const test2 = complexObjArray.select<{ name: string, classes: typeof Student.prototype.classes }>('name', 'classes').where(s => s.classes.sum(c => c.credits) <= 6);
console.log(complexObjArray);

console.log('-------------------');
for (const student of test2) {
  console.log(student.name);
  console.log(student.classes.toArray());
}




// console.log(new Student(1, 'test', 25));

