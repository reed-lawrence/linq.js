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
    // Arrange
    var testList = new list_1.List();
    // Act
    for (var i = 0; i < 50000; i++) {
        testList.add('test' + i);
    }
    // Assert
    jstest_1.Assert.areEqual(testList.length, 50000, 'List length not as expected');
});
controller.addTest('Find Index', function () {
    // Arrange
    var testList = new list_1.List([1, 2, 3, 4, 5]);
    // Act
    var result = testList.findIndex(function (i) { return i === 5; });
    // Assert
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
controller.addTest('List.add(): ensure new index', function () {
    // Arrange
    var list = new list_1.List(['test1']);
    var newVal = 'test2';
    // Act
    list.add(newVal);
    // Assert
    jstest_1.Assert.areEqual('test1', list[0], 'List unexpected removed or changed value at unaffected index');
    jstest_1.Assert.areEqual(newVal, list[1], 'List at index was not as expected. This could be a problem with the indexer itself or with the List.add() method');
    jstest_1.Assert.areEqual(2, list.length, 'List length not as expected.');
});
controller.addTest('List.add(): add at new index', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2', 'test3', 'test4']);
    var newVal = 'testInsert';
    // Act
    list.add(newVal, 2);
    // Assert
    jstest_1.Assert.areEqual(5, list.length, 'List length not as expected');
    jstest_1.Assert.areEqual('test1', list[0], 'List unexpectedly removed or changed value at unaffected index.');
    jstest_1.Assert.areEqual('test2', list[1], 'List unexpectedly removed or changed value at unaffected index.');
    jstest_1.Assert.areEqual(newVal, list[2], 'List at index was not as expected. This could be a problem with the indexer itself or with the List.add() method');
    jstest_1.Assert.areEqual('test3', list[3], 'List did not push value to expected place when other was inserted.');
    jstest_1.Assert.areEqual('test4', list[4], 'List did not push value to expected place when other was inserted.');
});
controller.addTest('List.addRange(): add array', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2']);
    var toAdd = ['test3', 'test4'];
    // Act
    list.addRange(toAdd);
    // Assert
    jstest_1.Assert.areEqual(4, list.length, 'List length not as expected');
    jstest_1.Assert.areEqual('test1', list[0], 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test2', list[1], 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test3', list[2], 'List did not successfully add value at expected index');
    jstest_1.Assert.areEqual('test4', list[3], 'List did not successfully add value at expected index');
});
controller.addTest('List.addRange(): add List', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2']);
    var toAdd = new list_1.List(['test3', 'test4']);
    // Act
    list.addRange(toAdd);
    // Assert
    jstest_1.Assert.areEqual(4, list.length, 'List length not as expected');
    jstest_1.Assert.areEqual('test1', list[0], 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test2', list[1], 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test3', list[2], 'List did not successfully add value at expected index');
    jstest_1.Assert.areEqual('test4', list[3], 'List did not successfully add value at expected index');
});
controller.addTest('List.addIfDistinct(): is not distinct', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2']);
    var toAdd = 'test1';
    // Act
    list.addIfDistinct(toAdd);
    // Assert
    jstest_1.Assert.areEqual(2, list.length, 'List length not as expected');
    jstest_1.Assert.areEqual('test1', list[0], 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test2', list[1], 'List unexpectedly removed or changed value at unaffected index');
});
controller.addTest('List.addIfDistinct(): is distinct', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2']);
    var toAdd = 'test3';
    // Act
    list.addIfDistinct(toAdd);
    // Assert
    jstest_1.Assert.areEqual(3, list.length, 'List length not as expected');
    jstest_1.Assert.areEqual('test1', list[0], 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test2', list[1], 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test3', list[2], 'List did not successfully append value');
});
controller.addTest('List.addIfDistinct(): is not distinct by key', function () {
    // Arrange
    var list = new list_1.List([{ key: 1, value: 'test1' }, { key: 2, value: 'test2' }]);
    var toAdd = { key: 1, value: 'test3' };
    // Act
    list.addIfDistinct(toAdd, function (o) { return o.key; });
    // Assert
    jstest_1.Assert.areEqual(2, list.length, 'List length not as expected');
    jstest_1.Assert.areEqual('test1', list[0].value, 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test2', list[1].value, 'List unexpectedly removed or changed value at unaffected index');
});
controller.addTest('List.addIfDistinct(): is distinct by key', function () {
    // Arrange
    var list = new list_1.List([{ key: 1, value: 'test1' }, { key: 2, value: 'test2' }]);
    var toAdd = { key: 3, value: 'test3' };
    // Act
    list.addIfDistinct(toAdd, function (o) { return o.key; });
    // Assert
    jstest_1.Assert.areEqual(3, list.length, 'List length not as expected');
    jstest_1.Assert.areEqual('test1', list[0].value, 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test2', list[1].value, 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test3', list[2].value, 'List did not successfully append new object');
});
controller.addTest('List.addIfDistinct(): is distinct at index', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2']);
    var toAdd = 'test3';
    // Act
    list.addIfDistinct(toAdd, null, 1);
    // Assert
    jstest_1.Assert.areEqual(3, list.length, 'List length not as expected');
    jstest_1.Assert.areEqual('test1', list[0], 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test3', list[1], 'List did not successfully insert value');
    jstest_1.Assert.areEqual('test2', list[2], 'List did not successfully move object due to insertion');
});
controller.addTest('List.addIfDistinct(): is distinct by key at index', function () {
    // Arrange
    var list = new list_1.List([{ key: 1, value: 'test1' }, { key: 2, value: 'test2' }]);
    var toAdd = { key: 3, value: 'test3' };
    // Act
    list.addIfDistinct(toAdd, function (o) { return o.key; }, 1);
    // Assert
    jstest_1.Assert.areEqual(3, list.length, 'List length not as expected');
    jstest_1.Assert.areEqual('test1', list[0].value, 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test3', list[1].value, 'List did not successfully insert new object');
    jstest_1.Assert.areEqual('test2', list[2].value, 'List did not successfully move object due to insertion');
});
controller.addTest('List.all() true scenario', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2', 'test3', 'test4']);
    // Act
    var result = list.all(function (o) { return o !== 'test5'; });
    // Assert
    jstest_1.Assert.areEqual(true, result, 'Unexpected result');
});
controller.addTest('List.all() false scenario', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2', 'test3', 'test4']);
    // Act
    var result = list.all(function (o) { return o !== 'test1'; });
    // Assert
    jstest_1.Assert.areEqual(false, result, 'Unexpected result');
});
controller.addTest('List.append()', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2', 'test3', 'test4']);
    // Act
    var returned = list.append('test5');
    // Assert
    jstest_1.Assert.areEqual(list.length, returned.length, 'Lengths of returned list and modified list are not the same.');
    jstest_1.Assert.areEqual(5, list.length, 'Modified list length not as expected');
    jstest_1.Assert.areEqual(5, returned.length, 'Returned list length not as expected');
    jstest_1.Assert.areEqual('test1', list[0], 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test2', list[1], 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test3', list[2], 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test4', list[3], 'List unexpectedly removed or changed value at unaffected index');
    jstest_1.Assert.areEqual('test5', list[4], 'List did not successfully append value');
});
controller.addTest('List.cast()', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2', 'test3', 'test4']);
    // Act
    var returned = list.cast();
    // Assert
    jstest_1.Assert.areEqual('string', typeof list[0], 'Type fundamentally changed');
});
controller.addTest('List.chunk() even chunk result', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2', 'test3', 'test4']);
    // Act
    var returned = list.chunk(2);
    // Assert
    jstest_1.Assert.areEqual(2, returned.length, 'Chunked list count not as expected');
    jstest_1.Assert.areEqual(2, returned[0].length, 'Chunked list count not as expected');
    jstest_1.Assert.areEqual(2, returned[1].length, 'Chunked list count not as expected');
    jstest_1.Assert.areEqual(4, list.length, 'Original List unexpectedly modified');
    jstest_1.Assert.areEqual('test1', returned[0][0], 'Chunk returned value not as expected');
    jstest_1.Assert.areEqual('test2', returned[0][1], 'Chunk returned value not as expected');
    jstest_1.Assert.areEqual('test3', returned[1][0], 'Chunk returned value not as expected');
    jstest_1.Assert.areEqual('test4', returned[1][1], 'Chunk returned value not as expected');
});
controller.addTest('List.chunk() odd chunk result', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2', 'test3']);
    // Act
    var returned = list.chunk(2);
    // Assert
    jstest_1.Assert.areEqual(2, returned.length, 'Chunked list count not as expected');
    jstest_1.Assert.areEqual(2, returned[0].length, 'Chunked list count not as expected');
    jstest_1.Assert.areEqual(1, returned[1].length, 'Chunked list count not as expected');
    jstest_1.Assert.areEqual(3, list.length, 'Original List unexpectedly modified');
    jstest_1.Assert.areEqual('test1', returned[0][0], 'Chunk returned value not as expected');
    jstest_1.Assert.areEqual('test2', returned[0][1], 'Chunk returned value not as expected');
    jstest_1.Assert.areEqual('test3', returned[1][0], 'Chunk returned value not as expected');
});
controller.addTest('List.clear()', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2', 'test3', 'test4']);
    // Act
    var returned = list.clear();
    // Assert
    jstest_1.Assert.areEqual(returned.length, list.length, 'Returned list not same length as modified list');
    jstest_1.Assert.areEqual(0, list.length, 'Modified list not cleared');
    jstest_1.Assert.areEqual(0, returned.length, 'Returned list not cleared');
});
controller.addTest('List.compact()', function () {
    // Arrange
    var list = new list_1.List([true, true, true, false]);
    // Act
    var returned = list.compact();
    // Assert
    jstest_1.Assert.areNotEqual(list.length, returned.length, 'Compact function should have decoupled and returned a list with falsey values removed');
    jstest_1.Assert.areEqual(false, list[3], 'List unexpectedly modified target List in compact function');
    jstest_1.Assert.areEqual(3, returned.length, 'List did not remove false value');
});
controller.addTest('List.concat(): concat array', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2']);
    // Act
    var returned = list.concat(['test3', 'test4']);
    // Assert
    jstest_1.Assert.areEqual(returned.length, list.length, 'Concat function should modify and return the same list');
    jstest_1.Assert.areEqual('test1', list[0], 'List unexpectedly changed or removed indexed value');
    jstest_1.Assert.areEqual('test2', list[1], 'List unexpectedly changed or removed indexed value');
    jstest_1.Assert.areEqual('test3', list[2], 'List did not successfully append values');
    jstest_1.Assert.areEqual('test4', list[3], 'List did not successfully append values');
});
controller.addTest('List.concat(): concat List', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2']);
    // Act
    var returned = list.concat(new list_1.List(['test3', 'test4']));
    // Assert
    jstest_1.Assert.areEqual(returned.length, list.length, 'Concat function should modify and return the same list');
    jstest_1.Assert.areEqual('test1', list[0], 'List unexpectedly changed or removed indexed value');
    jstest_1.Assert.areEqual('test2', list[1], 'List unexpectedly changed or removed indexed value');
    jstest_1.Assert.areEqual('test3', list[2], 'List did not successfully append values');
    jstest_1.Assert.areEqual('test4', list[3], 'List did not successfully append values');
});
controller.addTest('List.contains(): primitive true', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2', 'test3', 'test4']);
    // Act
    var result = list.contains('test2');
    // Assert
    jstest_1.Assert.areEqual(true, result, 'Method should find matching value and return true');
});
controller.addTest('List.contains(): primitive false', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2', 'test3', 'test4']);
    // Act
    var result = list.contains('test5');
    // Assert
    jstest_1.Assert.areEqual(false, result, 'Method should not find matching value and return false');
});
controller.addTest('List.contains(): complex 1-level true', function () {
    // Arrange
    var ABCD = /** @class */ (function () {
        function ABCD(key, value) {
            this.key = key;
            this.value = value;
        }
        return ABCD;
    }());
    var list = new list_1.List([
        new ABCD(1, 'test1'),
        new ABCD(2, 'test2'),
        new ABCD(3, 'test3')
    ]);
    // Act
    var result = list.contains(new ABCD(1, 'test1'));
    // Assert
    jstest_1.Assert.areEqual(true, result, 'Method should find matching value and return true');
});
controller.addTest('List.contains(): complex 1-level false', function () {
    // Arrange
    var ABCD = /** @class */ (function () {
        function ABCD(key, value) {
            this.key = key;
            this.value = value;
        }
        return ABCD;
    }());
    var list = new list_1.List([
        new ABCD(1, 'test1'),
        new ABCD(2, 'test2'),
        new ABCD(3, 'test3')
    ]);
    // Act
    var result = list.contains(new ABCD(1, 'test2'));
    // Assert
    jstest_1.Assert.areEqual(false, result, 'Method should not find matching value and return false');
});
controller.addTest('List.contains(): complex 2-level true', function () {
    // Arrange
    var ABCD = /** @class */ (function () {
        function ABCD(key, value) {
            this.key = key;
            this.value = value;
        }
        return ABCD;
    }());
    var list = new list_1.List([
        new ABCD(1, new ABCD(4, null)),
        new ABCD(2, new ABCD(5, null)),
        new ABCD(3, new ABCD(6, null))
    ]);
    // Act
    var result = list.contains(new ABCD(1, new ABCD(4, null)));
    // Assert
    jstest_1.Assert.areEqual(true, result, 'Method should find matching value and return true');
});
controller.addTest('List.contains(): complex 2-level false', function () {
    // Arrange
    var ABCD = /** @class */ (function () {
        function ABCD(key, value) {
            this.key = key;
            this.value = value;
        }
        return ABCD;
    }());
    var list = new list_1.List([
        new ABCD(1, new ABCD(4, null)),
        new ABCD(2, new ABCD(5, null)),
        new ABCD(3, new ABCD(6, null))
    ]);
    // Act
    var result = list.contains(new ABCD(1, new ABCD(5, null)));
    // Assert
    jstest_1.Assert.areEqual(false, result, 'Method should not find matching value and return false');
});
controller.addTest('List.convertAll(): convert and decouple', function () {
    // Arrange
    var list = new list_1.List([{ key: 1, value: 'test1' }, { key: 2, value: 'test2' }, { key: 3, value: 'test3' }, { key: 4, value: 'test4' }]);
    // Act
    var returned = list.convertAll(function (o) {
        return o.value;
    });
    returned[0] = 'updated';
    // Assert
    jstest_1.Assert.areEqual(returned.length, list.length, 'List lengths should not be mutated when converted.');
    jstest_1.Assert.areEqual('string', typeof returned[0], 'List did not properly convert.');
    jstest_1.Assert.areNotEqual(returned[0], list[0].value, 'Returned list should be decoupled from the original list.');
    jstest_1.Assert.areNotEqual(list, returned, 'Lists should be different after conversion');
});
controller.addTest('List.copyTo(): Copy to empty list', function () {
    // Arrange
    var list = new list_1.List(['test1', 'test2', 'test3', 'test4']);
    var arr = [];
    // Act
    list.copyTo(arr);
    // Assert
    jstest_1.Assert.areEqual(list.length, arr.length, 'Length of copied to array should match that of the source');
    jstest_1.Assert.areEqual(list[0], arr[0], 'Value of copied array was not as expected');
    jstest_1.Assert.areEqual(list[1], arr[1], 'Value of copied array was not as expected');
    jstest_1.Assert.areEqual(list[2], arr[2], 'Value of copied array was not as expected');
    jstest_1.Assert.areEqual(list[3], arr[3], 'Value of copied array was not as expected');
});
// controller.addTest('', () => {
//   // Arrange
//   const list = new List(['test1', 'test2', 'test3', 'test4']);
//   // Act
//   // Assert
// });
controller.run();
//# sourceMappingURL=list.test.js.map