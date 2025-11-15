import nodemailer from 'nodemailer';

/**
 * Create email transporter
 * For development, we'll use a test account from Ethereal
 * For production, use a real email service (Gmail, SendGrid, etc.)
 */
const createTransporter = async () => {
  try {
    // Check if production email is configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      console.log('📧 Using production email service:', process.env.EMAIL_USER);
      
      return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false // For development, accept self-signed certificates
        }
      });
    }

    // For development: Create a test account from Ethereal
    console.log('📧 Using Ethereal test email service (development mode)');
    console.log('⚠️  To send to real emails, configure EMAIL_USER and EMAIL_PASSWORD in .env');
    
    const testAccount = await nodemailer.createTestAccount();
    console.log('✅ Ethereal account created:', testAccount.user);
    
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.error('❌ Error creating email transporter:', error.message);
    throw error;
  }
};

/**
 * Send OTP email
 */
export const sendOTPEmail = async (email, otp, name) => {
  try {
    console.log('Attempting to send OTP email to:', email);
    const transporter = await createTransporter();
    console.log('Transporter created successfully');

    const mailOptions = {
      from: `"Campus Connect" <${process.env.EMAIL_USER || 'noreply@campusconnect.com'}>`,
      to: email,
      subject: 'Verify Your Email - Campus Connect',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Campus Connect</h1>
              <p>Email Verification</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for registering with Campus Connect. To complete your registration, please verify your email address using the OTP below:</p>
              
              <div class="otp-box">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Your One-Time Password</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 12px;">Valid for 10 minutes</p>
              </div>

              <p><strong>Important:</strong></p>
              <ul>
                <li>This OTP is valid for 10 minutes only</li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>

              <p>Once verified, you'll be able to:</p>
              <ul>
                <li>Report campus issues</li>
                <li>Track issue status</li>
                <li>Communicate with authorities</li>
              </ul>

              <p>Best regards,<br><strong>Campus Connect Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; 2025 Campus Connect. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hello ${name}!
        
        Thank you for registering with Campus Connect.
        
        Your OTP for email verification is: ${otp}
        
        This OTP is valid for 10 minutes only.
        
        If you didn't request this, please ignore this email.
        
        Best regards,
        Campus Connect Team
      `
    };

    console.log('Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');

    // For development: Log the preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
      console.log('📧 Preview Email URL:', previewUrl);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl
    };
  } catch (error) {
    console.error('Email sending error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

/**
 * Send welcome email after successful registration
 */
export const sendWelcomeEmail = async (email, name, role) => {
  try {
    const transporter = await createTransporter();

    const roleMessages = {
      student: 'You can now report issues and track their status.',
      faculty: 'You can now report issues and track their status.',
      authority: 'You can now manage and resolve reported issues.'
    };

    const mailOptions = {
      from: `"Campus Connect" <${process.env.EMAIL_USER || 'noreply@campusconnect.com'}>`,
      to: email,
      subject: 'Welcome to Campus Connect! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Campus Connect</h1>
              <p>Welcome Aboard!</p>
            </div>
            <div class="content">
              <div class="success-icon">✅</div>
              <h2>Welcome, ${name}!</h2>
              <p>Your account has been successfully created and verified.</p>
              
              <p><strong>Account Type:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
              
              <p>${roleMessages[role]}</p>

              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Log in to your account</li>
                <li>Complete your profile</li>
                <li>Start using Campus Connect</li>
              </ul>

              <p>If you have any questions, feel free to reach out to our support team.</p>

              <p>Best regards,<br><strong>Campus Connect Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Campus Connect. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Welcome email error:', error);
    // Don't throw error for welcome email - it's not critical
    return { success: false };
  }
};

export default {
  sendOTPEmail,
  sendWelcomeEmail
};
