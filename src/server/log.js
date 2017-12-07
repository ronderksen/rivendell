import winston from "winston";
import "winston-daily-rotate-file";


const rotate = new (winston.transports.DailyRotateFile)({
  filename: `${__dirname}/logs/rivendell`,
  datePattern: '-yyyy-MM-dd.log',
  timestamp: true,
  json: false,
  zippedArchive: true
});

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({ json: false, timestamp: true }),
    rotate
  ]
});

module.exports = logger;
