import { StartNotBeforeEndError } from "@/services/errorHandling.js"

export const checkIfStartBeforeEnd = (start: number, end: number) => {
    if (start >= end) {
        throw new StartNotBeforeEndError()
    }
}