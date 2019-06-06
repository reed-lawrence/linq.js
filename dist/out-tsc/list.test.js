"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jstest_1 = require("./jstest");
var list_1 = require("./list");
var controller = new jstest_1.TestController();
controller.addTest('Decouple From Controller', function () {
    // Arrange
    var originalName = 'steve';
    var toName = 'updated';
    var testList = new list_1.List([{ name: originalName }, { name: 'jody' }, { name: 'chris' }]);
    var testListDecoupled = new list_1.List(testList, true);
    // Act
    testListDecoupled[0].name = toName;
    // Assert
    jstest_1.Assert.areNotEqual(testList[0].name, testListDecoupled[0].name, 'List was not successfully decoupled. Expected: ' + toName + ' | Actual: ' + testListDecoupled[0].name);
});
controller.addTest('Fill Large List', function () {
    var testList = new list_1.List();
    for (var i = 0; i < 50000; i++) {
        testList.add('test' + i);
    }
    jstest_1.Assert.areEqual(testList.length, 50000, 'List length not as expected');
});
controller.addTest('Find Index', function () {
    var testList = new list_1.List([1, 2, 3, 4, 5]);
    var result = testList.findIndex(function (i) { return i === 5; });
    jstest_1.Assert.areEqual(result, 4, 'Index found was not as expected');
});
controller.addTest('No Decouple From Constructor', function () {
    // Arrange
    var originalName = 'steve';
    var toName = 'updated';
    var testList = new list_1.List([{ name: originalName }, { name: 'jody' }, { name: 'chris' }]);
    var testListDecoupled = new list_1.List(testList);
    // Act
    testListDecoupled[0].name = toName;
    // Assert
    jstest_1.Assert.areEqual(testList[0].name, testListDecoupled[0].name, 'List is decoupled. Expected: ' + originalName + ' | Actual: ' + testListDecoupled[0].name);
});
controller.run();
//# sourceMappingURL=list.test.js.map