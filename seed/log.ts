// IMPORTANT: THIS WILL UPDATE LOG TABLE FOR ALL PEOPLE WORKING ON DEV INSTANCE
// MAKE SURE TO NOTIFY TEAM BEFORE RUNNING
import { env } from "@/services/env.js";
import { Log, PrismaClient } from '@prisma/client';
import { randomBytes } from "crypto";

const prisma = new PrismaClient()
const Log_operationStateValue = ['IDLE', 'ANTENNA_DEPLOYED', 'LOW_POWER', 'HELLO_WORLD'] as const
const Log_satEventHistoryValue = ['ANTENNA_DEPLOYED', 'INITIAL_FLASH', 'BATTERY_CHARGED'] as const
const Log_obcValue = ['FAILED', 'DEGRADED', 'OPERATIONAL'] as const

export type Log_operationState = (typeof Log_operationStateValue)[number]
export type Log_satEventHistory = (typeof Log_satEventHistoryValue)[number]
export type Log_obc = (typeof Log_obcValue)[number]

// Basic function that generates a sample log based on the time past epoch provided
const generateLog = (secondsSinceEpoch: number): Log => {
    return {
        timestamp: secondsSinceEpoch,
        callsign: randomBytes(2).toString('hex'),
        errorCount: Math.floor(6 * Math.random()),
        batteryVoltage: 5 + 2 * Math.sin(secondsSinceEpoch * 5 * Math.PI / 180),
        batteryCurrent: 3 + 2 * Math.sin(secondsSinceEpoch * 15 * Math.PI / 180),
        batteryTemp: 20 + 5 * Math.sin(secondsSinceEpoch * 10 * Math.PI / 180),
        ...generateOperationStatePayload(secondsSinceEpoch),
        ...generateChargingPayload(secondsSinceEpoch),
        lat: 40 * Math.sin(secondsSinceEpoch * 5 * Math.PI / 180),
        lon: (3 * secondsSinceEpoch) % 361 - 180,
        alt: 20 + 2 * Math.sin(secondsSinceEpoch * 10 * Math.PI / 180),
        themistor1: 20 + 2 * Math.sin(secondsSinceEpoch * 10 * Math.PI / 180),
        themistor2: 20 + 2 * Math.sin(secondsSinceEpoch * 5 * Math.PI / 180),
        themistor3: 20 + 2 * Math.sin(secondsSinceEpoch * 20 * Math.PI / 180),
        themistor4: 20 + 2 * Math.sin(secondsSinceEpoch * 25 * Math.PI / 180),
        obc: Log_obcValue[Math.floor(Log_obcValue.length * Math.random())],

    }
}

const generateOperationStatePayload = (secondsSinceEpoch: number) => {
    const operationState = Log_operationStateValue[Math.floor(Log_operationStateValue.length * Math.random())]
    if (operationState === 'LOW_POWER') {
        return {
            operationState,
            panelVoltage: null,
            panelCurrent: null,
            satEventHistory: null
        }
    }
    else {
        return {
            operationState,
            // Each second refers to 10 degrees
            panelVoltage: 5 + 3 * Math.sin(secondsSinceEpoch * 10 * Math.PI / 180),
            // Each second refers to 20 degrees
            panelCurrent: 4 + 2 * Math.sin(secondsSinceEpoch * 20 * Math.PI / 180),
            satEventHistory: Log_satEventHistoryValue[Math.floor(Log_satEventHistoryValue.length * Math.random())]
        }
    }
}

const generateChargingPayload = (secondsSinceEpoch: number) => {
    //  chargingVoltage: number
    // isCharging: boolean
    const isCharging = Math.random() > 0.5 ? true : false
    return {
        isCharging,
        chargingVoltage: isCharging ? 3 + 2 * Math.sin(secondsSinceEpoch * 15 * Math.PI / 180) : 0
    }
}


console.log(`Attempting to update ${env.ENV} db with mock log data.`)
try {
    // Clear existing logs
    await prisma.log.deleteMany();
    // Generate logs
    const logs: Log[] = []
    const currentTimeInSeconds = Math.round(Date.now() / 1000)
    for (let i = 0; i < 50; i++) {
        logs.push(generateLog(currentTimeInSeconds - i))
    }
    // Save logs
    await prisma.log.createMany({ data: logs })
    console.log("Mock log data has succesfully been updated!");
}
catch (e) {
    console.error("There was an issue when modifying the log table:", e)
}