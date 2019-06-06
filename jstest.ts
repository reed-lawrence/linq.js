import * as _ from 'lodash';

// export namespace JSTest {

// }

export type ControllerOptions = { tags?: string[] }

export type AssertResultType = 'pass' | 'fail' | 'inconclusive';

export class ITest {
  execute: () => void;
  name: string;
  constructor(name: string, test: () => void) {
    this.name = name;
    this.execute = test;
  }
}

export class TestController {

  private results: TestResult[] = [];
  private tests: ITest[] = [];
  private _options: ControllerOptions;

  constructor(options?: ControllerOptions) {
    this._options = options;
  }

  public addTest(testName: string, test: () => void) {
    this.tests.push(new ITest(testName, test));
  }

  public run() {
    const testPromises: Promise<any>[] = [];
    const timer = new Timer();
    for (let test of this.tests) {
      testPromises.push(this.runTest(test, this.results));
    }
    Promise.all(testPromises).then(done => {
      this.printResults(timer.elapsed);
    })
  }

  private runTest(test: ITest, results: TestResult[]): Promise<any> {
    return new Promise<any>(resolve => {
      const timer = new Timer();
      let assertResult = null;
      try {
        test.execute();
        assertResult = new AssertResult('pass');
      } catch (e) {
        if (e instanceof AssertResult) {
          assertResult = e;
        } else {
          assertResult = new AssertResult('fail', 'unhandled exception ' + e);
        }
      }
      results.push(new TestResult(test.name, assertResult.result, timer.elapsed, assertResult.message))
      resolve();
    });
  }

  private printResults(timeElapsed: number) {
    console.log('\x1b[33m Tests complete! \x1b[0m')
    console.log('Total runtime: ' + timeElapsed + 'ms');
    console.log('\nPassed Tests: ');
    for (const result of this.results.filter(r => r.result === 'pass')) {
      console.log('\x1b[32m   ' + result.testName + '\x1b[0m | ' + result.timeElapsed + 'ms');
    }
    console.log('\nFailed Tests: ');
    for (const result of this.results.filter(r => r.result === 'fail')) {
      console.error('\x1b[31m   ' + result.testName + '\x1b[0m | ' + result.timeElapsed + 'ms | ' + result.message);
    }
  }
}

class Timer {
  private start = process.hrtime();

  public get elapsed(): number {
    const end = process.hrtime(this.start);
    return Math.round((end[0] * 1000) + (end[1] / 1000000));
  }
}

export class AssertResult {

  message: string;
  result: AssertResultType = null;
  constructor(result: AssertResultType, message: string = null) {
    this.result = result;
    this.message = message;
  }
}

export class TestResult extends AssertResult {
  timeElapsed: number;
  testName: string;
  constructor(testName: string, result: AssertResultType, timeElapsed: number, message: string = null) {
    super(result, message);
    this.timeElapsed = timeElapsed;
    this.testName = testName;
  }
}

export class Assert {
  public static areEqual<T>(expected: T, actual: T, errorMessage: string): AssertResult {
    if (_.isEqual(expected, actual) === true) {
      return new AssertResult('pass');
    } else {
      throw new AssertResult('fail', errorMessage);
    }
  }

  public static areNotEqual<T>(expected: T, actual: T, errorMessage: string) {
    if (_.isEqual(expected, actual) === false) {
      return new AssertResult('pass');
    } else {
      throw new AssertResult('fail', errorMessage);
    }
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





