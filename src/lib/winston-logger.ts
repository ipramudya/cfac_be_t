import { MODE } from '@/constant'
import { createLogger, format, transports } from 'winston'

const { combine, timestamp, prettyPrint } = format

export const logger = createLogger({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), prettyPrint()),
  level: MODE === 'production' ? 'info' : 'debug',
  transports: [new transports.Console()],
})
