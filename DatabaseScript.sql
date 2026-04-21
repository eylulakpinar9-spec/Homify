CREATE DATABASE HomiefyDB;
GO

USE HomiefyDB;
GO

-- 1. USER Table
CREATE TABLE [USER] (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PhoneNumber VARCHAR(15) UNIQUE,
    Age INT CHECK (Age >= 18),
    Gender VARCHAR(10)
);
GO

-- 2. PROFILE Table
CREATE TABLE [PROFILE] (
    ProfileID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT UNIQUE NOT NULL,
    Biography VARCHAR(500),
    Occupation VARCHAR(100),
    CleanlinessLevel VARCHAR(50),
    SleepSchedule VARCHAR(50),
    FOREIGN KEY (UserID) REFERENCES [USER](UserID)
);
GO

-- 3. CATEGORY Table
CREATE TABLE CATEGORY (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName VARCHAR(50) NOT NULL
);
GO

-- 4. LISTING Table
CREATE TABLE LISTING (
    ListingID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    CategoryID INT NOT NULL,
    Title VARCHAR(100) NOT NULL,
    Description VARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES [USER](UserID),
    FOREIGN KEY (CategoryID) REFERENCES CATEGORY(CategoryID)
);
GO

-- 5. ROOM Table
CREATE TABLE ROOM (
    RoomID INT PRIMARY KEY IDENTITY(1,1),
    ListingID INT NOT NULL,
    RoomNumber VARCHAR(20),
    Size INT,
    Furnished BIT DEFAULT 0,
    MonthlyRent DECIMAL(10,2) NOT NULL CHECK (MonthlyRent > 0),
    FOREIGN KEY (ListingID) REFERENCES LISTING(ListingID)
);
GO

-- 6. PREFERENCE Table
CREATE TABLE PREFERENCE (
    PreferenceID INT PRIMARY KEY IDENTITY(1,1),
    ListingID INT UNIQUE NOT NULL,
    SmokingAllowed BIT,
    PetsAllowed BIT,
    GenderPreference VARCHAR(10),
    MinAge INT,
    MaxAge INT,
    FOREIGN KEY (ListingID) REFERENCES LISTING(ListingID),
    CHECK (MinAge <= MaxAge)
);
GO

-- 7. APPLICATION Table
CREATE TABLE APPLICATION (
    ApplicationID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    RoomID INT NOT NULL,
    ApplicationDate DATETIME DEFAULT GETDATE(),
    Status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (UserID) REFERENCES [USER](UserID),
    FOREIGN KEY (RoomID) REFERENCES ROOM(RoomID)
);
GO

-- 8. PAYMENT Table
CREATE TABLE PAYMENT (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    ApplicationID INT UNIQUE NOT NULL,
    Amount DECIMAL(10,2) NOT NULL CHECK (Amount > 0),
    PaymentDate DATETIME DEFAULT GETDATE(),
    PaymentType VARCHAR(50),
    FOREIGN KEY (ApplicationID) REFERENCES APPLICATION(ApplicationID)
);
GO

-- 9. MESSAGE Table
CREATE TABLE MESSAGE (
    MessageID INT PRIMARY KEY IDENTITY(1,1),
    SenderID INT NOT NULL,
    ReceiverID INT NOT NULL,
    Content VARCHAR(1000) NOT NULL,
    SentAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (SenderID) REFERENCES [USER](UserID),
    FOREIGN KEY (ReceiverID) REFERENCES [USER](UserID)
);
GO

-- 10. FAVORITE Table
CREATE TABLE FAVORITE (
    UserID INT NOT NULL,
    ListingID INT NOT NULL,
    SavedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (UserID, ListingID),
    FOREIGN KEY (UserID) REFERENCES [USER](UserID),
    FOREIGN KEY (ListingID) REFERENCES LISTING(ListingID)
);
GO

-- Indices
CREATE INDEX idx_listing_user ON LISTING(UserID);
CREATE INDEX idx_listing_category ON LISTING(CategoryID);
CREATE INDEX idx_application_user ON APPLICATION(UserID);
CREATE INDEX idx_application_room ON APPLICATION(RoomID);
CREATE INDEX idx_message_sender ON MESSAGE(SenderID);
CREATE INDEX idx_message_receiver ON MESSAGE(ReceiverID);
GO

-- Views
CREATE VIEW UserApplicationsView AS
SELECT U.Name, L.Title, A.ApplicationDate, A.Status
FROM APPLICATION A
JOIN [USER] U ON A.UserID = U.UserID
JOIN ROOM R ON A.RoomID = R.RoomID
JOIN LISTING L ON R.ListingID = L.ListingID;
GO

CREATE VIEW ListingDetailsView AS
SELECT L.Title, R.MonthlyRent AS Price, C.CategoryName
FROM LISTING L
JOIN ROOM R ON L.ListingID = R.ListingID
JOIN CATEGORY C ON L.CategoryID = C.CategoryID;
GO

-- Triggers
CREATE TRIGGER trg_set_application_date
ON APPLICATION
AFTER INSERT
AS
BEGIN
    UPDATE A
    SET ApplicationDate = GETDATE()
    FROM APPLICATION A
    JOIN INSERTED I ON A.ApplicationID = I.ApplicationID
END;
GO

CREATE TRIGGER trg_prevent_duplicate_application
ON APPLICATION
INSTEAD OF INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1 FROM APPLICATION A
        JOIN INSERTED I ON A.UserID = I.UserID AND A.RoomID = I.RoomID
    )
    BEGIN
        RAISERROR ('User has already applied to this room.', 16, 1);
    END
    ELSE
    BEGIN
        INSERT INTO APPLICATION (UserID, RoomID, ApplicationDate, Status)
        SELECT UserID, RoomID, GETDATE(), 'Pending'
        FROM INSERTED;
    END
END;
GO
