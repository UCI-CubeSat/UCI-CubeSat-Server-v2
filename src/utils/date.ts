import { StartNotBeforeEndError } from "@/error/custom/request.js"

export const checkIfStartBeforeEnd = (start: number, end: number) => {
    if (start >= end) {
        throw new StartNotBeforeEndError()
    }
}