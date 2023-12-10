import { createInterface } from "readline";
import Enquirer from "enquirer";

export class ConsoleOperator {
  constructor() {
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.enquirer = new Enquirer();
  }

  async select_memo_list(message, choices) {
    return this.enquirer.prompt({
      type: "select",
      name: "selected_item",
      message,
      choices,
      result() {
        return this.focused.value;
      },
    });
  }

  close_interface() {
    this.rl.close();
  }
}
