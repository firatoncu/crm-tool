import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Removed duplicate imports if any, using replaced block above
/* 
Note: I added imports in the previous chunk replacement (import { prisma } ...). 
But I need to make sure I don't break existing imports or duplicate them. 
The previous replacement REPLACED getCustomers function but included imports AT THE TOP? 
Wait, the `replace_file_content` instruction `ReplacementContent` had imports at the top! 
BUT if I target `getCustomers` lines 10-21, I cannot inject imports at line 1. 
I must split this or put imports inside the function (bad practice) or replace the top of the file.

Let's re-read the previous tool call.
I targeted lines 10-21. 
If I put `import { prisma } ...` there, it will be in the middle of imports list if line 10 follows imports?
Line 9 was empty. Lines 1-8 were imports.
So inserting imports at line 10 is technically valid JS/TS (imports can be anywhere) but ugly.
However, I should probably add imports cleanly at the top.
*/
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerType } from "@prisma/client";
import type { Customer } from "@prisma/client"; // safe type import
import { CUSTOMER_TYPE_LABELS } from "@/lib/constants";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

async function getCustomers(search: string) {
    try {
        const where: Prisma.CustomerWhereInput = {
            isActive: true,
        };

        if (search) {
            where.OR = [
                { companyName: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }

        const customers = await prisma.customer.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
        return customers;
    } catch (error) {
        console.error("Failed to fetch customers:", error);
        return [];
    }
}

export default async function CustomersPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>;
}) {
    const params = await searchParams;
    const search = params.search || "";
    const customers: Customer[] = await getCustomers(search);

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Müşteriler</h1>
                <Link href="/customers/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Yeni Müşteri
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Müşteri Listesi</CardTitle>
                    <div className="flex w-full max-w-sm items-center space-x-2 pt-2">
                        <form className="flex w-full gap-2">
                            <Input
                                name="search"
                                placeholder="Ara (Firma Adı, Telefon)..."
                                defaultValue={search}
                            />
                            <Button type="submit" variant="secondary" size="icon">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="h-12 px-4 align-middle font-medium">Firma Adı</th>
                                    <th className="h-12 px-4 align-middle font-medium">Tip</th>
                                    <th className="h-12 px-4 align-middle font-medium">Telefon</th>
                                    <th className="h-12 px-4 align-middle font-medium">Yetkili</th>
                                    <th className="h-12 px-4 align-middle font-medium">Şehir</th>
                                    <th className="h-12 px-4 align-middle font-medium">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                            Müşteri bulunamadı.
                                        </td>
                                    </tr>
                                ) : (
                                    customers.map((customer) => (
                                        <tr key={customer.id} className="border-t hover:bg-muted/50 transition-colors">
                                            <td className="p-4 font-medium">{customer.companyName}</td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                                                    {CUSTOMER_TYPE_LABELS[customer.customerType as CustomerType] || customer.customerType}
                                                </span>
                                            </td>
                                            <td className="p-4">{customer.phone}</td>
                                            <td className="p-4">{customer.contactPerson || "-"}</td>
                                            <td className="p-4">{customer.city || "-"}</td>
                                            <td className="p-4">
                                                <Link href={`/customers/${customer.id}`}>
                                                    <Button variant="outline" size="sm">Detay</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
