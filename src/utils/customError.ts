import { ZodError } from "zod";

type SafeParseResult<T> = {
    success: true,
    data: T
} | {
    success: false,
    error: ZodError<any>
}

export const customErrorIfSafeParseError = <T, E>(safeParseResult: SafeParseResult<T>, error: new (...args: any[]) => E) => {
    if (safeParseResult.success) {
        return safeParseResult.data
    }
    else {
        throw new error
    }
}