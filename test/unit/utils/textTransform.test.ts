import { alternateCase } from '@/utils/textTransform.js'
import { describe, expect, it } from 'vitest'

describe.concurrent('textTransform', () => {
    it("Alternate case actually alternates case", () => {
        expect(alternateCase("abab")).toEqual("AbAb")
    })
})