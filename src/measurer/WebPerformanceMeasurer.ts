import {PerformanceMeasurer} from "./PerformanceMeasurer"

export class WebPerformanceMeasurer extends PerformanceMeasurer {

    constructor() {
        super(performance)
    }

    getEntriesByName(name: string): PerformanceEntry[] {
        return this.perf.getEntriesByName(name);
    }

    end(name: string) {
        super.end(name)
        if (this.enabled) {
            this.allProfiled[name] = []
        }
    }

    clear() {
        super.clear()
        this.perf.clearMarks()
    }
}