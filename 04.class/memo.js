import { MemoCommand } from "./memo_command.js";

const memo_command = new MemoCommand("memos.db");
await memo_command.process_command();
