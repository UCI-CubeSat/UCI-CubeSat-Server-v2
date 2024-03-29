import type { Log } from "@prisma/client"

export const sampleLog: Log = {
    callsign: 'ABC',
    timestamp: 1,
    operationState: "ANTENNA_DEPLOYED",
    errorCount: 0,
    batteryVoltage: 10,
    batteryCurrent: 1,
    batteryTemp: 20,
    chargingVoltage: 10,
    isCharging: true,
    panelVoltage: 15,
    panelCurrent: 1,
    satEventHistory: "BATTERY_CHARGED",
    lat: 1,
    lon: 2,
    alt: 3,
    themistor1: 1,
    themistor2: 2,
    themistor3: 3,
    themistor4: 4,
    obc: "OPERATIONAL",
}

export const sampleLowPowerLog: Log = {
    callsign: 'ABC',
    timestamp: 1,
    operationState: "LOW_POWER",
    errorCount: 0,
    batteryVoltage: 10,
    batteryCurrent: 1,
    batteryTemp: 20,
    chargingVoltage: 10,
    isCharging: true,
    panelVoltage: null,
    panelCurrent: null,
    satEventHistory: null,
    lat: 1,
    lon: 2,
    alt: 3,
    themistor1: 1,
    themistor2: 2,
    themistor3: 3,
    themistor4: 4,
    obc: "OPERATIONAL",
}

export const sampleLogs = [sampleLog, sampleLowPowerLog]