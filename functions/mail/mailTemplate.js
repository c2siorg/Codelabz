module.exports = {
  verificationEmail: (verificationLink) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to CodeLabz - Verify Your Email</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .email-wrapper {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .title {
              font-size: 24px;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .content {
              color: #4b5563;
              margin-bottom: 30px;
            }
            .verification-button {
              display: inline-block;
              background-color: #2563eb;
              color: #ffffff;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 500;
              margin-bottom: 20px;
            }
            .verification-button:hover {
              background-color: #1d4ed8;
              color: #ffffff;
            }
            .alternate-link {
              color: #6b7280;
              font-size: 14px;
              word-break: break-all;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
            .social-links {
              margin-top: 20px;
            }
            .social-links a {
              color: #2563eb;
              text-decoration: none;
              margin: 0 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email-wrapper">
              <div class="header">
                <div class="logo">CodeLabz</div>
                <div class="title">Verify Your Email Address</div>
              </div>
              
              <div class="content">
                <p>Welcome to CodeLabz! 👋</p>
                <p>We're excited to have you join our community of learners and creators. To get started with your coding journey, please verify your email address by clicking the button below:</p>
                
                <center>
                  <a href="${verificationLink}" class="verification-button">
                    Verify Email Address
                  </a>
                </center>
                
                <p class="alternate-link">
                  If the button doesn't work, you can also copy and paste this link into your browser:<br>
                  ${verificationLink}
                </p>
              </div>
              
              <div class="footer">
                <p>This verification link will expire in 24 hours.</p>
                <p>If you didn't create a CodeLabz account, you can safely ignore this email.</p>
                <div class="social-links">
                  <a href="#">Twitter</a>
                  <a href="#">GitHub</a>
                  <a href="#">LinkedIn</a>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  // Template for welcome email after verification
  welcomeEmail: (username) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to CodeLabz!</title>
          <style>
            /* Same styles as above */
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email-wrapper">
              <div class="header">
                <div class="logo">CodeLabz</div>
                <div class="title">Welcome to CodeLabz!</div>
              </div>
              
              <div class="content">
                <p>Hi ${username}! 🎉</p>
                <p>Thank you for verifying your email address. Your CodeLabz account is now active and ready to use.</p>
                
                <p>Here's what you can do next:</p>
                <ul style="padding-left: 20px; color: #4b5563;">
                  <li>Explore our collection of tutorials</li>
                  <li>Join learning communities</li>
                  <li>Start your first course</li>
                  <li>Create your own tutorial (for organizations)</li>
                </ul>
                
                <center>
                  <a href="#" class="verification-button">
                    Start Learning
                  </a>
                </center>
              </div>
              
              <div class="footer">
                <p>Happy coding!</p>
                <p>The CodeLabz Team</p>
                <div class="social-links">
                  <a href="#">Twitter</a>
                  <a href="#">GitHub</a>
                  <a href="#">LinkedIn</a>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
};