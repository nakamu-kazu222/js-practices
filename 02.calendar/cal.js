import minimist from "minimist";

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;

const argv = minimist(process.argv.slice(2), {
  alias: {
    y: "year",
    m: "month",
  },
  default: {
    year,
    month,
  },
});

const year_option = argv.year;
const month_option = argv.month;

const start_day = new Date(year_option, month_option - 1, 1);
const end_day = new Date(year_option, month_option, 0);

console.log(`      ${month_option}月 ${year_option}        `);
console.log("日 月 火 水 木 金 土");

let start_day_space = "   ".repeat(start_day.getDay());

for (let day = 1; day <= end_day.getDate(); day++) {
  start_day_space += day.toString().padStart(2);
  if (start_day.getDay() === 6 || day === end_day.getDate()) {
    start_day_space += "\n";
  } else {
    start_day_space += " ";
  }

  start_day.setDate(start_day.getDate() + 1);
}
console.log(start_day_space);
