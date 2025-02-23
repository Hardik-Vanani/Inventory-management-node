module.exports = {
    sendOTP: ({ otp, name }) => {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
            <style>
                body {
                    font-family: 'Helvetica Neue', Arial, sans-serif;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                }
                .header h1 {
                    color: #4CAF50;
                    font-size: 28px;
                    margin: 0;
                }
                .content {
                    font-size: 16px;
                    line-height: 1.6;
                }
                .otp-box {
                    font-size: 40px;
                    font-weight: bold;
                    color: #4CAF50;
                    background: #f0f0f0;
                    padding: 15px 50px;
                    border-radius: 6px;
                    display: inline-block;
                    margin: 40px 0;
                }
                .footer {
                    text-align: center;
                    font-size: 14px;
                    color: #888;
                    margin-top: 30px;
                    border-top: 1px solid #f0f0f0;
                    padding-top: 15px;
                }
                .footer a {
                    color: #007BFF;
                    text-decoration: none;
                }
                .footer p {
                    margin: 0;
                }
            </style>
        </head>
        <body>

            <div class="email-container">
                <div class="header">
                    <h1>OTP Verification</h1>
                </div>
                
                <div class="content">
                    <p>Dear ${name},</p>
                    <p>Thank you for using our service. Your One-Time Password (OTP) for verification is as follows:</p>
                    <div class="otp-box">${otp}</div>
                    <p>This OTP is valid for the next 5 minutes. Please use it to complete your verification process. Do not share it with anyone to ensure your account’s security.</p>
                    <p>If you did not request this OTP, please disregard this message.</p>
                </div>

                <div class="footer">
                    <p>Best regards,<br>Inventory Track</p>
                    <p>If you have any issues, feel free to <a href="mailto:sharanvasoya.dev@gmail.com">contact our support team</a>.</p>
                </div>
            </div>

        </body>
        </html>
        `
    }
}