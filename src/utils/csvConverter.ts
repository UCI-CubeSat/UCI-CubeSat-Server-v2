import {Log} from '@prisma/client';

// Current behavior: removes null values and makes them blank

// TODO: Make CSV Converter follow standard, temporary csvConverter before better library, error handling

export const convertToCSV = (initial : Partial<Log>[]): string => {
    if (initial.length == 0) {
        return '';
    }
    let returnedCSV: string = '';
    const keys = Object.keys(initial[0]) as (keyof Partial<Log>)[]
    returnedCSV += keys.join(',') + '\r\n';
    for (const obj of initial) {
        for (const key of keys) {
            if (key in obj) {
                if (typeof obj[key] === "string") {
                    returnedCSV += `"${obj[key]}"`
                }
                else if (!!obj[key]) {
                    returnedCSV += `${obj[key]}`
                }
            }
            returnedCSV += ','
        }
        returnedCSV += '\r\n'
    }
    return returnedCSV
}
