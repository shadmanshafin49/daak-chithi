const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');


router.get('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');

    // ✅ This is the modern letter form you designed
    res.send(`
      <html>
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

          <title>Write a letter</title>
          <link href="https://fonts.googleapis.com/css2?family=Playpen+Sans&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Playpen Sans', cursive;
              margin: 0;
              padding: 0;
              background-color: #fdf8f3;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              min-height: 100vh;
            }

            .letter-wrapper {
  position: relative;
  width: 80%;
  max-width: 390px;
  margin: 20px auto 0 auto;
}


            .letter-image {
              width: 100%;
              height: auto;
              display: block;
            margin: 0 auto;  /* This centers the image */

            }

            .text-area {
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  height: 60%;
  background-color: transparent;
  border: none;
  resize: none;
  outline: none;
  font-family: 'Playpen Sans', cursive;
  font-size: 14px;
  line-height: 1.5;
  overflow-y: auto;
  padding-left: 10%; /* add padding so text doesn’t stick to edge */
  padding-right: 10%;
  box-sizing: border-box; /* include padding in width */
}


            .submit-button {
              margin: 20px auto;
              display: block;
              padding: 12px 24px;
              font-size: 16px;
              background-color: #b73430;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-family: Arial, sans-serif;
            }

            .submit-button:hover {
              background-color: #952b28;
            }
          </style>
        </head>
        <body>
          <div class="letter-wrapper">
            <form method="POST" action="/${username}">
              <img src="/assets/letter_page.png" alt="Letter" class="letter-image" />
              <textarea 
                name="message" 
                class="text-area" 
                maxlength="826" 
                oninput="adjustFontSize(this)">
              </textarea>
              <button type="submit" class="submit-button">Send anonymous letter</button>
            </form>
          </div>

          <script>
            function adjustFontSize(textarea) {
              const len = textarea.value.length;
              if (len > 554) {
                textarea.style.fontSize = '10px';
              } else if (len > 404) {
                textarea.style.fontSize = '12px';
              } else {
                textarea.style.fontSize = '14px';
              }
              if (len >= 826) {
                textarea.value = textarea.value.slice(0, 826);
              }
            }
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/:username', async (req, res) => {
  const { username } = req.params;
  const messageText = req.body.message;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const message = new Message({
      to: user._id,
      text: messageText,
    });

    await message.save();

    console.log(`✅ Message sent to ${user.username}:`, messageText);

    res.send(`
      <html>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

        <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 20%;">
          <h2 style="color: #302f2e;">Message sent successfully to ${user.username}!</h2>
          <a href="/${user.username}" style="color: #b73430;">Send another message</a>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('❌ Error saving message:', err);
    res.status(500).send('Internal server error');
  }
});


module.exports = router;

