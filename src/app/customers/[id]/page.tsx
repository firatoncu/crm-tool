import { prisma } from "@/lib/prisma";
import { CustomerForm } from "@/components/customer-form";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
    const { id } = await params;

    const customer = await prisma.customer.findUnique({
        where: { id },
    });

    if (!customer) {
        notFound();
    }

    return <CustomerForm initialCustomer={customer} />;
}
