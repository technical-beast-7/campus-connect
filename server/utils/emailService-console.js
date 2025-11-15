/**
 * TEMPORARY EMAIL SERVICE - LOGS OTP TO CONSOLE
 * Use this if nodemailer isn't working
 * 
 * To use: In authController.js, change:
 * import { sendOTPEmail, sendWelcomeEmail } from '../utils/emailService.js';
 * to:
 * import { sendOTPEmail, sendWelcomeEmail } from '../utils/emailService-console.js';
 */

/**
 * Send OTP email (Console version - just logs to console)
 */
export const sendOTPEmail = async (email, otp, name) => {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('📧 OTP EMAIL (Console Mode)');
    console.log('='.repeat(60));
    console.log('To:', email);
    console.log('Name:', name);
    console.log('OTP:', otp);
    console.log('='.repeat(60));
    console.log('⚠️  Copy the OTP above and enter it in the modal');
    console.log('='.repeat(60) + '\n');

    return {
      success: true,
      messageId: 'console-log',
      previewUrl: null
    };
  } catch (error) {
    console.error('Error logging OTP:', error);
    throw new Error('Failed to log OTP');
  }
};

/**
 * Send welcome email (Console version - just logs)
 */
export const sendWelcomeEmail = async (email, name, role) => {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('📧 WELCOME EMAIL (Console Mode)');
    console.log('='.repeat(60));
    console.log('To:', email);
    console.log('Name:', name);
    console.log('Role:', role);
    console.log('Message: Welcome to Campus Connect!');
    console.log('='.repeat(60) + '\n');

    return { success: true };
  } catch (error) {
    console.error('Error logging welcome email:', error);
    return { success: false };
  }
};

export default {
  sendOTPEmail,
  sendWelcomeEmail
};
