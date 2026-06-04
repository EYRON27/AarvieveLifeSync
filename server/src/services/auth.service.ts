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

      const smtpUser = process.env.SMTP_USER || 'aaroncanada4@gmail.com';
      const smtpPass = process.env.SMTP_PASS || 'dwupofalorlseitx';

      // Send Real Email if Configured
      if (smtpUser && smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

          await transporter.sendMail({
            from: `"LifeSync" <${smtpUser}>`,
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
          return { message: 'OTP sent successfully' };
        } catch (error) {
          console.error(`Failed to send email to ${email}:`, error);
          return { message: 'Failed to send real email, falling back to mock OTP', mockOtp: otp };
        }
      } else {
        // MOCK EMAIL SENDING
        console.log(`\n==============================================`);
        console.log(`✉️ MOCK EMAIL SENT TO: ${email}`);
        console.log(`🔑 YOUR PASSWORD RESET OTP IS: ${otp}`);
        console.log(`⚠️  WARNING: SMTP_USER and SMTP_PASS not set in .env. Real email was NOT sent.`);
        console.log(`==============================================\n`);
        return { message: 'OTP sent successfully, check server logs', mockOtp: otp };
      }
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
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      throw new BadRequestError('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character');
    }

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
  async requestSignupOTP(email: string) {
    try {
      await auth.getUserByEmail(email);
      throw new BadRequestError('Email is already registered');
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') throw error;
      // User does not exist, proceed
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await collections.otps.doc(email).set({
      otp,
      uid: 'signup',
      expiresAt: expiresAt.toISOString(),
    });

    const smtpUser = process.env.SMTP_USER || 'aaroncanada4@gmail.com';
    const smtpPass = process.env.SMTP_PASS || 'dwupofalorlseitx';

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"LifeSync" <${smtpUser}>`,
          to: email,
          subject: 'Verify your email - LifeSync',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>Welcome to LifeSync!</h2>
              <p>Please use the following 6-digit code to complete your registration:</p>
              <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px; color: #333;">
                ${otp}
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
            </div>
          `
        });
        console.log(`✉️ REAL SIGNUP OTP EMAIL SENT TO: ${email}`);
        return { message: 'Signup OTP sent successfully' };
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        return { message: 'Failed to send real email, falling back to mock OTP', mockOtp: otp };
      }
    } else {
      console.log(`\n==============================================`);
      console.log(`✉️ MOCK SIGNUP EMAIL SENT TO: ${email}`);
      console.log(`🔑 YOUR SIGNUP OTP IS: ${otp}`);
      console.log(`==============================================\n`);
      return { message: 'Signup OTP sent successfully, check server logs', mockOtp: otp };
    }
  }

  async verifyAndRegisterUser(email: string, otp: string, password: string, displayName: string, currency: string) {
    const doc = await collections.otps.doc(email).get();
    
    if (!doc.exists) throw new BadRequestError('Invalid or expired OTP');
    
    const data = doc.data()!;
    if (data.otp !== otp || data.uid !== 'signup') throw new BadRequestError('Invalid OTP');
    
    if (new Date(data.expiresAt) < new Date()) throw new BadRequestError('OTP has expired');

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      throw new BadRequestError('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character');
    }

    // 1. Create user in Firebase Admin with emailVerified: true
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
      emailVerified: true
    });

    // 2. Create the user document in Firestore
    const dbUser = {
      uid: userRecord.uid,
      email,
      displayName,
      preferences: {
        theme: 'system',
        currency: currency || 'PHP'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await collections.users.doc(userRecord.uid).set(dbUser);

    // 3. Delete OTP
    await collections.otps.doc(email).delete();
    
    return { success: true, uid: userRecord.uid };
  }
}

export const authService = new AuthService();
