"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomerType } from "@prisma/client";
import type { Customer } from "@prisma/client";
import { ActivityTimeline } from "@/components/activity-timeline";
import { ArrowLeft, Trash } from "lucide-react";
import { CUSTOMER_TYPE_LABELS } from "@/lib/constants";

interface CustomerFormProps {
    initialCustomer: Customer;
}

export function CustomerForm({ initialCustomer }: CustomerFormProps) {
    const router = useRouter();
    const [customer, setCustomer] = useState<Customer>(initialCustomer);
    const [activeTab, setActiveTab] = useState<"general" | "timeline">("general");
    const [isSaving, setIsSaving] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(`/api/customers/${customer.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: customer.companyName,
                    phone: customer.phone,
                    city: customer.city,
                    district: customer.district,
                    customerType: customer.customerType,
                    notes: customer.notes,
                    email: customer.email,
                    contactPerson: customer.contactPerson,
                    address: customer.address,
                })
            });
            if (res.ok) {
                const updated = await res.json();
                setCustomer(updated); // Update state with response
                alert("Müşteri güncellendi");
            } else {
                throw new Error("Güncelleme başarısız");
            }
        } catch (error) {
            console.error(error);
            alert("Güncelleme hatası");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) return;
        try {
            const res = await fetch(`/api/customers/${customer.id}`, { method: "DELETE" });
            if (res.ok) {
                router.push("/customers");
                router.refresh(); // Refresh list page
            } else {
                throw new Error("Silme başarısız");
            }
        } catch (e) {
            console.error(e);
            alert("Silme başarısız");
        }
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{customer.companyName}</h1>
                    <p className="text-muted-foreground">{CUSTOMER_TYPE_LABELS[customer.customerType] || customer.customerType}</p>
                </div>
                <div className="ml-auto">
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash className="mr-2 h-4 w-4" /> Sil
                    </Button>
                </div>
            </div>

            <div className="flex gap-4 border-b mb-6">
                <Button
                    variant={activeTab === "general" ? "default" : "ghost"}
                    onClick={() => setActiveTab("general")}
                    className="rounded-b-none rounded-t-lg"
                >
                    Genel Bilgiler
                </Button>
                <Button
                    variant={activeTab === "timeline" ? "default" : "ghost"}
                    onClick={() => setActiveTab("timeline")}
                    className="rounded-b-none rounded-t-lg"
                >
                    Aktivite Geçmişi
                </Button>
            </div>

            {activeTab === "general" ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Detaylar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdate} className="space-y-4 max-w-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Firma Adı</label>
                                    <Input
                                        value={customer.companyName || ""}
                                        onChange={e => setCustomer({ ...customer, companyName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Telefon</label>
                                    <Input
                                        value={customer.phone || ""}
                                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tip</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={customer.customerType}
                                        onChange={(e) => setCustomer({ ...customer, customerType: e.target.value as CustomerType })}
                                    >
                                        {Object.values(CustomerType).map((t) => (
                                            <option key={t as string} value={t}>{CUSTOMER_TYPE_LABELS[t]}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">E-posta</label>
                                    <Input
                                        value={customer.email || ""}
                                        onChange={e => setCustomer({ ...customer, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Yetkili Kişi</label>
                                    <Input
                                        value={customer.contactPerson || ""}
                                        onChange={e => setCustomer({ ...customer, contactPerson: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Şehir</label>
                                    <Input
                                        value={customer.city || ""}
                                        onChange={e => setCustomer({ ...customer, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">İlçe</label>
                                    <Input
                                        value={customer.district || ""}
                                        onChange={e => setCustomer({ ...customer, district: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Adres</label>
                                <textarea
                                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={customer.address || ""}
                                    onChange={e => setCustomer({ ...customer, address: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Notlar</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={customer.notes || ""}
                                    onChange={e => setCustomer({ ...customer, notes: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <ActivityTimeline customerId={customer.id} />
            )}
        </div>
    );
}
