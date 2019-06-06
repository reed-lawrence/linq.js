import { TestController, Assert } from './jstest';
import { List } from './list';

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

controller.run();


