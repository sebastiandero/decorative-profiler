import {PerformanceMeasurer} from "./PerformanceMeasurer"

let PerfObserver: any

export class NodePerformanceMeasurer extends PerformanceMeasurer {
    private performanceObserver?: PerformanceObserver;

    constructor() {
        super(require('perf_hooks').performance);
        PerfObserver = require('perf_hooks').PerformanceObserver
    }

    enable() {
        super.enable()
        this.performanceObserver = new PerfObserver((list, observer) => {
            list.getEntries().forEach(measure => {
                if (!this.allProfiled[measure.name]) {
                    this.allProfiled[measure.name] = [measure]
                }
                this.allProfiled[measure.name].push(measure)
            })
        });

        this.performanceObserver!.observe({entryTypes: ['measure']});
    }

    disable() {
        super.disable()
        if (this.performanceObserver) {
            this.performanceObserver.disconnect()
        }
    }

    getEntriesByName(name: string): PerformanceEntry[] {
        return this.allProfiled[name]
    }
}