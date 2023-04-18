export class DatabaseServiceParamError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "DatabaseServiceParamError"
    }
}

export class DatabaseDataError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "DatabaseDataError"
    }
}