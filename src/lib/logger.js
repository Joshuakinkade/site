import chalk from 'chalk';
 
export default class Logger {
  constructor(options={}) {
    this.minLevel = options.logLevel || Logger.INFO;
    this.colorize = options.colorize || false;
  }

  error(...args) {
    args.unshift(Logger.ERROR);
    this.log.apply(this,args);
  }

  warn(...args) {
    args.unshift(Logger.WARN);
    this.log.apply(this,args);  }

  info(...args) {
    args.unshift(Logger.INFO);
    this.log.apply(this,args);
  }

  debug(...args) {
    args.unshift(Logger.DEBUG);
    this.log.apply(this,args);
  }

  log(level,...args) {
    let str = this._getLevelString(level) + ': ';

    str += args.map( arg => {
      if (typeof arg === 'string') {
        return arg;
      } else {
        let str;
        try {
          str = JSON.stringify(arg);
        } catch (error) {
          str = '';
        }
        return str;
      }
    }).join(' ');

    if (level <= this.minLevel) {
      console.log(str);
    }
  }

  _getLevelString(level) {
    switch(level) {
      case Logger.ERROR:
        return 'error';
      case Logger.WARN:
        return 'warning';
      case Logger.INFO:
        return 'info';
      case Logger.DEBUG:
        return 'debug'
      default:
        return '';
    }
  }
}

Logger.ERROR = 0;
Logger.WARN = 1;
Logger.INFO = 2;
Logger.DEBUG = 3;