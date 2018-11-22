# decorative-profiler
## Summary

A method, function and block profiler that supports typescript decorators!

## how to use

**SCROLL DOWN FOR JAVASCRIPT**

also, all parameter combinations and thinkable types are supported even if not used for the below showcases.

using typescript annotations you can do:
```typescript
import {Profile} from 'decorative-profiler'

class Abc {

        myField = 10

        @Profile() // will be accessible with myMethod as name
        myMethod() {
            return 1 + 2 + this.myField
        }
        
        @Profile("customName") //will be accessible with customName
        myMethod2() {
            return 1 + 2 + this.myField
        }
    }
```
and to print all or a specific summary: 
```typescript
import {stringSummaryAll, stringSummary} from 'decorative-profiler'

let summary = stringSummaryAll()
console.log(summary)

let singleSummary = stringSummary("yourCustomNameOrTheMethodName")
console.log(singleSummary)    
```

for javascript you can use the function factory:
```javascript
import {profiledFunction} from 'decorative-profiler'

const myMethod = profiledFunction(() => {
    return 1 + 2 + this.myField
}, "myMethodName")

myMethod()
```


and to print all or a specific summary: 
```javascript
import {stringSummaryAll, stringSummary} from 'decorative-profiler'

let summary = stringSummaryAll()
console.log(summary)

let singleSummary = stringSummary("yourCustomNameOrTheMethodName")
console.log(singleSummary)    
```

example output of the summary and single summary respectively:
```text
myMethod: callCount=2 totalRunTime=0.104156 averageRunTime=0.052078
```

```text
myMethod: callCount=2 totalRunTime=0.104156 averageRunTime=0.052078
myMethod2: callCount=2 totalRunTime=0.104156 averageRunTime=0.052078
```