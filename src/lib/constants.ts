import { CustomerType, ActivityType } from "@prisma/client";

export const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
    DEALER: "Bayi",
    AUTHORIZED_SERVICE: "Yetkili Servis",
    ACTIVE: "Aktif Müşteri",
    POTENTIAL: "Potansiyel Müşteri",
    CORPORATE_END_USER: "Kurumsal Son Kullanıcı",
    PROJECT_CUSTOMER: "Proje Müşterisi",
    INDIVIDUAL: "Bireysel",
    EXPORT_DISTRIBUTOR: "İhracat Distribütörü",
    EXPORT_PROJECT: "İhracat Projesi",
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
    INTRO_CALL: "Tanışma Araması",
    WHATSAPP_MESSAGE: "WhatsApp Mesajı",
    EMAIL: "E-posta",
    QUOTE_SENT: "Teklif Gönderildi",
    SHIPMENT: "Sevkiyat",
    INSTALLATION: "Kurulum / Montaj",
    NOTE: "Not",
};
