# Homify — Test Adımlari

## Onhazirlik
1. SQL ALTER scriptini calistirin: `fixes/SQL/1_AlterScript.sql`
2. Visual Studio'da `HomiefyCModel.edmx` dosyasini acin
3. Tasarim yuzeyi sag tik → **Update Model from Database** → USER tablosunu secerek Finish
4. Projeyi derleyin (`Ctrl+Shift+B`)

---

## Test 1: Kayit (Register)

1. Tarayicida `/USERs/Create` adresine gidin
2. Formu doldurun:
   - **Ad Soyad:** `Test Kullanici`
   - **Email:** `yeni@test.com`
   - **Sifre:** `Test1234`
   - **Sifre Tekrar:** `Test1234`
   - **Yas:** `25`
   - **Cinsiyet:** Male
3. "Kayit Ol" butonuna tıklayın

**Beklenen sonuc:**
- Hata yok
- Otomatik giris yapilir
- `/Profile/Index` sayfasina yonlendirilirsiniz
- Navbar'da `Test Kullanici` adi gozukur

---

## Test 2: Giris (Login)

1. Once `/USERs/Logout` ile cikis yapin
2. `/USERs/Login` adresine gidin
3. Email + sifre girin
4. "Giris Yap"a tıklayın

**Beklenen sonuc:**
- Yanlis sifre → `"Sifre yanlis."` hata mesaji, ayni sayfada kalir
- Dogru bilgi → `/Profile/Index` sayfasina yonlendirme
- Admin hesabi (admin@homify.com) → `/USERs/Index` admin paneline gider

---

## Test 3: Profil Yonlendirme & Panel Izolasyonu

1. Normal kullanici ile giris yapın
2. URL'ye `/USERs/Index` yazarak admin listesine erisilemedigini dogrulayın
   (Giris yapilmis ama admin degil; scaffolded controller size baska kullanicilari gosterebilir)
   → Bu sayfayi gelecekte `[Authorize(Roles="Admin")]` ile koruyun
3. Navbar'da yalnizca kendi adiniz, Favoriler, Mesajlar linkleri gorulmeli
4. `/Profile/Index` yalnizca kendi bilgilerinizi gostermeli

---

## Test 4: Son Ilanlar (Recent Listings)

1. `/Home/Index` adresine gidin
2. "Son Ilanlar" bolumunu inceleyin

**Beklenen sonuc:**
- Kartlarda: **Baslik, Aciklama, Kategori, Kira (₺X,XXX/ay), Oda No, Tarih** duzgun gozukmeli
- `â,°@item.Price...` gibi ham kod gozukmemeli
- Null ilan veya kategori varsa sayfa patlamasin
- Max 6 ilan, CreatedAt DESC sirali

---

## Test 5: Favoriye Ekle

1. Giris yapik olarak `/Home/Index` acin
2. Herhangi bir kartın altındaki **"Kaydet ♥"** butonuna tıklayın

**Beklenen sonuc:**
- Yeşil "`İlan favorilere eklendi!`" mesajı çıkar
- Aynı ilanı tekrar kaydetmeye çalışırsanız: "`Bu ilan zaten favorilerinizde!`" bilgisi çıkar, hata vermez

---

## Test 6: Favoriden Çıkar

1. `/FAVORITEs/Index` adresine gidin
2. İlan kartının üst sağındaki **kırmızı kalp** ikonuna tıklayın (form POST)

**Beklenen sonuc:**
- İlan favoriler listesinden kaybolur
- "`İlan favorilerden çıkarıldı.`" mesajı çıkar
- Başka kullanıcının favorileri görünmez (UserID filtresi çalışıyor)

---

## Test 7: Mesaj Gönder

1. `/MESSAGEs/Index` adresine gidin
2. Sol paneldeki **"Kisi sec"** dropdown'ından başka bir kullanıcı seçin
3. Mesaj kutusuna yazın ve "Gonder" butonuna tıklayın

**Beklenen sonuc:**
- Mesaj sağ alana chat baloncuğu olarak eklenir
- `SenderID = Session["UserID"]` (sizin ID'niz) olarak kaydedilir
- Boş mesaj göndermek hata verir, kayıt olmaz

---

## Test 8: Inbox / Sent Kontrolü

1. Farklı bir tarayıcıda (veya gizli sekme) ikinci test kullanıcısıyla giriş yapın
2. İkinci kullanıcı `/MESSAGEs/Index`'e gitsin
3. Sol panelde birinci kullanıcıdan gelen mesajı görmeli
4. Konuşmaya tıklayınca sağ panelde mesaj geçmişi açılmalı
5. İkinci kullanıcı cevap yazsın → birinci kullanıcıda da görünmeli

**Beklenen sonuc:**
- Inbox: `ReceiverID == benimID` olan mesajlar
- Sent: `SenderID == benimID` olan mesajlar
- Başkasının konuşması görünmez
- Null reference veya FK hatası yok

---

## Sık Karşılaşılan Sorunlar

| Sorun | Sebep | Çözüm |
|-------|-------|-------|
| `PasswordHash` derleme hatası | EF model güncellenmemiş | edmx → Update Model from Database |
| `USER` or `USER1` nav prop null | EF naming farklı | MessagesController'da `USER` / `USER1` sıralamasını kontrol edin |
| `ICollection<PROFILE>` vs `PROFILE` | EF 1:1 vs 1:N | `PROFILEs.FirstOrDefault()` yerine `PROFILE` yazmanız gerekebilir |
| Price garbled (`â,°...`) | `ToString("C")` + encoding | Yeni view `&#8378;@item.MonthlyRent.ToString("N0")` kullanır, düzelmiş olmalı |
| Login sonrası hâlâ admin paneli | Redirect güncellenmemiş | `USERsController_LoginRegisterMethods.cs` dosyasını ekleyin/güncelleyin |
