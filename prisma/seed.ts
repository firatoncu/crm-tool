import { PrismaClient, CustomerType, ActivityType } from '@prisma/client';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const url = process.env.DATABASE_URL || "";
const connectionString = url.includes("localhost")
    ? url.replace("localhost", "127.0.0.1").replace(":5432", ":5433")
    : url;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding started...');

    // Create 5-10 Customers
    const customerCount = 7;

    for (let i = 0; i < customerCount; i++) {
        const companyName = `Company ${i + 1} Ltd. Şti.`;
        const phone = `0555123456${i}`;

        const customer = await prisma.customer.create({
            data: {
                companyName,
                phone,
                email: `info@company${i + 1}.com`,
                city: 'Istanbul',
                district: i % 2 === 0 ? 'Kadikoy' : 'Besiktas',
                customerType: i % 2 === 0 ? CustomerType.POTENTIAL : CustomerType.DEALER,
                contactPerson: `Manager ${i + 1}`,
                notes: 'Seeded customer',
                isActive: true,
            }
        });

        // Create 3-5 Activities for each
        const activityCount = 3 + (i % 3);

        for (let j = 0; j < activityCount; j++) {
            const hasAttachment = j === 0; // First activity has attachment

            const attachments = hasAttachment ? [
                {
                    url: 'https://example.com/file.pdf',
                    filename: 'proposal.pdf',
                    contentType: 'application/pdf',
                    size: 1024 * 50
                }
            ] : [];

            await prisma.activity.create({
                data: {
                    customerId: customer.id,
                    type: ActivityType.INTRO_CALL,
                    title: `Activity ${j + 1} for ${companyName}`,
                    description: 'Discussed potential partnership.',
                    createdBy: 'Seed Script',
                    attachments: attachments as any // Cast to Json
                }
            });
        }
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
