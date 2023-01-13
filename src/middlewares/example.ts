import type { Request, Response, NextFunction } from 'express'

export const loggingMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const currentTime = new Date()
    console.log(`${req.method} request made to '${req.url}' at ${currentTime.toLocaleTimeString()}`)
    next()
}