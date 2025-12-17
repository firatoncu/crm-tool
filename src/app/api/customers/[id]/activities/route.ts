import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ActivityType } from "@prisma/client";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const activities = await prisma.activity.findMany({
            where: { customerId: id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(activities);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch activities" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const body = await request.json();
        const { type, title, description, attachments, createdBy } = body;

        // Validation
        if (!type || !title) {
            return NextResponse.json(
                { error: "Type and Title are required" },
                { status: 400 }
            );
        }

        const activity = await prisma.activity.create({
            data: {
                customerId: id,
                type: type as ActivityType,
                title,
                description,
                attachments: attachments || [],
                createdBy: createdBy || "System", // Default if not provided
            },
        });

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error("Error creating activity:", error);
        return NextResponse.json(
            { error: "Failed to create activity" },
            { status: 500 }
        );
    }
}
