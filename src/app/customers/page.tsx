import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerType } from "@prisma/client";
import type { Customer } from "@prisma/client"; // safe type import
import { CUSTOMER_TYPE_LABELS } from "@/lib/constants";

async function getCustomers(search: string) {
    try {
        const res = await fetch(`http://localhost:3000/api/customers?search=${search}`, {
            cache: "no-store",
        });
        if (!res.ok) return [];
        return res.json();
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
