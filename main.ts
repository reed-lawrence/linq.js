import { List } from './list'



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
  new Pet('Whiskers', 3, people[0]),
  new Pet('Boots', 4, people[0]),
  new Pet('Barley', 2, people[1]),
  new Pet('Daisy', 5, people[2])
]);


// let startTime: number = null;
// let endTime: number = null;

// var largeArr = new Array<Pet>();
// for (let i = 0; i < 50000; i++) {
//   largeArr.push(new Pet('Test' + i, 1, new Person('Test Owner ' + i)));
// }


const test = new List(pets, false);
test[0].name = 'TEST';
test.append(new Pet('test', 1, null));
test[test.length - 1].owner = new Person('test owner');
test[test.indexOf(test.where(p => p.owner.name === 'test owner').firstOrDefault())].owner.name = 'updated name';
console.log();
console.log(test);






// const query = pets.select((pet, index) => {
//   return { index: index, str: pet.name };
// });

// for (const obj of query.values) {
//   console.log('index ' + obj.index + ' str: ' + obj.str);
// }


