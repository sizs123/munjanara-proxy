const express = require('express');
const axios = require('axios');
const iconv = require('iconv-lite');
const cors = require('cors'); // 외부 호출을 위한 CORS 허용

const app = express();
// app.use(cors()); // CORS 설정
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
    
    const formattedMsg = message.replace(/\n/g, '<br>');
    
    // // // EUC-KR 인코딩 후 URI 인코딩
    const encodedBuffer = iconv.encode(message, 'EUC-KR'); // ➔ EUC-KR로 인코딩
    // const encodedBuffer = iconv.encode(message, 'euc-kr');
    const encodedMsg = encodeURIComponent(encodedBuffer.toString('binary'));
    // const encodedMsg = encodeURIComponent(encodedBuffer.toString('latin1')); // ➔ 바이

    const url = `http://www.munjanara.co.kr/MSG/send/web_admin_send.htm?userid=${USER_ID}&passwd=${PASSWD}&sender=${SENDER}&receiver=${phone}&encode=1&end_alert=0&message=${encodedMsg}`;

    const result = await axios.get(url, { responseType: 'text' });
    res.status(200).send(result.data);
  } catch (err) {
    console.error('문자 전송 오류:', err.message);
    res.status(500).send("문자 전송 중 오류 발생");
  }
});

app.get('/', (req, res) => {
  res.send('문자나라 중계 서버 작동 중 ✅');
});

app.listen(PORT, () => {
  console.log(`✅ 문자나라 중계 서버 실행 중: ${PORT}`);
});
