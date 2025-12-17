const { PrismaClient, CustomerType, ActivityType } = require('../src/generated/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data (CommonJS)...');

    // Clean up
    try {
        await prisma.activity.deleteMany();
        await prisma.customer.deleteMany();
    } catch (e) {
        console.log("Cleanup failed or empty db", e.message);
    }

    const customersData = [
        {
            company_name: "KlimaPlus Ltd",
            phone: "05321112233",
            email: "info@klimaplus.com",
            city: "Istanbul",
            customer_type: "DEALER", // Enums as strings often work, or use object
            contact_person: "Ahmet Yilmaz",
        },
        {
            company_name: "Ege Sogutma AS",
            phone: "02324445566",
            email: "satis@egesogutma.com",
            city: "Izmir",
            customer_type: "AUTHORIZED_SERVICE",
            contact_person: "Mehmet Demir",
        },
        {
            company_name: "Mega Project Insaat",
            phone: "02123334455",
            city: "Istanbul",
            customer_type: "PROJECT_CUSTOMER",
            contact_person: "Ayse Kara",
            notes: "Buyuk proje potansiyeli",
        },
        {
            company_name: "Antalya Otelcilik",
            phone: "02425556677",
            city: "Antalya",
            customer_type: "CORPORATE_END_USER",
        },
        {
            company_name: "Bireysel Musteri Ali",
            phone: "05051234567",
            customer_type: "INDIVIDUAL",
            city: "Ankara",
        },
        {
            company_name: "Global Export GMBH",
            phone: "+49123456789",
            customer_type: "EXPORT_DISTRIBUTOR",
            city: "Berlin",
            email: "import@global.de",
        }
    ];

    for (const c of customersData) {
        const customer = await prisma.customer.create({
            data: {
                ...c,
                customer_type: c.customer_type // Prisma client handles string to enum mapping if valid
            },
        });

        console.log(`Created customer: ${customer.company_name}`);

        // Add Activities
        await prisma.activity.create({
            data: {
                customer_id: customer.id,
                type: "INTRO_CALL",
                title: "Ilk Gorusme",
                description: "Genel tanisma ve urun tanitimi yapildi.",
                created_by: "Sales Rep 1"
            }
        });

        // Random additional activity
        if (Math.random() > 0.5) {
            await prisma.activity.create({
                data: {
                    customer_id: customer.id,
                    type: "QUOTE_SENT",
                    title: "Teklif Gonderildi",
                    description: "VRF sistem icin on teklif paylasildi.",
                    created_by: "Sales Rep 1"
                }
            });
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
