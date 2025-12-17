# Nasıl Vercel'e Deploy Edilir?

Projeniz artık PostgreSQL ile tam uyumlu ve Vercel Postgres kullanmaya hazır. Aşağıdaki adımları takip ederek canlıya alabilirsiniz.

## 1. Hazırlık
Projenizi bir GitHub deposuna (repository) yüklediğinizden emin olun.

## 2. Vercel Projesi Oluşturma
1. Vercel Dashboard'a gidin ve **"Add New Project"** butonuna tıklayın.
2. GitHub deponuzu seçin ve **Import** edin.
3. **Project Name** kısmını dilediğiniz gibi ayarlayın (örn: `crm-tool`).
4. **Environment Variables** (Ortam Değişkenleri) kısmını *şimdilik* boş bırakın veya mevcutsa ekleyin.
5. **Deploy** butonuna tıklayın.
   - *Not: İlk deploy veritabanı olmadığı için başarısız olabilir veya uygulama çalışmayabilir. Bu normaldir.*

## 3. Storage (Veritabanı) Ekleme
1. Vercel'de oluşturduğunuz projenin **Dashboard** (Project Overview) sayfasına gidin.
2. Üst menüden **Storage** sekmesine tıklayın.
3. **Connect Store** -> **Postgres** seçeneğini seçin (Vercel Postgres).
4. Veritabanı oluşturulduğunda Vercel otomatik olarak gerekli ortam değişkenlerini (`POSTGRES_URL`, `POSTGRES_PRISMA_URL` vb.) projenize ekler.

## 4. Veritabanı Bağlantısı Ayarı
Vercel Postgres değişkenleri otomatik eklenir ancak Prisma için ufak bir ayar gerekebilir.
1. Projenizin **Settings** -> **Environment Variables** kısmına gidin.
2. `POSTGRES_PRISMA_URL` değişkeninin değerini kopyalayın.
3. Yeni bir değişken ekleyin:
   - **Key**: `DATABASE_URL`
   - **Value**: (Kopyaladığınız `POSTGRES_PRISMA_URL` değeri)
4. (Opsiyonel) Eğer `POSTGRES_URL_NON_POOLING` varsa, bunu da `DIRECT_URL` olarak ekleyin.

## 5. Build Ayarları
`package.json` dosyasında şu script zaten hazır:
```json
"postinstall": "prisma generate"
```
Bu sayede Vercel her deploy sırasında Prisma Client'ı otomatik üretecek.

## 6. Veritabanı Tablolarını Oluşturma
Uygulamanız deploy edildiğinde tablolar henüz yoktur. Bunu yapmak için iki yolunuz var:

**Yol A: Yerel Bilgisayardan (Önerilen)**
Bilgisayarınızdaki projeyi Vercel veritabanına bağlayıp tabloları oluşturabilirsiniz.
1. Vercel panelinden `POSTGRES_PRISMA_URL` değerini alın.
2. Terminalde geçici olarak bu URL'i kullanın:
   ```bash
   DATABASE_URL="postgres://..." npx prisma migrate deploy
   ```

**Yol B: Vercel Deploy Hook (Gelişmiş)**
Build komutunu `prisma migrate deploy && next build` olarak güncelleyebilirsiniz ama bu bazen timeout sorunlarına yol açabilir.

## 7. Son Kontrol
Veri tabanı şeması migrate edildikten sonra Vercel'deki uygulamanızı **Redeploy** yapın (Deployment sayfasından "Redeploy"). Uygulamanız artık PostgreSQL ile çalışacaktır!
