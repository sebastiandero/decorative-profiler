import {PerformanceMeasurer} from "./measurer/PerformanceMeasurer"
import {NodePerformanceMeasurer} from "./measurer/NodePerformanceMeasurer"
import {WebPerformanceMeasurer} from "./measurer/WebPerformanceMeasurer"

const isBrowser = !!performance.mark

const performanceMeasurer: PerformanceMeasurer = isBrowser ? new WebPerformanceMeasurer() : new NodePerformanceMeasurer()


/**
 * disables any profiling logic
 */
export function disableProfiling() {
    performanceMeasurer.disable()
}

/**
 * enables profiling logic
 */
export function enableProfiling() {
    performanceMeasurer.enable()
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
    performanceMeasurer.start(name)
}

function end(name: string) {
    performanceMeasurer.end(name)
}

export function stringSummaryAll() {
    return performanceMeasurer.stringSummaryAll()
}