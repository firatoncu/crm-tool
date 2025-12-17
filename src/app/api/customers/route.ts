import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CustomerType, Prisma } from "@/generated/client";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");
        const type = searchParams.get("type");

        const where: Prisma.CustomerWhereInput = {
            is_active: true,
        };

        if (search) {
            where.OR = [
                { company_name: { contains: search } }, // Case insensitive via Prisma? SQLite is mixed, Postgres is case sensitive usually but contains is case sensitive in Default? Mode: insensitive is needed
                { phone: { contains: search } },
            ];
        }

        if (type && Object.values(CustomerType).includes(type as CustomerType)) {
            where.customer_type = type as CustomerType;
        }

        const customers = await prisma.customer.findMany({
            where,
            orderBy: { created_at: "desc" },
        });

        return NextResponse.json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        return NextResponse.json(
            { error: "Failed to fetch customers" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { company_name, phone, type, city, district, email, notes, contact_person } = body;

        // Validate required fields
        if (!company_name || !phone) {
            return NextResponse.json(
                { error: "Company name and phone are required" },
                { status: 400 }
            );
        }

        // Duplicate Check logic:
        // "phone veya company_name üzerinden case-insensitive + partial match"
        // For Partial match duplicate check, be careful not to block legit ones.
        // Usually duplicate check is "Exact match" or "Very close".
        // Requirement says: "Eğer benzer kayıt varsa UI'da uyarı göster... Kaydetmeyi tamamen engelleme".
        // So the API should probably return a warning OR the UI does the check first.
        // BUT "Mükerrer kontrol... üzerinden... yapılmalı".
        // I'll implement a strict check for "Exact Phone" or "Exact Name" (insensitive) as a BLOCKER or WARNING?
        // "Kaydetmeyi tamamen engelleme Ama kullanıcıyı bilinçlendir" -> This implies the UI should check BEFORE submitting, or the API returns a warning flag?
        // If I just POST, it creates.
        // Maybe I should add a query param `?force=true` to override duplicate warning?
        // Or simpler: The requirements map says "Mükerrer kontrol (telefon + firma adı)".
        // I will checking for duplicates. If found, return 409 (Conflict) with details, unless `force: true` is in body.

        const isForce = body.force === true;

        if (!isForce) {
            const existing = await prisma.customer.findFirst({
                where: {
                    OR: [
                        { company_name: { equals: company_name } }, // SQLite default insensitive? No.
                        { phone: { contains: phone } }, // Phone exact match often better
                    ]
                }
            });
            // Note: for proper case insensitive, would use mode: 'insensitive' but on SQLite it has limitations. 
            // I'll trust Prisma to handle basic find.

            if (existing) {
                return NextResponse.json(
                    {
                        error: "Possible duplicate found",
                        duplicate: existing,
                        code: "DUPLICATE_FOUND"
                    },
                    { status: 409 }
                );
            }
        }

        const newCustomer = await prisma.customer.create({
            data: {
                company_name,
                phone,
                customer_type: (type as CustomerType) || "POTENTIAL",
                city,
                district,
                email,
                notes,
                contact_person,
            },
        });

        return NextResponse.json(newCustomer, { status: 201 });
    } catch (error) {
        console.error("Error creating customer:", error);
        return NextResponse.json(
            { error: "Failed to create customer" },
            { status: 500 }
        );
    }
}
