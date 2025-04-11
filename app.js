
const express = require('express');
const axios = require('axios');
const iconv = require('iconv-lite');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 문자나라 인증 정보
const USER_ID = "sizs1234";
const PASSWD = "chzh9565";
const SENDER = "01027237203";

app.post('/send', async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) {
      return res.status(400).send("phone and message required");
    }

    // EUC-KR 인코딩
    const encodedMsg = encodeURIComponent(iconv.encode(message, 'euc-kr').toString());

    const url = `http://www.munjanara.co.kr/MSG/send/web_admin_send.htm?userid=${USER_ID}&passwd=${PASSWD}&sender=${SENDER}&receiver=${phone}&encode=1&end_alert=0&message=${encodedMsg}`;

    const result = await axios.get(url);
    res.status(200).send(result.data);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.get('/', (req, res) => {
  res.send('문자나라 중계 서버 작동 중 ✅');
});

app.listen(PORT, () => {
  console.log('문자나라 중계 서버 실행 중:', PORT);
});
