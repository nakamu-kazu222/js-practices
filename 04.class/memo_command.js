import { MemoDatabase } from "./memo_database.js";
import { ConsoleOperator } from "./console_operator.js";

export class MemoCommand {
  constructor(database_path) {
    this.memo_database = new MemoDatabase(database_path);
    this.console_operator = new ConsoleOperator();
    this.option = process.argv.slice(2);
    this.command = this.option[0];
  }

  async process_command() {
    this.memo_database.create_database();

    if (!this.command) {
      await this.add_option();
    } else if (this.command === "-l") {
      await this.list_option();
    } else if (this.command === "-r" || this.command === "-d") {
      await this.view_or_delete_option();
    } else {
      this.invalid_option();
    }
  }

  async add_option() {
    let content = "";
    this.console_operator.rl.on("line", (lineString) => {
      content += lineString + "\n";
    });

    this.console_operator.rl.on("close", () => {
      this.memo_database.add_memo(content.trim(), () => {
        console.log("Memo added successfully!");
        this.console_operator.close_interface();
      });
    });
  }

  async list_option() {
    this.memo_database.list_memos((err, memos) => {
      if (err) {
        console.error(err);
        this.console_operator.close_interface();
        return;
      }

      if (memos.length === 0) {
        console.log("No memos found.");
      } else {
        memos.forEach((memo) => {
          console.log(`${memo.content.split("\n")[0]}`);
        });
      }

      this.console_operator.close_interface();
    });
  }

  async view_or_delete_option() {
    this.memo_database.list_memos(async (err, memos) => {
      if (err) {
        console.error(err);
        this.console_operator.close_interface();
        return;
      }

      if (memos.length === 0) {
        console.log("No memos found.");
        this.console_operator.close_interface();
      } else {
        const choices = memos.map((memo) => ({
          name: memo.content.split("\n")[0],
          value: memo.id,
        }));

        const prompt_message =
          this.command === "-r"
            ? "Choose a note you want to see:"
            : "Choose a note you want to delete:";

        try {
          const answer = await this.console_operator.select_memo_list(
            prompt_message,
            choices
          );

          const selected_memo = memos.find(
            (memo) => memo.content.split("\n")[0] === answer.selected_item
          );

          if (!selected_memo) {
            console.log("Error: Selected memo not found.");
            this.console_operator.close_interface();
          }

          if (this.command === "-r") {
            console.log(selected_memo.content);
          } else if (this.command === "-d") {
            this.memo_database.delete_memo(selected_memo.id, () => {
              console.log("Memo deleted successfully!");
              this.console_operator.close_interface();
            });
          }
        } catch (error) {
          console.error(error.message);
          this.console_operator.close_interface();
        }
      }
    });
  }

  invalid_option() {
    console.log("Invalid command");
    this.console_operator.close_interface();
  }
}
