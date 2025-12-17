"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CustomerType } from "@prisma/client";

export async function updateCustomer(id: string, data: {
    companyName: string;
    phone: string;
    city?: string | null;
    district?: string | null;
    address?: string | null;
    customerType: CustomerType;
    email?: string | null;
    contactPerson?: string | null;
    notes?: string | null;
}) {
    try {
        const updated = await prisma.customer.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });

        revalidatePath(`/customers/${id}`);
        revalidatePath("/customers");

        return { success: true, data: updated };
    } catch (error) {
        console.error("Update error:", error);
        return { success: false, error: "Failed to update customer" };
    }
}

export async function deleteCustomer(id: string) {
    try {
        await prisma.customer.update({
            where: { id },
            data: { isActive: false },
        });

        revalidatePath("/customers");
        return { success: true };
    } catch (error) {
        console.error("Delete error:", error);
        return { success: false, error: "Failed to delete customer" };
    }
}
