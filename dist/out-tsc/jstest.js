"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("lodash");
var ITest = /** @class */ (function () {
    function ITest(name, test) {
        this.name = name;
        this.execute = test;
    }
    return ITest;
}());
exports.ITest = ITest;
var TestController = /** @class */ (function () {
    function TestController(options) {
        this.results = [];
        this.tests = [];
        this._options = options;
    }
    TestController.prototype.addTest = function (testName, test) {
        this.tests.push(new ITest(testName, test));
    };
    TestController.prototype.run = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var e_1, _a;
            var testPromises = [];
            var timer = new Timer();
            try {
                for (var _b = tslib_1.__values(_this.tests), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var test = _c.value;
                    testPromises.push(_this.runTest(test, _this.results));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            Promise.all(testPromises).then(function (done) {
                var totalTime = timer.elapsed;
                _this.printResults(totalTime);
                resolve(new RunResult(_this.results, totalTime));
            });
        });
    };
    TestController.prototype.runTest = function (test, results) {
        return new Promise(function (resolve) {
            var timer = new Timer();
            var assertResult = null;
            try {
                test.execute();
                assertResult = new AssertResult('pass');
            }
            catch (e) {
                if (e instanceof AssertResult) {
                    assertResult = e;
                }
                else {
                    assertResult = new AssertResult('fail', 'unhandled exception ' + e);
                }
            }
            results.push(new TestResult(test.name, assertResult.result, timer.elapsed, assertResult.message));
            resolve();
        });
    };
    TestController.prototype.printResults = function (timeElapsed) {
        var e_2, _a, e_3, _b;
        console.clear();
        console.log('\x1b[33m Tests complete! \x1b[0m');
        console.log('Total runtime: ' + timeElapsed + 'ms');
        console.log('\nPassed Tests: ');
        try {
            for (var _c = tslib_1.__values(this.results.filter(function (r) { return r.result === 'pass'; })), _d = _c.next(); !_d.done; _d = _c.next()) {
                var result = _d.value;
                console.log('\x1b[32m   ' + result.testName + '\x1b[0m | ' + result.timeElapsed + 'ms');
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        console.log('\nFailed Tests: ');
        try {
            for (var _e = tslib_1.__values(this.results.filter(function (r) { return r.result === 'fail'; })), _f = _e.next(); !_f.done; _f = _e.next()) {
                var result = _f.value;
                console.error('\x1b[31m   ' + result.testName + '\x1b[0m | ' + result.timeElapsed + 'ms | ' + result.message);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    return TestController;
}());
exports.TestController = TestController;
var Timer = /** @class */ (function () {
    function Timer() {
        this.start = process.hrtime();
    }
    Object.defineProperty(Timer.prototype, "elapsed", {
        get: function () {
            var end = process.hrtime(this.start);
            return Math.round((end[0] * 1000) + (end[1] / 1000000));
        },
        enumerable: true,
        configurable: true
    });
    return Timer;
}());
var RunResult = /** @class */ (function () {
    function RunResult(results, timeElapsed) {
        this.results = results;
        this.timeElapsed = timeElapsed;
    }
    return RunResult;
}());
exports.RunResult = RunResult;
var AssertResult = /** @class */ (function () {
    function AssertResult(result, message) {
        if (message === void 0) { message = null; }
        this.result = null;
        this.result = result;
        this.message = message;
    }
    return AssertResult;
}());
exports.AssertResult = AssertResult;
var TestResult = /** @class */ (function (_super) {
    tslib_1.__extends(TestResult, _super);
    function TestResult(testName, result, timeElapsed, message) {
        if (message === void 0) { message = null; }
        var _this = _super.call(this, result, message) || this;
        _this.timeElapsed = timeElapsed;
        _this.testName = testName;
        return _this;
    }
    return TestResult;
}(AssertResult));
exports.TestResult = TestResult;
var Assert = /** @class */ (function () {
    function Assert() {
    }
    Assert.areEqual = function (expected, actual, errorMessage) {
        if (_.isEqual(expected, actual) === true) {
            return new AssertResult('pass');
        }
        else {
            throw new AssertResult('fail', errorMessage);
        }
    };
    Assert.areNotEqual = function (expected, actual, errorMessage) {
        if (_.isEqual(expected, actual) === false) {
            return new AssertResult('pass');
        }
        else {
            throw new AssertResult('fail', errorMessage);
        }
    };
    Assert.areEqualDelta = function () {
    };
    Assert.areNotEqualDelta = function () {
    };
    Assert.areNotSame = function () {
    };
    Assert.areSame = function () {
    };
    Assert.equals = function () {
    };
    Assert.fail = function () {
    };
    Assert.inconclusive = function () {
    };
    Assert.isFalse = function () {
    };
    Assert.isOfInstanceType = function () {
    };
    Assert.isNotInstanceType = function () {
    };
    Assert.isNotNull = function () {
    };
    Assert.isNull = function () {
    };
    Assert.isTrue = function () {
    };
    Assert.isUndefined = function () {
    };
    return Assert;
}());
exports.Assert = Assert;
//# sourceMappingURL=jstest.js.map