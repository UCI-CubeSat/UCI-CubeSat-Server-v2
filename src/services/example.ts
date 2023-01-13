import { exampleModel } from "@/models/example.js"
import { alternateCase } from "@/utils/textTransform.js"

export const getListOfExamples = (): Array<exampleModel> => {
    return [
        {
            message: alternateCase("1st message")
        },
        {
            message: alternateCase("2nd message")
        }
    ]
}