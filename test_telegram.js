const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const url = `https://api.telegram.org/bot${token}/sendMessage`;

const body = {
  chat_id: chatId,
  text: `🏠 <b>New EUS Realty Lead</b>\n\n👤 <b>Name:</b> leadFromHero\n📞 <b>Phone:</b> 9800000000\n📧 <b>Email:</b> lead@gmail.com\n🎯 <b>Objective:</b> Looking to Buy Residential\n💰 <b>Budget:</b> ₹1 Cr – ₹3 Cr\n\n\n📊 <b>Source:</b> Homepage Hero Form`,
  parse_mode: 'HTML'
};

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
})
  .then(res => res.text())
  .then(console.log)
  .catch(console.error);
