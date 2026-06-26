const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const domainInput = process.argv[2];

if (!botToken) {
  console.error("❌ ERROR: TELEGRAM_BOT_TOKEN is not defined in .env.local");
  process.exit(1);
}

if (!domainInput) {
  console.error("❌ ERROR: Please specify your public domain name.");
  console.log("Usage: node scripts/register-telegram-webhook.js <your-domain-url>");
  console.log("Example: node scripts/register-telegram-webhook.js https://eusrealty.co.in");
  console.log("Example (with Ngrok): node scripts/register-telegram-webhook.js https://abcd-12-34.ngrok-free.app");
  process.exit(1);
}

// Clean url format
let domain = domainInput.trim();
if (!domain.startsWith("http://") && !domain.startsWith("https://")) {
  domain = "https://" + domain;
}
// Remove trailing slashes
domain = domain.replace(/\/+$/, "");

const webhookUrl = `${domain}/api/telegram-webhook`;
const telegramUrl = `https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;

console.log(`Setting Telegram webhook for bot: ${botToken.substring(0, 10)}...`);
console.log(`Webhook URL: ${webhookUrl}`);

fetch(telegramUrl)
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      console.log("🎉 SUCCESS: Webhook successfully registered with Telegram!");
      console.log("Response:", JSON.stringify(data, null, 2));
    } else {
      console.error("❌ FAILED: Webhook registration failed.");
      console.log("Response:", JSON.stringify(data, null, 2));
    }
  })
  .catch(err => {
    console.error("❌ ERROR: Request to Telegram API failed:", err.message);
  });
