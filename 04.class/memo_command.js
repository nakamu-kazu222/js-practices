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
    } else if (this.command === "-r") {
      await this.view_option();
    } else if (this.command === "-d") {
      await this.delete_option();
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
      this.handle_memo_operation(
        memos.length === 0,
        memos,
        "No memos found.",
        (memos) => {
          memos.forEach((memo) => {
            console.log(`${memo.content.split("\n")[0]}`);
          });
        }
      );
      this.console_operator.close_interface();
    });
  }

  async view_option() {
    await this.memo_select("Choose a note you want to see:", async (memoId) => {
      this.memo_database.get_memo(memoId, (err, memo) => {
        this.handle_memo_operation(
          err,
          memo,
          "Error: Memo not found.",
          (memo) => {
            console.log(memo.content);
          }
        );
        this.console_operator.close_interface();
      });
    });
  }

  async delete_option() {
    await this.memo_select(
      "Choose a note you want to delete:",
      async (memoId) => {
        this.memo_database.delete_memo(memoId, (err) => {
          this.handle_memo_operation(
            err,
            null,
            "Error: Memo not found.",
            () => {
              console.log("Memo deleted successfully!");
            }
          );
          this.console_operator.close_interface();
        });
      }
    );
  }

  handle_memo_operation(err, memo, errorMessage, action) {
    if (err) {
      console.log(errorMessage);
    } else {
      action(memo);
    }
  }

  async memo_select(prompt_message, action) {
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

        try {
          const answer = await this.console_operator.select_memo_list(
            prompt_message,
            choices
          );

          if (!answer.selected_item) {
            console.log("Error: Selected memo not found.");
            this.console_operator.close_interface();
          }
          action(answer.selected_item);
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
