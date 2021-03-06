import {clear, disableProfiling, enableProfiling, end, Profile, profiledFunction, start, stringSummaryAll} from "./main"

test('should still run as a function: decorator', () => {
    clear()

    class Abc {
        @Profile()
        myMethod() {
            return 1 + 2
        }
    }

    let abc = new Abc()

    expect(abc.myMethod()).toBe(3)
});

test('should work with "this": decorator', () => {
    clear()

    class Abc {

        myField = 10

        @Profile()
        myMethod() {
            return 1 + 2 + this.myField
        }
    }

    let abc = new Abc()

    expect(abc.myMethod()).toBe(13)
});

test('should work with disabled profiling', () => {
    clear()
    disableProfiling()

    class Abc {

        myField = 10

        @Profile()
        myMethod() {
            return 1 + 2 + this.myField
        }
    }

    let abc = new Abc()

    expect(abc.myMethod()).toBe(13)
    enableProfiling()
});
test('should provide string summary', () => {
    clear()

    class Abc {

        myField = 10

        @Profile()
        myMethod() {
            return 1 + 2 + this.myField
        }


        @Profile()
        myMethod2222222222222222222() {
            for (let i = 0; i < 50_000_000; i++) {
                i = i * 10 / 5 / 2
            }

            return 1 + 2 + this.myField
        }
    }

    let abc = new Abc()
    abc.myMethod()
    abc.myMethod()
    abc.myMethod()
    abc.myMethod()
    abc.myMethod2222222222222222222()
    abc.myMethod2222222222222222222()
    abc.myMethod2222222222222222222()

    let summary = stringSummaryAll()
    console.log(summary)
    expect(summary).toBeTruthy()
});

test('should still run as a function: function factory', () => {
    clear()

    class Abc {
        myMethod = profiledFunction(() => {
            return 1 + 2
        }, "myMethod")
    }

    let abc = new Abc()
    abc.myMethod()

    let summary = stringSummaryAll()
    console.log(summary)
    expect(abc.myMethod()).toBe(3)
    expect(summary).toBeTruthy()
});

test('should work with "this": function factory', () => {
    clear()

    class Abc {

        myField = 10

        myMethod = profiledFunction(() => {
            return 1 + 2 + this.myField
        }, "myMethod")
    }

    let abc = new Abc()
    abc.myMethod()

    let summary = stringSummaryAll()
    console.log(summary)
    expect(abc.myMethod()).toBe(13)
    expect(summary).toBeTruthy()
});


test('should profile blocks', () => {
    clear()

    start("myBlock")
    const a = 1
    const b = 2
    const c = a + b
    console.log(c)
    end("myBlock")

    let summary = stringSummaryAll()
    console.log(summary)
    expect(summary).toBeTruthy()
});