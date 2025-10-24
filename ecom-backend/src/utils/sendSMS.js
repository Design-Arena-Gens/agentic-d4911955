const twilio = require('twilio');

const createClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials missing');
  }

  return twilio(accountSid, authToken);
};

const sendVerificationCode = async (phoneNumber) => {
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!serviceSid) {
    throw new Error('TWILIO_VERIFY_SERVICE_SID is not configured');
  }

  const client = createClient();
  await client.verify.v2.services(serviceSid).verifications.create({
    to: phoneNumber,
    channel: 'sms'
  });
};

const checkVerificationCode = async (phoneNumber, code) => {
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  const client = createClient();

  const verification = await client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({ to: phoneNumber, code });

  return verification.status === 'approved';
};

module.exports = {
  sendVerificationCode,
  checkVerificationCode
};
