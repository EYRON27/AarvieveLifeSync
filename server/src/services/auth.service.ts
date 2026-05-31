import { auth, collections } from '../firebase';
import { BadRequestError } from '../utils/errors';

import nodemailer from 'nodemailer';

export class AuthService {
  async requestPasswordResetOTP(email: string) {
    try {
      const user = await auth.getUserByEmail(email);
      
      // Generate 6 digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Save OTP to Firestore with expiration (10 mins)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      await collections.otps.doc(email).set({
        otp,
        uid: user.uid,
        expiresAt: expiresAt.toISOString(),
      });

      // Send Real Email if Configured
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail', // You can change this if you use another provider
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"LifeSync" <${process.env.SMTP_USER}>`,
          to: email,
          subject: 'Your Password Reset OTP - LifeSync',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>Reset Your Password</h2>
              <p>You requested a password reset. Use the following 6-digit code to complete the process:</p>
              <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px; color: #333;">
                ${otp}
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
            </div>
          `
        });
        console.log(`✉️ REAL OTP EMAIL SENT TO: ${email}`);
      } else {
        // MOCK EMAIL SENDING
        console.log(`\n==============================================`);
        console.log(`✉️ MOCK EMAIL SENT TO: ${email}`);
        console.log(`🔑 YOUR PASSWORD RESET OTP IS: ${otp}`);
        console.log(`⚠️  WARNING: SMTP_USER and SMTP_PASS not set in .env. Real email was NOT sent.`);
        console.log(`==============================================\n`);
      }

      return { message: 'OTP sent successfully' };
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // Don't leak whether user exists for security, just pretend it sent
        return { message: 'If the email exists, an OTP was sent.' };
      }
      throw error;
    }
  }

  async verifyPasswordResetOTP(email: string, otp: string) {
    const doc = await collections.otps.doc(email).get();
    
    if (!doc.exists) {
      throw new BadRequestError('Invalid or expired OTP');
    }
    
    const data = doc.data()!;
    if (data.otp !== otp) {
      throw new BadRequestError('Invalid OTP');
    }
    
    if (new Date(data.expiresAt) < new Date()) {
      throw new BadRequestError('OTP has expired');
    }
    
    return { valid: true, uid: data.uid };
  }

  async resetPasswordWithOTP(email: string, otp: string, newPassword: string) {
    // Re-verify the OTP just to be safe
    const { uid } = await this.verifyPasswordResetOTP(email, otp);
    
    // Update password and mark email as verified in Firebase Auth
    await auth.updateUser(uid, { 
      password: newPassword,
      emailVerified: true 
    });
    
    // Delete the OTP so it can't be reused
    await collections.otps.doc(email).delete();
    
    return { message: 'Password successfully reset' };
  }
}

export const authService = new AuthService();
