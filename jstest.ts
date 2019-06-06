import * as _ from 'lodash';

export class JSTest {
  public static ResultType: 'pass' | 'fail' | 'inconclusive';

  public static test(testBody: () => Promise<AssertResult>): Promise<TestResult> {
    return new Promise<TestResult>(resolve => {
      const timer = new Timer();
      testBody().then(assert => resolve(new TestResult(assert.result, timer.elapsed, assert.message)));
    });
  }

  public runTests(tests: Promise<TestResult>[]) {
    const timer = new Timer();
    const results: TestResult[] = [];
    Promise.all(tests);
  }
}

export class Timer {
  private start = process.hrtime();

  public get elapsed(): number {
    const end = process.hrtime(this.start);
    return Math.round((end[0] * 1000) + (end[1] / 1000000));
  }
}

export class AssertResult {

  message: string;
  result: typeof JSTest.ResultType = null;
  constructor(result: typeof JSTest.ResultType, message: string = null) {
    this.result = result;
    this.message = message;
  }
}

export class TestResult extends AssertResult {
  timeElapsed: number;
  constructor(result: typeof JSTest.ResultType, timeElapsed: number, message: string = null) {
    super(result, message);
    this.timeElapsed = timeElapsed;
  }
}

export class Assert {
  public static areEqual<T>(obj1: T, obj2: T, message: string): AssertResult {
    if (_.isEqual(obj1, obj2) === true) {
      return new AssertResult('pass');
    } else {
      return new AssertResult('fail', message);
    }
  }

  public static areNotEqual() {

  }

  public static areEqualDelta() {

  }

  public static areNotEqualDelta() {

  }

  public static areNotSame() {

  }

  public static areSame() {

  }

  public static equals() {

  }

  public static fail() {

  }

  public static inconclusive() {

  }

  public static isFalse() {

  }

  public static isOfInstanceType() {

  }

  public static isNotInstanceType() {

  }

  public static isNotNull() {

  }

  public static isNull() {

  }

  public static isTrue() {

  }

  public static isUndefined() {

  }
}