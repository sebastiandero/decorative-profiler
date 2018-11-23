export abstract class PerformanceMeasurer {
    protected enabled: boolean = false
    protected allProfiled: { [key: string]: PerformanceEntry[] } = {};

    protected constructor(protected perf: Performance) {
    }

    public enable() {
        this.enabled = true
    }

    public disable() {
        this.enabled = false
    }

    public start(name: string) {
        if (this.enabled) {
            this.perf.mark(`${name}-start`)
        }
    }

    public end(name: string) {
        if (this.enabled) {
            this.perf.mark(`${name}-end`)
            this.perf.measure(name, `${name}-start`, `${name}-end`)
        }
    }

    public abstract getEntriesByName(name: string): PerformanceEntry[]


    /**
     * get the amount of calls to a specific profiled entity
     * @param name
     */
    callCount(name: string) {
        return this.getEntriesByName(name).length
    }

    totalRunTime(name: string) {
        return this.getEntriesByName(name).map(value => value.duration).reduce((a, b) => a + b)
    }

    averageRunTime(name: string) {
        return this.totalRunTime(name) / this.callCount(name)
    }

    /**
     * prints all available data about the profiled entity
     * @param name
     * @param namePadding
     * @param callCountPadding
     * @param totalRuntimePadding
     * @param avgRunTimePadding
     */
    stringSummary(name: string, namePadding: number = 20, callCountPadding: number = 20, totalRuntimePadding: number = 20, avgRunTimePadding: number = 20) {
        return `${padString(name, namePadding)}:
        callCount=${padString(this.callCount(name) + "", callCountPadding)}|
        totalRunTime=${padString(this.totalRunTime(name) + "", totalRuntimePadding)}|
        averageRunTime=${padString(this.averageRunTime(name) + "", avgRunTimePadding)}|`
    }

    /**
     * prints all available data about all the profiled entities
     */
    stringSummaryAll() {
        return Object.keys(this.allProfiled).map(key => this.stringSummary(key)).reduce((a, b) => `${a}\n${b}`)
    }
}

function padString(str: string, length: number) {
    if (str.length > length) {
        return str
    }

    return str + " ".repeat(length - str.length)
}