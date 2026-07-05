import { auth, collections } from '../firebase';
import { BadRequestError } from '../utils/errors';
import { Resend } from 'resend';

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
};

const OTP_HTML = (otp: string, title: string, body: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0f172a; color: #e2e8f0; border-radius: 12px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #14b8a6, #6366f1); border-radius: 12px; line-height: 48px; font-size: 24px; font-weight: bold; color: white;">A</div>
      <h2 style="color: #f1f5f9; margin-top: 12px;">${title}</h2>
    </div>
    <p style="color: #94a3b8;">${body}</p>
    <div style="background: #1e293b; border: 1px solid #334155; padding: 20px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 10px; margin: 24px 0; border-radius: 10px; color: #14b8a6;">
      ${otp}
    </div>
    <p style="color: #64748b; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
    <p style="color: #475569; font-size: 12px; text-align: center;">AarvieveLifeSync — Your Personal Productivity Hub</p>
  </div>
`;

async function sendOTPEmail(to: string, subject: string, html: string): Promise<{ sent: boolean; mockOtp?: string; otp?: string }> {
  const resend = getResendClient();

  if (!resend) {
    // No API key configured — log to console as fallback
    console.log(`\n==============================================`);
    console.log(`✉️  MOCK EMAIL TO: ${to}`);
    console.log(`📧  Subject: ${subject}`);
    console.log(`⚠️  RESEND_API_KEY not set. OTP is in the html payload.`);
    console.log(`==============================================\n`);
    return { sent: false };
  }

  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const { error } = await resend.emails.send({
      from: `LifeSync <${fromAddress}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend API error:', error);
      return { sent: false };
    }

    console.log(`✉️  Email sent via Resend to: ${to}`);
    return { sent: true };
  } catch (err) {
    console.error('Resend send failed:', err);
    return { sent: false };
  }
}

export class AuthService {
  async requestPasswordResetOTP(email: string) {
    try {
      const user = await auth.getUserByEmail(email);

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save OTP to Firestore with 10-min expiry
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await collections.otps.doc(email).set({
        otp,
        uid: user.uid,
        expiresAt: expiresAt.toISOString(),
      });

      const html = OTP_HTML(
        otp,
        'Reset Your Password',
        'You requested a password reset. Use the code below to complete the process:'
      );

      const result = await sendOTPEmail(
        email,
        'Your Password Reset OTP — LifeSync',
        html
      );

      if (result.sent) {
        return { message: 'OTP sent to your email' };
      } else {
        // Return OTP directly as fallback so user can still proceed
        console.log(`🔑 PASSWORD RESET OTP for ${email}: ${otp}`);
        return { message: 'Email service not configured. Use the OTP shown.', mockOtp: otp };
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return { message: 'If that email is registered, an OTP was sent.' };
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
    if (
      newPassword.length < 8 ||
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !/[^A-Za-z0-9]/.test(newPassword)
    ) {
      throw new BadRequestError(
        'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
      );
    }

    const { uid } = await this.verifyPasswordResetOTP(email, otp);

    await auth.updateUser(uid, {
      password: newPassword,
      emailVerified: true,
    });

    await collections.otps.doc(email).delete();

    return { message: 'Password successfully reset' };
  }

  async requestSignupOTP(email: string) {
    // Make sure email is not already registered
    try {
      await auth.getUserByEmail(email);
      throw new BadRequestError('Email is already registered');
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') throw error;
    }

    // Generate and save OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await collections.otps.doc(email).set({
      otp,
      uid: 'signup',
      expiresAt: expiresAt.toISOString(),
    });

    const html = OTP_HTML(
      otp,
      'Welcome to LifeSync!',
      'Please use the code below to complete your registration:'
    );

    const result = await sendOTPEmail(
      email,
      'Verify your email — LifeSync',
      html
    );

    if (result.sent) {
      return { message: 'OTP sent to your email' };
    } else {
      // Return OTP as fallback
      console.log(`🔑 SIGNUP OTP for ${email}: ${otp}`);
      return { message: 'Email service not configured. Use the OTP shown.', mockOtp: otp };
    }
  }

  async verifyAndRegisterUser(
    email: string,
    otp: string,
    password: string,
    displayName: string,
    currency: string
  ) {
    const doc = await collections.otps.doc(email).get();

    if (!doc.exists) throw new BadRequestError('Invalid or expired OTP');

    const data = doc.data()!;
    if (data.otp !== otp || data.uid !== 'signup') throw new BadRequestError('Invalid OTP');

    if (new Date(data.expiresAt) < new Date()) throw new BadRequestError('OTP has expired');

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      throw new BadRequestError(
        'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
      );
    }

    // Create user in Firebase Admin
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
      emailVerified: true,
    });

    // Save user to Firestore
    const dbUser = {
      uid: userRecord.uid,
      email,
      displayName,
      preferences: {
        theme: 'system',
        currency: currency || 'PHP',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await collections.users.doc(userRecord.uid).set(dbUser);

    // Delete OTP
    await collections.otps.doc(email).delete();

    return { success: true, uid: userRecord.uid };
  }
}

export const authService = new AuthService();
