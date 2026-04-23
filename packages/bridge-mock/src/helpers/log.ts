import chalk from 'chalk';

export const log = (msg) => console.log(chalk.green(msg));
export const error = (msg) => console.log(chalk.red(msg));
export const warn = (msg) => console.log(chalk.yellow(msg));
