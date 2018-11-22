// wrapper is needed because node doesnt quite fully support performance the standard way

let perfWrapper: Performance
let PerfObserver: any

const nodeRuntime = typeof process !== 'undefined' && process.versions != null && process.versions.node != null

let nodeObserver: PerformanceObserver | null

let enabled = true;

var allProfiled: { [key: string]: PerformanceEntry[] } = {};

/////////////////////////////////////////

if (nodeRuntime) {
    perfWrapper = require('perf_hooks').performance
    PerfObserver = require('perf_hooks').PerformanceObserver
} else {
    perfWrapper = performance
}
if (typeof perfWrapper === 'undefined') {
    throw 'performance feature could not be found'

}

enableProfiling();

/////////////////////////////////////////

function enableNodeObserver() {
    if (!nodeObserver && nodeRuntime) {
        nodeObserver = new PerfObserver((list, observer) => {
            list.getEntries().forEach(measure => {
                if (!allProfiled[measure.name]) {
                    allProfiled[measure.name] = [measure]
                }
                allProfiled[measure.name].push(measure)
            })
        });
        // @ts-ignore
        nodeObserver.observe({entryTypes: ['measure']});
    }
}

/**
 * disables any profiling logic
 */
export function disableProfiling() {
    enabled = false;
    if (nodeObserver) {
        nodeObserver.disconnect()
    }
    nodeObserver = null
}

/**
 * enables profiling logic
 */
export function enableProfiling() {
    enableNodeObserver()
    enabled = true
}

/**
 * annotation for a typescript class member
 * @constructor
 */
export function Profile(customName?: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const f = descriptor.value
        const newF = profiledFunction(f, customName)
        descriptor.value = function (...args) {
            return newF.apply(this, args)
        }
        return descriptor
    }
}

/**
 * creates a profiled function
 */
export function profiledFunction(f: Function, customName?: string) {
    const name: string = customName || f.name
    return function (...args) {
        start(name)
        // @ts-ignore
        const res = f.apply(this, args)
        end(name)
        return res
    }
}

function start(name: string) {
    if (enabled) {
        perfWrapper.mark(`${name}-start`)
    }
}

function end(name: string) {
    if (enabled) {
        perfWrapper.mark(`${name}-end`)
        perfWrapper.measure(name, `${name}-start`, `${name}-end`)
        if (!nodeRuntime) {
            allProfiled[name] = []
        }
    }
}

/////////////////////////////////////////

function getEntriesByName(name: string): PerformanceEntry[] {
    if (!nodeRuntime) {
        return perfWrapper.getEntriesByName(name)
    } else {
        return allProfiled[name]
    }
}

/**
 * get the amount of calls to a specific profiled entity
 * @param name
 */
export function callCount(name: string) {
    return getEntriesByName(name).length
}

export function totalRunTime(name: string) {
    return getEntriesByName(name).map(value => value.duration).reduce((a, b) => a + b)
}

export function averageRunTime(name: string) {
    return totalRunTime(name) / callCount(name)
}

/**
 * prints all available data about the profiled entity
 * @param name
 */
export function stringSummary(name: string) {
    return `${name}: callCount=${callCount(name)} totalRunTime=${totalRunTime(name)} averageRunTime=${averageRunTime(name)}`
}

/**
 * prints all available data about all the profiled entities
 */
export function stringSummaryAll() {
    return Object.keys(allProfiled).map(key => stringSummary(key)).reduce((a, b) => `${a}\n${b}`)
}