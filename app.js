const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ✅ 쿨에스엠에스 인증 정보
const API_KEY = "NCSQC7WTRRNRFKXN";
const API_SECRET = "P1CDM5R66J9EOFIHWKZB94BXGJGZ5JZ7";
const SENDER = "01027237203";

app.post('/send', async (req, res) => {
  const { phone, message } = req.body;
  if (!phone || !message) return res.status(400).send("phone and message required");

  const salt = uuidv4();
  const date = new Date().toISOString();
  const signature = crypto
    .createHmac("sha256", API_SECRET)
    .update(date + salt)
    .digest("hex");

  const headers = {
    Authorization: `HMAC-SHA256 apiKey=${API_KEY}, date=${date}, salt=${salt}, signature=${signature}`,
    "Content-Type": "application/json"
  };

  const data = {
    message: {
      to: phone,
      from: SENDER,
      text: message
    }
  };

  try {
    const result = await axios.post(
      "https://api.coolsms.co.kr/messages/v4/send",
      data,
      { headers }
    );
    res.status(200).json(result.data);
  } catch (error) {
    console.error("문자 발송 실패:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

app.get("/", (req, res) => {
  res.send("📡 쿨에스엠에스 중계 서버 작동 중 ✅");
});

app.listen(PORT, () => {
  console.log(`✅ 중계 서버 실행 중 on port ${PORT}`);
});
