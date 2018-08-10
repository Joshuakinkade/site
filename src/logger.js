import Logger from './lib/logger';

const logger = new Logger({
  logLevel: process.env.NODE_ENV == 'development' ? Logger.DEBUG : Logger.INFO 
});

export default logger;