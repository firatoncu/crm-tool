"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ActivityType } from "@/generated/client/enums";
import type { Activity } from "@/generated/client";
import { Phone, Mail, MessageCircle, FileText, Truck, Wrench, StickyNote } from "lucide-react";
import { ACTIVITY_TYPE_LABELS } from "@/lib/constants";

interface ActivityTimelineProps {
    customerId: string;
}

export function ActivityTimeline({ customerId }: ActivityTimelineProps) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [newActivity, setNewActivity] = useState({
        title: "",
        description: "",
        type: "NOTE" as ActivityType,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchActivities = async () => {
        try {
            const res = await fetch(`/api/customers/${customerId}/activities`);
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (error) {
            console.error("Aktiviteler getirilemedi", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [customerId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newActivity.title) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/customers/${customerId}/activities`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newActivity, created_by: "Satış Temsilcisi" }), // Mock user
            });

            if (res.ok) {
                setNewActivity({ title: "", description: "", type: "NOTE" });
                fetchActivities(); // Refresh list
            }
        } catch (error) {
            console.error("Aktivite oluşturulamadı", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getIcon = (type: ActivityType) => {
        switch (type) {
            case "INTRO_CALL": return <Phone className="h-4 w-4" />;
            case "WHATSAPP_MESSAGE": return <MessageCircle className="h-4 w-4" />;
            case "EMAIL": return <Mail className="h-4 w-4" />;
            case "QUOTE_SENT": return <FileText className="h-4 w-4" />;
            case "SHIPMENT": return <Truck className="h-4 w-4" />;
            case "INSTALLATION": return <Wrench className="h-4 w-4" />;
            case "NOTE": return <StickyNote className="h-4 w-4" />;
            default: return <StickyNote className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Yeni Aktivite Ekle</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex gap-4">
                            <select
                                className="flex h-10 w-full md:w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={newActivity.type}
                                onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as ActivityType })}
                            >
                                {Object.values(ActivityType).map((t) => (
                                    <option key={t} value={t}>{ACTIVITY_TYPE_LABELS[t]}</option>
                                ))}
                            </select>
                            <Input
                                placeholder="Başlık (Örn. Tanışma Araması)"
                                value={newActivity.title}
                                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                                required
                            />
                        </div>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Açıklama veya notlar..."
                            value={newActivity.description || ""}
                            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Ekleniyor..." : "Aktivite Ekle"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="relative border-l border-muted ml-4 space-y-8 pb-10">
                {loading ? (
                    <p className="pl-6 text-muted-foreground">Aktiviteler yükleniyor...</p>
                ) : activities.length === 0 ? (
                    <p className="pl-6 text-muted-foreground">Henüz aktivite yok.</p>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className="relative pl-6">
                            <span className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-background ring-2 ring-muted">
                                {getIcon(activity.type)}
                            </span>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">{activity.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(activity.created_at).toLocaleString('tr-TR')}
                                    </span>
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                                        {ACTIVITY_TYPE_LABELS[activity.type] || activity.type}
                                    </span>
                                </div>
                                {activity.description && (
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {activity.description}
                                    </p>
                                )}
                                <div className="text-xs text-muted-foreground mt-1">
                                    Ekleyen: {activity.created_by}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
