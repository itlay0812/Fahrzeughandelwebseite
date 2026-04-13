import emailjs from "@emailjs/browser";

type InquiryCategory = "car_inquiry" | "search" | "sell";

type InquiryEmailPayload = {
  inquiryType: InquiryCategory;
  subject: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  carName?: string;
  carYear?: string;
  carPrice?: string;
  availability?: string;
};

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const toEmail = import.meta.env.VITE_INQUIRY_RECEIVER_EMAIL;

function hasEmailJsConfig() {
  return Boolean(serviceId && templateId && publicKey && toEmail);
}

export async function sendInquiryEmail(payload: InquiryEmailPayload) {
  if (!hasEmailJsConfig()) {
    console.warn(
      "EmailJS config missing. Please set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY and VITE_INQUIRY_RECEIVER_EMAIL."
    );
    return;
  }

  await emailjs.send(
    serviceId,
    templateId,
    {
      to_email: toEmail,
      inquiry_type: payload.inquiryType,
      subject: payload.subject,
      name: payload.name,
      email: payload.email,
      phone: payload.phone || "-",
      message: payload.message,
      car_name: payload.carName || "-",
      car_year: payload.carYear || "-",
      car_price: payload.carPrice || "-",
      availability: payload.availability || "-",
      submitted_at: new Date().toLocaleString("de-DE"),
    },
    {
      publicKey,
    }
  );
}
