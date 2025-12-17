# B2B Klima Satış CRM Sistemi – Core README

## 1. Projenin Amacı ve Kapsamı
ÖNEMLİ DETAY: ARAYÜZ TAMAMEN TÜRKÇE OLACAK !!! UYGULAMA TÜRKİYEDE KULLANILACAK BU SEBEPLE ARAYÜZ TÜRKÇE OLMALI !!!!
Bu proje, **B2B ağırlıklı klima sektöründe faaliyet gösteren bir üretici firma** için özel olarak geliştirilen,  
**satış – teklif – proje takibi – kârlılık** odaklı bir **web tabanlı CRM sistemidir**.

Bu sistemin temel amacı:

- WhatsApp ve e-posta merkezli satış süreçlerini tek bir platformda toplamak
- Tekliften satış sonrasına kadar olan süreci **uçtan uca izlenebilir** hale getirmek
- Esnek ama **kontrollü fiyatlama** ve **denetlenebilir indirim** mekanizması sağlamak
- Proje bazlı **kârlılık ve performans görünürlüğü** kazandırmak

### Bilinçli Olarak Kapsam Dışı Olanlar
Bu sistem:
- ❌ ERP değildir
- ❌ Stok yönetimi içermez
- ❌ Muhasebe / faturalama sistemi değildir
- ❌ Servis operasyon yazılımı değildir

Bu CRM yalnızca:
> **Satış, teklif, proje ve kârlılık** süreçlerine odaklanır.

---

## 2. Gelecek Vizyonu (Neye Evrilecek?)

Bu proje:
- İlk etapta **demo / pilot** amaçlı olarak **Vercel** üzerinde çalışacaktır
- Ürünleşme aşamasında:
  - şirketin **fabrika içi sunucularına (on-premise)** taşınacaktır
  - Docker / container tabanlı çalışacaktır
  - PostgreSQL yine ana veritabanı olacaktır

Dolayısıyla:
> Yazılan tüm kodlar **deployment-agnostic** olmalıdır.  
> (Vercel → On-prem geçişi yalnızca altyapı değişimi olmalıdır.)

İleride:
- ERP entegrasyonu
- Servis yazılımı entegrasyonu
- Gelişmiş analitik modüller

eklenebilir; ancak **çekirdek CRM mantığı bozulmamalıdır**.

---

## 3. Teknoloji Stack’i (Net ve Değişmeyecek)

### Demo / Pilot Ortam
- **Frontend + Backend:** Next.js (App Router)
- **Hosting:** Vercel
- **Database:** PostgreSQL (Managed DB – Vercel / muadili)
- **ORM:** Prisma
- **Auth:** NextAuth veya eşdeğeri
- **API:** Next.js API Routes (REST yaklaşımı)
- **Dosyalar:** Vercel Blob / eşdeğeri

### Ürün Ortamı (Gelecek)
- **Hosting:** On-premise sunucular
- **Deployment:** Docker / Docker Compose
- **Database:** PostgreSQL (on-prem)
- **Dosyalar:** Local disk veya S3-compatible (örn. MinIO)

> Kod yazılırken **hiçbir şekilde Vercel’e özel hack** yapılmamalıdır.

---

## 4. Mimari Prensipler (Zorunlu Kurallar)

Bu proje aşağıdaki prensiplere **kesinlikle uymalıdır**:

1. **API-first yaklaşım**
   - UI doğrudan DB’ye dokunmaz
   - Tüm işlemler API katmanından geçer

2. **Modüler yapı**
   - Her modül:
     - kendi DB tablolarına
     - kendi API endpointlerine
     - kendi UI ekranlarına sahiptir
   - Mevcut modüller bozulmadan genişlemelidir

3. **Audit & İzlenebilirlik**
   - Fiyat, indirim, durum değişiklikleri:
     - kim yaptı
     - ne zaman yaptı
     - önceki değer neydi
     mutlaka izlenebilir olmalıdır

4. **Yetki & Güvenlik önceliklidir**
   - Alan bazlı yetkilendirme zorunludur
   - Hassas finansal alanlar yetkisiz kullanıcılara asla dönmemelidir

---

## 5. Domain Glossary (Kanonik Dil – Değiştirilmemeli)

Bu projede aşağıdaki kavramlar **tek anlamlıdır**:

### Customer
- Firma veya müşteri kaydı
- Tipleri olabilir (bayi, ihracat, proje, bireysel vs.)

### Opportunity / Project
- Bir müşteri altında yürüyen **satış/proje süreci**
- Pipeline aşamaları buraya bağlıdır
- Bir müşterinin birden fazla opportunity’si olabilir

### Pipeline Stage
- Opportunity’nin satış sürecindeki konumu
- Örn: New → Intro Sent → Quote Sent → Follow-up → Won → Shipment → Installation → Completed

### Quote
- Bir opportunity’ye bağlı fiyat teklifi
- PDF çıktısı vardır
- Durumları: Pending / Accepted / Rejected

### Quote Revision
- Teklif revizyonları **ayrı versiyonlar** olarak tutulur
- Eski revizyonlar silinmez

### Quote Line
- Teklif içindeki her bir kalem
- Ürün, hizmet, montaj, serbest kalem vb.

### Activity
- Zaman çizgisi kaydı
- Arama, WhatsApp, e-posta, teklif, sevkiyat, kurulum vb.

---

## 6. Yetki ve Güvenlik Kuralları (Disiplin)

- Rol bazlı yetki zorunludur (Admin / Sales)
- Müşteri tipi bazlı görünürlük olabilir
- **Satınalma fiyatı, kâr, maliyet** gibi alanlar:
  - yalnızca yetkili roller tarafından görülebilir
- Yetkisiz kullanıcıya bu alanlar:
  - API response’unda dahi dönmemelidir

> Güvenlik sadece UI’da değil, **backend’de enforce edilmelidir**.

---

## 7. AI Geliştirici İçin Açık Talimatlar (Sözleşme)

Bu README ile çalışan AI geliştiriciden beklenenler:

- Over-engineering yapma
- Ama production-ready kod yaz
- Kod:
  - okunabilir
  - genişletilebilir
  - modüler olmalı
- “Sonra bakarız” yaklaşımı yok
- Gelecek modülleri bozacak shortcut’lar kullanılmamalı

Her modül geliştirirken:
- DB şeması
- API endpointleri
- UI ekranları
- örnek seed data

birlikte düşünülmelidir.

---

## 8. Fazlama Yaklaşımı

Bu README **çekirdek manifesttir** ve sabit kalacaktır.

Geliştirme fazları:
- Faz 1 – MVP
- Faz 2 – Kârlılık & Raporlama
- Faz 3 – Entegrasyonlar

fazlara özel notlar **ayrı dokümanlarda** tanımlanacaktır.

---

## 9. Son Not

Bu proje:
- hızlı demo çıkarma
- ama uzun vadede ürünleşme

hedefiyle tasarlanmıştır.

Kısa vadeli çözümler,
uzun vadeli teknik borç yaratmamalıdır.