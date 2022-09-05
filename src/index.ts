import chalk from 'chalk';

import app from './app.js';
import "./config/setup.js";

const port = +process.env.PORT || 8000;

app.listen(port, () => {
  console.log("")
  console.log(chalk.green.bold(`Server is up and running on port ${port}`))
  console.log(chalk.yellow.bold(`Mode: ${process.env.MODE || "not defined -> DEV"}`))
  console.log(chalk.yellow(`Verbose: ${process.env.VERBOSE || "false"}`))
  console.log("---------------------------------------")
})