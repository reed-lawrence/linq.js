"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var list_1 = require("./list");
var GroupedList = /** @class */ (function () {
    function GroupedList(key, items) {
        if (items === void 0) { items = null; }
        this.key = key;
        if (items === null) {
            this.collection = new list_1.List();
        }
        else {
            this.collection = new list_1.List(items.map(function (i) { return i; }));
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
var people = new list_1.List([
    new Person('Terry'),
    new Person('Magnus'),
    new Person('Charlotte')
]);
var pets = new list_1.List([
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
var test = new list_1.List(pets, false);
test[0].name = 'TEST';
test.append(new Pet('test', 1, null));
test[test.length - 1].owner = new Person('test owner');
test[test.indexOf(test.where(function (p) { return p.owner.name === 'test owner'; }).firstOrDefault())].owner.name = 'updated name';
console.log();
console.log(test);
// const query = pets.select((pet, index) => {
//   return { index: index, str: pet.name };
// });
// for (const obj of query.values) {
//   console.log('index ' + obj.index + ' str: ' + obj.str);
// }
//# sourceMappingURL=main.js.map