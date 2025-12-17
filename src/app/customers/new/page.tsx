"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomerType } from "@/generated/client/enums";
import type { Customer } from "@/generated/client"; // type import is safe
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { CUSTOMER_TYPE_LABELS } from "@/lib/constants";

export default function NewCustomerPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        company_name: "",
        phone: "",
        customer_type: "POTENTIAL" as CustomerType,
        city: "",
        district: "",
        contact_person: "",
        email: "",
        notes: ""
    });
    const [loading, setLoading] = useState(false);
    const [duplicateWarning, setDuplicateWarning] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent, force = false) => {
        e.preventDefault();
        setLoading(true);
        setDuplicateWarning(null);

        try {
            const res = await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, force }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push(`/customers/${data.id}`);
            } else if (res.status === 409) {
                setDuplicateWarning(data.duplicate);
            } else {
                alert(data.error || "Oluşturulamadı");
            }
        } catch (error) {
            console.error(error);
            alert("Bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Yeni Müşteri</h1>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Müşteri Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                    {duplicateWarning && (
                        <div className="mb-6 p-4 border border-yellow-200 bg-yellow-50 rounded-md text-yellow-800">
                            <div className="flex items-center gap-2 font-bold">
                                <AlertTriangle className="h-4 w-4" />
                                Olası Mükerrer Kayıt
                            </div>
                            <p className="text-sm mt-1">
                                <strong>{duplicateWarning.company_name}</strong> isimli ve <strong>{duplicateWarning.phone}</strong> telefonlu bir müşteri zaten mevcut.
                            </p>
                            <div className="mt-3 flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`/customers/${duplicateWarning.id}`)}
                                >
                                    Mevcut Kaydı Görüntüle
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={(e) => handleSubmit(e, true)}
                                >
                                    Yine de Oluştur
                                </Button>
                            </div>
                        </div>
                    )}

                    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Firma Adı *</label>
                                <Input
                                    placeholder="Örnek Ltd. Şti."
                                    required
                                    value={form.company_name}
                                    onChange={e => setForm({ ...form, company_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Telefon *</label>
                                <Input
                                    placeholder="05..."
                                    required
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tip</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={form.customer_type}
                                    onChange={(e) => setForm({ ...form, customer_type: e.target.value as CustomerType })}
                                >
                                    {Object.values(CustomerType).map((t) => (
                                        <option key={t} value={t}>{CUSTOMER_TYPE_LABELS[t]}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Şehir</label>
                                <Input
                                    placeholder="İstanbul"
                                    value={form.city}
                                    onChange={e => setForm({ ...form, city: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">İlçe</label>
                                <Input
                                    placeholder="Kadıköy"
                                    value={form.district}
                                    onChange={e => setForm({ ...form, district: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Yetkili Kişi</label>
                                <Input
                                    placeholder="Ad Soyad"
                                    value={form.contact_person}
                                    onChange={e => setForm({ ...form, contact_person: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">E-posta</label>
                                <Input
                                    type="email"
                                    placeholder="info@ornek.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notlar</label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={form.notes}
                                onChange={e => setForm({ ...form, notes: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="ghost" type="button" onClick={() => router.back()}>İptal</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Oluşturuluyor..." : "Müşteri Oluştur"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
