import "dotenv/config";
import axios from "axios";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN ?? "");

const currencyUrl = process.env.CURRENCY_API_URL ?? "";

bot.start((ctx) => {
  return ctx.reply("Welcome");
});

bot.hears("hi", async (ctx) => {
  try {
    const { data: rates } = await axios.get(currencyUrl);
    console.log("=== res", rates[0]);
    return ctx.reply(rates[0]);
  } catch (err) {
    console.error("=== err", err);
    return ctx.reply("Error!!!");
  }
});

bot.launch(() => console.log("=== Launched"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
