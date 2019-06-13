import { TestController, Assert } from './jstest';
import { List } from './list';
import { truncate } from 'fs';

const controller = new TestController();


controller.addTest('Decouple From Controller', () => {
  // Arrange
  const originalName = 'steve';
  const toName = 'updated';

  const testList = new List([{ name: originalName }, { name: 'jody' }, { name: 'chris' }]);
  const testListDecoupled = new List(testList, true);

  // Act
  testListDecoupled[0].name = toName;

  // Assert
  Assert.areNotEqual(testList[0].name, testListDecoupled[0].name, 'List was not successfully decoupled. Expected: ' + toName + ' | Actual: ' + testListDecoupled[0].name);
});

controller.addTest('Fill Large List', () => {
  // Arrange
  const testList = new List<string>();

  // Act
  for (let i = 0; i < 50000; i++) {
    testList.add('test' + i);
  }

  // Assert
  Assert.areEqual(testList.length, 50000, 'List length not as expected');
})

controller.addTest('Find Index', () => {
  // Arrange
  const testList = new List([1, 2, 3, 4, 5]);

  // Act
  const result = testList.findIndex(i => i === 5);

  // Assert
  Assert.areEqual(result, 4, 'Index found was not as expected');
})

controller.addTest('No Decouple From Constructor', () => {
  // Arrange
  const originalName = 'steve';
  const toName = 'updated';

  const testList = new List([{ name: originalName }, { name: 'jody' }, { name: 'chris' }]);
  const testListDecoupled = new List(testList);

  // Act
  testListDecoupled[0].name = toName;

  // Assert
  Assert.areEqual(testList[0].name, testListDecoupled[0].name, 'List is decoupled. Expected: ' + originalName + ' | Actual: ' + testListDecoupled[0].name);
});

controller.addTest('List.add(): ensure new index', () => {
  // Arrange
  const list = new List(['test1']);
  const newVal = 'test2';

  // Act
  list.add(newVal);

  // Assert
  Assert.areEqual('test1', list[0], 'List unexpected removed or changed value at unaffected index');
  Assert.areEqual(newVal, list[1], 'List at index was not as expected. This could be a problem with the indexer itself or with the List.add() method');
  Assert.areEqual(2, list.length, 'List length not as expected.');
});

controller.addTest('List.add(): add at new index', () => {
  // Arrange
  const list = new List(['test1', 'test2', 'test3', 'test4']);
  const newVal = 'testInsert';

  // Act
  list.add(newVal, 2);

  // Assert
  Assert.areEqual(5, list.length, 'List length not as expected');
  Assert.areEqual('test1', list[0], 'List unexpectedly removed or changed value at unaffected index.');
  Assert.areEqual('test2', list[1], 'List unexpectedly removed or changed value at unaffected index.');
  Assert.areEqual(newVal, list[2], 'List at index was not as expected. This could be a problem with the indexer itself or with the List.add() method');
  Assert.areEqual('test3', list[3], 'List did not push value to expected place when other was inserted.');
  Assert.areEqual('test4', list[4], 'List did not push value to expected place when other was inserted.');
});

controller.addTest('List.addRange(): add array', () => {
  // Arrange
  const list = new List(['test1', 'test2']);
  const toAdd = ['test3', 'test4'];

  // Act
  list.addRange(toAdd);

  // Assert
  Assert.areEqual(4, list.length, 'List length not as expected');
  Assert.areEqual('test1', list[0], 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test2', list[1], 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test3', list[2], 'List did not successfully add value at expected index');
  Assert.areEqual('test4', list[3], 'List did not successfully add value at expected index');
});

controller.addTest('List.addRange(): add List', () => {
  // Arrange
  const list = new List(['test1', 'test2']);
  const toAdd = new List(['test3', 'test4']);

  // Act
  list.addRange(toAdd);

  // Assert
  Assert.areEqual(4, list.length, 'List length not as expected');
  Assert.areEqual('test1', list[0], 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test2', list[1], 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test3', list[2], 'List did not successfully add value at expected index');
  Assert.areEqual('test4', list[3], 'List did not successfully add value at expected index');
});

controller.addTest('List.addIfDistinct(): is not distinct', () => {
  // Arrange
  const list = new List(['test1', 'test2']);
  const toAdd = 'test1';

  // Act
  list.addIfDistinct(toAdd);

  // Assert
  Assert.areEqual(2, list.length, 'List length not as expected');
  Assert.areEqual('test1', list[0], 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test2', list[1], 'List unexpectedly removed or changed value at unaffected index');
});

controller.addTest('List.addIfDistinct(): is distinct', () => {
  // Arrange
  const list = new List(['test1', 'test2']);
  const toAdd = 'test3';

  // Act
  list.addIfDistinct(toAdd);

  // Assert
  Assert.areEqual(3, list.length, 'List length not as expected');
  Assert.areEqual('test1', list[0], 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test2', list[1], 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test3', list[2], 'List did not successfully append value');
});

controller.addTest('List.addIfDistinct(): is not distinct by key', () => {
  // Arrange
  const list = new List([{ key: 1, value: 'test1' }, { key: 2, value: 'test2' }]);
  const toAdd = { key: 1, value: 'test3' };

  // Act
  list.addIfDistinct(toAdd, o => o.key);

  // Assert
  Assert.areEqual(2, list.length, 'List length not as expected');
  Assert.areEqual('test1', list[0].value, 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test2', list[1].value, 'List unexpectedly removed or changed value at unaffected index');
});

controller.addTest('List.addIfDistinct(): is distinct by key', () => {
  // Arrange
  const list = new List([{ key: 1, value: 'test1' }, { key: 2, value: 'test2' }]);
  const toAdd = { key: 3, value: 'test3' };

  // Act
  list.addIfDistinct(toAdd, o => o.key);

  // Assert
  Assert.areEqual(3, list.length, 'List length not as expected');
  Assert.areEqual('test1', list[0].value, 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test2', list[1].value, 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test3', list[2].value, 'List did not successfully append new object');
});


controller.addTest('List.addIfDistinct(): is distinct at index', () => {
  // Arrange
  const list = new List(['test1', 'test2']);
  const toAdd = 'test3';

  // Act
  list.addIfDistinct(toAdd, null, 1);

  // Assert
  Assert.areEqual(3, list.length, 'List length not as expected');
  Assert.areEqual('test1', list[0], 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test3', list[1], 'List did not successfully insert value');
  Assert.areEqual('test2', list[2], 'List did not successfully move object due to insertion');
});

controller.addTest('List.addIfDistinct(): is distinct by key at index', () => {
  // Arrange
  const list = new List([{ key: 1, value: 'test1' }, { key: 2, value: 'test2' }]);
  const toAdd = { key: 3, value: 'test3' };

  // Act
  list.addIfDistinct(toAdd, o => o.key, 1);

  // Assert
  Assert.areEqual(3, list.length, 'List length not as expected');
  Assert.areEqual('test1', list[0].value, 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test3', list[1].value, 'List did not successfully insert new object');
  Assert.areEqual('test2', list[2].value, 'List did not successfully move object due to insertion');
});

controller.addTest('List.all() true scenario', () => {
  // Arrange
  const list = new List(['test1', 'test2', 'test3', 'test4']);

  // Act
  const result = list.all(o => o !== 'test5');

  // Assert
  Assert.areEqual(true, result, 'Unexpected result');
});

controller.addTest('List.all() false scenario', () => {
  // Arrange
  const list = new List(['test1', 'test2', 'test3', 'test4']);

  // Act
  const result = list.all(o => o !== 'test1');

  // Assert
  Assert.areEqual(false, result, 'Unexpected result');
});

controller.addTest('List.append()', () => {
  // Arrange
  const list = new List(['test1', 'test2', 'test3', 'test4']);

  // Act
  const returned = list.append('test5');

  // Assert
  Assert.areEqual(list.length, returned.length, 'Lengths of returned list and modified list are not the same.');
  Assert.areEqual(5, list.length, 'Modified list length not as expected');
  Assert.areEqual(5, returned.length, 'Returned list length not as expected');
  Assert.areEqual('test1', list[0], 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test2', list[1], 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test3', list[2], 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test4', list[3], 'List unexpectedly removed or changed value at unaffected index');
  Assert.areEqual('test5', list[4], 'List did not successfully append value');
});

controller.addTest('List.cast()', () => {
  // Arrange
  const list = new List(['test1', 'test2', 'test3', 'test4']);

  // Act
  const returned = list.cast<number>()

  // Assert
  Assert.areEqual('string', typeof list[0], 'Type fundamentally changed');

});

controller.addTest('List.chunk() even chunk result', () => {
  // Arrange
  const list = new List(['test1', 'test2', 'test3', 'test4']);

  // Act
  const returned = list.chunk(2);

  // Assert
  Assert.areEqual(2, returned.length, 'Chunked list count not as expected');
  Assert.areEqual(2, returned[0].length, 'Chunked list count not as expected');
  Assert.areEqual(2, returned[1].length, 'Chunked list count not as expected');
  Assert.areEqual(4, list.length, 'Original List unexpectedly modified');
  Assert.areEqual('test1', returned[0][0], 'Chunk returned value not as expected');
  Assert.areEqual('test2', returned[0][1], 'Chunk returned value not as expected');
  Assert.areEqual('test3', returned[1][0], 'Chunk returned value not as expected');
  Assert.areEqual('test4', returned[1][1], 'Chunk returned value not as expected');
});

controller.addTest('List.chunk() odd chunk result', () => {
  // Arrange
  const list = new List(['test1', 'test2', 'test3']);

  // Act
  const returned = list.chunk(2);

  // Assert
  Assert.areEqual(2, returned.length, 'Chunked list count not as expected');
  Assert.areEqual(2, returned[0].length, 'Chunked list count not as expected');
  Assert.areEqual(1, returned[1].length, 'Chunked list count not as expected');
  Assert.areEqual(3, list.length, 'Original List unexpectedly modified');
  Assert.areEqual('test1', returned[0][0], 'Chunk returned value not as expected');
  Assert.areEqual('test2', returned[0][1], 'Chunk returned value not as expected');
  Assert.areEqual('test3', returned[1][0], 'Chunk returned value not as expected');
});

controller.addTest('List.clear()', () => {
  // Arrange
  const list = new List(['test1', 'test2', 'test3', 'test4']);

  // Act
  const returned = list.clear();


  // Assert
  Assert.areEqual(returned.length, list.length, 'Returned list not same length as modified list');
  Assert.areEqual(0, list.length, 'Modified list not cleared');
  Assert.areEqual(0, returned.length, 'Returned list not cleared');
});

controller.addTest('List.compact()', () => {
  // Arrange
  const list = new List([true, true, true, false]);

  // Act
  const returned = list.compact()

  // Assert
  Assert.areNotEqual(list.length, returned.length, 'Compact function should have decoupled and returned a list with falsey values removed');
  Assert.areEqual(false, list[3], 'List unexpectedly modified target List in compact function');
  Assert.areEqual(3, returned.length, 'List did not remove false value');
});

controller.addTest('List.concat(): concat array', () => {
  // Arrange
  const list = new List(['test1', 'test2']);

  // Act
  const returned = list.concat(['test3', 'test4']);

  // Assert
  Assert.areEqual(returned.length, list.length, 'Concat function should modify and return the same list');
  Assert.areEqual('test1', list[0], 'List unexpectedly changed or removed indexed value');
  Assert.areEqual('test2', list[1], 'List unexpectedly changed or removed indexed value');
  Assert.areEqual('test3', list[2], 'List did not successfully append values');
  Assert.areEqual('test4', list[3], 'List did not successfully append values');
});

controller.addTest('List.concat(): concat List', () => {
  // Arrange
  const list = new List(['test1', 'test2']);

  // Act
  const returned = list.concat(new List(['test3', 'test4']));

  // Assert
  Assert.areEqual(returned.length, list.length, 'Concat function should modify and return the same list');
  Assert.areEqual('test1', list[0], 'List unexpectedly changed or removed indexed value');
  Assert.areEqual('test2', list[1], 'List unexpectedly changed or removed indexed value');
  Assert.areEqual('test3', list[2], 'List did not successfully append values');
  Assert.areEqual('test4', list[3], 'List did not successfully append values');
});

controller.addTest('List.contains(): primitive true', () => {
  // Arrange
  const list = new List(['test1', 'test2', 'test3', 'test4']);

  // Act
  const result = list.contains('test2');


  // Assert
  Assert.areEqual(true, result, 'Method should find matching value and return true');

});

controller.addTest('List.contains(): primitive false', () => {
  // Arrange
  const list = new List(['test1', 'test2', 'test3', 'test4']);

  // Act
  const result = list.contains('test5');


  // Assert
  Assert.areEqual(false, result, 'Method should not find matching value and return false');

});

controller.addTest('List.contains(): complex 1-level true', () => {
  // Arrange
  class ABCD {
    key: number; value: string;
    constructor(key: number, value: string) {
      this.key = key;
      this.value = value;
    }
  }

  const list = new List([
    new ABCD(1, 'test1'),
    new ABCD(2, 'test2'),
    new ABCD(3, 'test3')
  ]);

  // Act
  const result = list.contains(new ABCD(1, 'test1'));

  // Assert
  Assert.areEqual(true, result, 'Method should find matching value and return true');

});

controller.addTest('List.contains(): complex 1-level false', () => {
  // Arrange
  class ABCD {
    key: number; value: string;
    constructor(key: number, value: string) {
      this.key = key;
      this.value = value;
    }
  }

  const list = new List([
    new ABCD(1, 'test1'),
    new ABCD(2, 'test2'),
    new ABCD(3, 'test3')
  ]);

  // Act
  const result = list.contains(new ABCD(1, 'test2'));

  // Assert
  Assert.areEqual(false, result, 'Method should not find matching value and return false');

});

controller.addTest('List.contains(): complex 2-level true', () => {
  // Arrange
  class ABCD {
    key: number; value: ABCD;
    constructor(key: number, value: ABCD) {
      this.key = key;
      this.value = value;
    }
  }

  const list = new List([
    new ABCD(1, new ABCD(4, null)),
    new ABCD(2, new ABCD(5, null)),
    new ABCD(3, new ABCD(6, null))
  ]);

  // Act
  const result = list.contains(new ABCD(1, new ABCD(4, null)));

  // Assert
  Assert.areEqual(true, result, 'Method should find matching value and return true');

});

controller.addTest('List.contains(): complex 2-level false', () => {
  // Arrange
  class ABCD {
    key: number; value: ABCD;
    constructor(key: number, value: ABCD) {
      this.key = key;
      this.value = value;
    }
  }

  const list = new List([
    new ABCD(1, new ABCD(4, null)),
    new ABCD(2, new ABCD(5, null)),
    new ABCD(3, new ABCD(6, null))
  ]);

  // Act
  const result = list.contains(new ABCD(1, new ABCD(5, null)));

  // Assert
  Assert.areEqual(false, result, 'Method should not find matching value and return false');

});

controller.addTest('List.convertAll(): convert and decouple', () => {
  // Arrange
  const list = new List([{ key: 1, value: 'test1' }, { key: 2, value: 'test2' }, { key: 3, value: 'test3' }, { key: 4, value: 'test4' }]);

  // Act
  const returned = list.convertAll(o => {
    return o.value;
  });
  returned[0] = 'updated';

  // Assert
  Assert.areEqual(returned.length, list.length, 'List lengths should not be mutated when converted.');
  Assert.areEqual('string', typeof returned[0], 'List did not properly convert.');
  Assert.areNotEqual(returned[0], list[0].value, 'Returned list should be decoupled from the original list.');
  Assert.areNotEqual(list, <any>returned, 'Lists should be different after conversion');
});

controller.addTest('List.copyTo(): Copy to empty list', () => {
  // Arrange
  const list = new List(['test1', 'test2', 'test3', 'test4']);
  const arr = [];

  // Act
  list.copyTo(arr);

  // Assert
  Assert.areEqual(list.length, arr.length, 'Length of copied to array should match that of the source');
  Assert.areEqual(list[0], arr[0], 'Value of copied array was not as expected');
  Assert.areEqual(list[1], arr[1], 'Value of copied array was not as expected');
  Assert.areEqual(list[2], arr[2], 'Value of copied array was not as expected');
  Assert.areEqual(list[3], arr[3], 'Value of copied array was not as expected');
});

// controller.addTest('', () => {
//   // Arrange
//   const list = new List(['test1', 'test2', 'test3', 'test4']);

//   // Act


//   // Assert

// });

controller.run();


