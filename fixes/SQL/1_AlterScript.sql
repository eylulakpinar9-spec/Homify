-- =====================================================================
-- Homify DB - ALTER Scripts
-- HomiefyDB uzerinde calistirin
-- =====================================================================

USE HomiefyDB;
GO

-- -----------------------------------------------------------------------
-- 1. USER tablosuna PasswordHash ekle
-- -----------------------------------------------------------------------
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'USER' AND COLUMN_NAME = 'PasswordHash'
)
BEGIN
    ALTER TABLE [USER] ADD PasswordHash VARCHAR(255) NOT NULL DEFAULT '';
    PRINT '[USER].PasswordHash column added.';
END
ELSE
    PRINT '[USER].PasswordHash already exists.';
GO

-- -----------------------------------------------------------------------
-- 2. (Opsiyonel) IsAdmin kolonu — admin paneli icin
-- -----------------------------------------------------------------------
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'USER' AND COLUMN_NAME = 'IsAdmin'
)
BEGIN
    ALTER TABLE [USER] ADD IsAdmin BIT NOT NULL DEFAULT 0;
    PRINT '[USER].IsAdmin column added.';
END
ELSE
    PRINT '[USER].IsAdmin already exists.';
GO

-- -----------------------------------------------------------------------
-- 3. Mevcut kullanicilarin PasswordHash alanini guncelle
--    (Eger mevcut kullanici varsa bos hash yerine bir test degeri set edilir)
--    DIKKAT: Asagidaki hash SHA256("Test1234") base64 kodlamasi degildir,
--    sadece demo icin kullanilan placeholder. Gercek sisteme dokunmayin.
-- -----------------------------------------------------------------------
UPDATE [USER]
SET PasswordHash = 'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI='
WHERE PasswordHash = '';
-- SHA256("Password123") base64 = jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI=
-- Login sirasinda bu hash ile eslestirmeyi yapin.
PRINT 'Existing users updated with placeholder PasswordHash.';
GO

-- -----------------------------------------------------------------------
-- 4. Test kullanicisi olustur (yoksa)
--    Sifre: Password123  |  Hash: SHA256("Password123") base64
-- -----------------------------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM [USER] WHERE Email = 'test@homify.com')
BEGIN
    INSERT INTO [USER] (Name, Email, PhoneNumber, Age, Gender, PasswordHash, IsAdmin)
    VALUES (
        'Test Kullanici',
        'test@homify.com',
        '5551112233',
        25,
        'Male',
        'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI=',
        0
    );
    PRINT 'Test user inserted: test@homify.com / Password123';
END
GO

-- -----------------------------------------------------------------------
-- 5. Admin kullanici olustur (yoksa)
-- -----------------------------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM [USER] WHERE Email = 'admin@homify.com')
BEGIN
    INSERT INTO [USER] (Name, Email, PhoneNumber, Age, Gender, PasswordHash, IsAdmin)
    VALUES (
        'Admin',
        'admin@homify.com',
        '5550000000',
        30,
        'Other',
        'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI=',
        1
    );
    PRINT 'Admin user inserted: admin@homify.com / Password123';
END
GO

-- -----------------------------------------------------------------------
-- EF model guncelleme HATIRLATMASI:
-- ALTER scriptini calistirdiktan sonra Visual Studio'da:
--   1. HomiefyCModel.edmx dosyasini acin
--   2. Tasarim yuzeyi uzerinde sag tik → "Update Model from Database"
--   3. Tables altinda [USER] tablosunu secin → Finish
--   4. Projeyi yeniden derleyin (Ctrl+Shift+B)
-- Bu adim olmadan USER entity'sinde PasswordHash ve IsAdmin gorunmez.
-- -----------------------------------------------------------------------
PRINT 'ALTER script completed. Refresh your EF model in Visual Studio!';
GO
