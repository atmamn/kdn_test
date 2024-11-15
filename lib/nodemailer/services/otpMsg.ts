import nodemailerFn from "../nodemailer";
export const createOtpMessage = (otpCode: string) => {
  const message = `<div style="font-family: Arial, sans-serif; color: #333;">
                     <h2>Your OTP Code</h2>
                     <h1>${otpCode}</h1>

                     <p>This code expires in 30 minutes.</p>
                   </div>`;
  const subject = "OTP";
  const text = otpCode;
  return { message, subject, text };
};

export const sendOtpEmail = async (email: string, otpCode: string) => {
  const { message, subject, text } = createOtpMessage(otpCode);
  return await nodemailerFn(message, email, subject, text);
};
