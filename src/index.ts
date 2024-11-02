import "dotenv/config";
import axios from "axios";
import { Telegraf } from "telegraf";
import { code } from "currency-codes-ts";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN ?? "");

const currencyUrl = process.env.CURRENCY_API_URL ?? "";

bot.start((ctx) => {
  return ctx.reply("Enter your currency");
});

bot.hears(/^[A-Z]+$/i, async (ctx) => {
  try {
    const currency = code(ctx.message.text?.toUpperCase());

    if (currency) {
      const { data: rates } = await axios.get(currencyUrl);

      const found = rates?.find(
        (rate) => rate.currencyCodeA === parseInt(currency.number)
      );

      if (!found || (!found?.rateSell && !found?.rateCross)) {
        return ctx.reply(`Rate for ${currency.currency} is unavailable`);
      }

      return ctx.reply(
        `${currency.currency}\nSell: ${found.rateSell ?? found.rateCross},\nBuy: ${found.rateBuy}`
      );
    }

    return ctx.reply("Currency doesn't exist!");
  } catch (err) {
    console.error("=== err", err?.response?.data ?? err?.message);
    return ctx.reply("Error!!!");
  }
});

bot.launch(() => console.log("=== Launched"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
