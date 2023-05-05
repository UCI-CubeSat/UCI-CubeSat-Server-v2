export class RequestBodyError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "RequestBodyError"
    }
}

// This error is for the by_time_range route
export class StartNotBeforeEndError extends Error {
    constructor() {
        super("Start is not before end.")
        this.name = "RequestBodyError"
    }
}