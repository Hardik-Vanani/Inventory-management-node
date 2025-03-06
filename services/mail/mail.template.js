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
            font-family: 'Arial', sans-serif;
            background-color: #f4f7f9;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.15);
            text-align: center;
        }
        .header {
            background: linear-gradient(135deg, #007BFF, #00C6FF);
            padding: 20px;
            border-radius: 10px 10px 0 0;
            color: white;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 1px;
        }
        .content {
            font-size: 16px;
            line-height: 1.8;
            padding: 20px 30px;
            text-align: left;
        }
        .otp-box {
            font-size: 36px;
            font-weight: bold;
            color: #007BFF;
            background: #eef5ff;
            padding: 15px 60px;
            border-radius: 8px;
            display: inline-block;
            margin: 30px 0;
            letter-spacing: 3px;
        }
        .note {
            font-size: 14px;
            color: #555;
            margin-top: 10px;
        }
        .footer {
            font-size: 14px;
            color: #777;
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 15px;
            text-align: center;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
            font-weight: bold;
        }
        .footer p {
            margin: 5px 0;
        }
        .button {
            display: inline-block;
            background: #007BFF;
            color: white;
            padding: 12px 25px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
            transition: 0.3s ease;
        }
        .button:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <div class="header">OTP Verification</div>
        
        <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <p>We received a request for OTP verification. Use the OTP below to proceed:</p>
            <div class="otp-box">${otp}</div>
            <p>This OTP is valid for the next <strong>5 minutes</strong>. Do not share it with anyone.</p>
            <p>If you did not request this OTP, you can safely ignore this email.</p>

        </div>

        <div class="footer">
            <p>Best regards, <br> <strong>Inventory Track</strong></p>
            <p>Need help? <a href="mailto:sharanvasoya.dev@gmail.com">Contact Support</a></p>
        </div>
    </div>

</body>
</html>

        `;
  },
};
