import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CustomerType } from "@/generated/client";

// Helper to access params properly in Next.js 15+ (params is a Promise)
// But for standard route handlers in App Router, params is 2nd arg.
// type Props = { params: { id: string } }
// Actually in Next.js 15 params is async.
// I'll use `(request: NextRequest, { params }: { params: Promise<{ id: string }> })` just to be safe with newest versions,
// or `(request: NextRequest, { params }: { params: { id: string } })` if older.
// `create-next-app` installed "next": "16.0.10" (Wait, 16? 15 is latest stable. Maybe 15.1.0 or similar. Ah, Step 56 said next: 16.0.10? No, that was eslint-config-next. next version was 15 or 14?).
// Step 56: `"next": "16.0.10"`. Is Next 16 out? No, probably 15.1.
// Wait, `eslint-config-next`: `16.0.10` suggests Next 16?
// If it is Next 15, `params` should be awaited.
// "params" argument of route handlers is a Promise in Next.js 15.
// I will setup it as async params.

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const customer = await prisma.customer.findUnique({
            where: { id },
            include: {
                activities: {
                    orderBy: { created_at: "desc" },
                    take: 5, // Preview
                },
            },
        });

        if (!customer) {
            return NextResponse.json(
                { error: "Customer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const body = await request.json();
        // Allow partial updates
        const updated = await prisma.customer.update({
            where: { id },
            data: {
                ...body,
                updated_at: new Date(),
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update customer" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // Soft delete
        const deleted = await prisma.customer.update({
            where: { id },
            data: { is_active: false },
        });

        return NextResponse.json({ message: "Customer soft deleted", id: deleted.id });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete customer" },
            { status: 500 }
        );
    }
}
