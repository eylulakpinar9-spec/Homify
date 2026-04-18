// --- DATABASE MOCK ---
// This dataset simulates the Homiefy database schema
const DEFAULT_DB = {
    Categories: [
        { CategoryID: 1, CategoryName: "Student Housing", TargetGroup: "Students" },
        { CategoryID: 2, CategoryName: "Young Professionals", TargetGroup: "Professionals" },
        { CategoryID: 3, CategoryName: "Mixed Shared", TargetGroup: "Anyone" }
    ],
    Users: [
        { UserID: 1, Name: "Atakan Ünal", Email: "atakan@example.com", PhoneNumber: "5551234567", RegistrationDate: "2026-01-10", Age: 25, Gender: "Male" },
        { UserID: 2, Name: "Mehmet Kaya", Email: "mehmet@example.com", PhoneNumber: "5559876543", RegistrationDate: "2026-01-15", Age: 28, Gender: "Male" },
        { UserID: 3, Name: "Eylül Akpınar", Email: "eylül@example.com", PhoneNumber: "5554567890", RegistrationDate: "2026-02-05", Age: 22, Gender: "Female" },
        { UserID: 4, Name: "İrem Aköz", Email: "irem@example.com", PhoneNumber: "5557890123", RegistrationDate: "2026-02-20", Age: 26, Gender: "Female" }
    ],
    Profiles: [
        { ProfileID: 1001, UserID: 1, Biography: "I love coding and quiet spaces.", Occupation: "Student", CleanlinessLevel: 4, SleepSchedule: "Regular" },
        { ProfileID: 1002, UserID: 2, Biography: "IT professional. Early bird.", Occupation: "Engineer", CleanlinessLevel: 5, SleepSchedule: "Early Bird" },
        { ProfileID: 1003, UserID: 3, Biography: "Art student. Night owl but very respectful.", Occupation: "Student", CleanlinessLevel: 3, SleepSchedule: "Night Owl" },
        { ProfileID: 1004, UserID: 4, Biography: "Medical resident. Rarely at home.", Occupation: "Doctor", CleanlinessLevel: 5, SleepSchedule: "Irregular" }
    ],
    Listings: [
        { ListingID: 101, UserID: 1, CategoryID: 1, Title: "Sunny Room near Campus", Description: "Great for students, just a 5-minute walk to the main university campus. Fast Wi-Fi and utilities included.", City: "Istanbul", Address: "Besiktas, Istanbul", Status: "Open", DatePosted: "2026-03-20" },
        { ListingID: 102, UserID: 2, CategoryID: 2, Title: "Modern Room in Shared Flat", Description: "Looking for a neat professional roommate. The flat is newly renovated and has a large balcony with sea view.", City: "Izmir", Address: "Alsancak, Izmir", Status: "Open", DatePosted: "2026-03-21" },
        { ListingID: 103, UserID: 3, CategoryID: 1, Title: "Budget Room in Kadikoy", Description: "Small but cozy room for rent in a historic building. Perfect for students on a tight budget.", City: "Istanbul", Address: "Kadikoy, Istanbul", Status: "Open", DatePosted: "2026-03-22" },
        { ListingID: 104, UserID: 4, CategoryID: 3, Title: "Large En-suite Room", Description: "Spacious master bedroom with private bathroom and walk-in closet in a luxury residential complex.", City: "Ankara", Address: "Cankaya, Ankara", Status: "Open", DatePosted: "2026-03-23" },
        { ListingID: 105, UserID: 1, CategoryID: 2, Title: "Penthouse Shared Room", Description: "Amazing city views from the top floor. Shared living room is huge and we have a projector for movie nights.", City: "Istanbul", Address: "Sisli, Istanbul", Status: "Open", DatePosted: "2026-03-24" }
    ],
    Rooms: [
        { RoomID: 201, ListingID: 101, RoomNumber: 1, Size: 15, Furnished: true, MonthlyRent: 8500 },
        { RoomID: 202, ListingID: 102, RoomNumber: 2, Size: 20, Furnished: true, MonthlyRent: 14000 },
        { RoomID: 203, ListingID: 103, RoomNumber: 1, Size: 12, Furnished: false, MonthlyRent: 6500 },
        { RoomID: 204, ListingID: 104, RoomNumber: 1, Size: 25, Furnished: true, MonthlyRent: 16000 },
        { RoomID: 205, ListingID: 105, RoomNumber: 3, Size: 18, Furnished: true, MonthlyRent: 12500 }
    ],
    Applications: [
        { ApplicationID: 301, UserID: 2, RoomID: 201, ApplicationDate: "2026-03-21", Status: "Pending" },
        { ApplicationID: 302, UserID: 3, RoomID: 201, ApplicationDate: "2026-03-22", Status: "Accepted" },
        { ApplicationID: 303, UserID: 1, RoomID: 202, ApplicationDate: "2026-03-23", Status: "Pending" }
    ],
    Payments: [
        { PaymentID: 401, ApplicationID: 302, Amount: 8500, PaymentDate: "2026-03-23" }
    ],
    Favorites: [
        { FavoriteID: 501, UserID: 2, ListingID: 102, DateSaved: "2026-04-01" }
    ],
    Preferences: [
        { PreferenceID: 2001, ListingID: 101, SmokingAllowed: false, PetAllowed: true, GenderPreference: "Any", AgeRange: "18-25", OtherNotes: "Looking for friendly vibes" },
        { PreferenceID: 2002, ListingID: 102, SmokingAllowed: false, PetAllowed: false, GenderPreference: "Male", AgeRange: "26-35", OtherNotes: "Professional only" },
        { PreferenceID: 2003, ListingID: 103, SmokingAllowed: false, PetAllowed: false, GenderPreference: "Female", AgeRange: "18-25", OtherNotes: "Quiet is a must" },
        { PreferenceID: 2004, ListingID: 104, SmokingAllowed: true, PetAllowed: false, GenderPreference: "Female", AgeRange: "26-35", OtherNotes: "" },
        { PreferenceID: 2005, ListingID: 105, SmokingAllowed: true, PetAllowed: true, GenderPreference: "Any", AgeRange: "Any", OtherNotes: "Open minded" }
    ],
    Messages: [
        { MessageID: 601, SenderUserID: 2, ReceiverUserID: 1, Content: "Hey, is the room still available?", Timestamp: "2026-03-21 14:00" },
        { MessageID: 602, SenderUserID: 1, ReceiverUserID: 2, Content: "Yes, it is! When can you view it?", Timestamp: "2026-03-21 15:30" }
    ]
};

let DB;
try {
    const savedDB = localStorage.getItem('HomiefyDB');
    if (savedDB) {
        DB = JSON.parse(savedDB);
        // Schema migrations
        if (!DB.Profiles) DB.Profiles = DEFAULT_DB.Profiles;
        if (!DB.Payments) DB.Payments = DEFAULT_DB.Payments;
        if (!DB.Messages) DB.Messages = DEFAULT_DB.Messages;
        localStorage.setItem('HomiefyDB', JSON.stringify(DB));
    } else {
        DB = DEFAULT_DB;
        localStorage.setItem('HomiefyDB', JSON.stringify(DB));
    }
} catch (e) {
    DB = DEFAULT_DB;
}

function saveDB() {
    try {
        localStorage.setItem('HomiefyDB', JSON.stringify(DB));
    } catch(e) {}
}

window.toggleFavorite = function(listingId) {
    if (!activeUserId) {
        window.location.href = 'login.html';
        return;
    }
    if (!DB.Favorites) DB.Favorites = [];
    const index = DB.Favorites.findIndex(f => f.UserID === activeUserId && f.ListingID === listingId);
    
    if (index > -1) {
        DB.Favorites.splice(index, 1);
    } else {
        DB.Favorites.push({ FavoriteID: Date.now(), UserID: activeUserId, ListingID: listingId, DateSaved: new Date().toISOString().split('T')[0] });
    }
    
    saveDB();
    
    if (document.getElementById('listingsGrid')) renderListings(document.getElementById('citySearch') ? document.getElementById('citySearch').value : "");
    if (window.renderFavorites) window.renderFavorites();
};

window.applyToListing = function(listingId) {
    if (!activeUserId) {
        window.location.href = 'login.html';
        return;
    }
    if (!DB.Applications) DB.Applications = [];
    const room = DB.Rooms.find(r => r.ListingID === listingId);
    if (!room) {
        alert("This listing has no rooms available.");
        return;
    }
    const alreadyApplied = DB.Applications.some(a => a.UserID === activeUserId && a.RoomID === room.RoomID);
    
    if (alreadyApplied) {
        alert("You have already applied to this listing!");
        return;
    }
    
    DB.Applications.push({
        ApplicationID: Date.now(),
        UserID: activeUserId,
        RoomID: room.RoomID,
        ApplicationDate: new Date().toISOString().split('T')[0],
        Status: "Pending"
    });
    
    saveDB();
    alert("Application sent successfully!");
};

let activeUserId = null; // No default user
try {
    const savedUser = localStorage.getItem('activeUserId');
    if (savedUser) activeUserId = parseInt(savedUser);
} catch(e) {}

if (window.location.pathname.endsWith('login.html')) {
    localStorage.removeItem('activeUserId');
    activeUserId = null;
} else if (!activeUserId && 
    (window.location.pathname.endsWith('profile.html') || 
     window.location.pathname.endsWith('favorites.html') || 
     window.location.pathname.endsWith('my-listings.html') || 
     window.location.pathname.endsWith('messages.html'))) {
    window.location.href = 'login.html';
}

// --- CORE QUERIES AS REQUIRED ---

function getListingsCountByCategory() {
    const counts = {};

    DB.Listings.forEach(listing => {
        counts[listing.CategoryID] = (counts[listing.CategoryID] || 0) + 1;
    });

    return DB.Categories.map(cat => ({
        name: cat.CategoryName,
        count: counts[cat.CategoryID] || 0
    })).sort((a, b) => b.count - a.count);
}

function getAveragePricesByCity() {
    const totals = {};
    const counts = {};

    DB.Listings.forEach(listing => {
        const room = DB.Rooms.find(r => r.ListingID === listing.ListingID);
        if (room) {
            totals[listing.City] = (totals[listing.City] || 0) + room.MonthlyRent;
            counts[listing.City] = (counts[listing.City] || 0) + 1;
        }
    });

    return Object.keys(totals).map(city => ({
        city: city,
        averagePrice: Math.round(totals[city] / counts[city])
    })).sort((a, b) => b.averagePrice - a.averagePrice);
}

function getFilteredListings(cityQuery = "") {
    let matchedListings = DB.Listings;

    if (cityQuery && cityQuery.trim() !== '') {
        const queryTerm = cityQuery.toLowerCase().trim();
        matchedListings = DB.Listings.filter(l => l.City.toLowerCase().includes(queryTerm));
    }

    // Apply main feed filters if elements exist
    const catFilter = document.getElementById('filterCategory');
    const rentFilter = document.getElementById('filterRent');
    const matchFilter = document.getElementById('filterMatchOnly');
    const petsFilter = document.getElementById('filterPets');
    const smokingFilter = document.getElementById('filterSmoking');
    const activeUser = DB.Users.find(u => u.UserID === activeUserId);
    
    // Process Advanced Filters
    if (catFilter && catFilter.value !== 'All') {
        matchedListings = matchedListings.filter(l => l.CategoryID === parseInt(catFilter.value));
    }
    
    // We map early to get Rent for filtering
    let processedListings = matchedListings.map(listing => {
        const room = DB.Rooms.find(r => r.ListingID === listing.ListingID);
        const category = DB.Categories.find(c => c.CategoryID === listing.CategoryID);
        
        return {
            ...listing,
            MonthlyRent: room ? room.MonthlyRent : 0,
            Furnished: room ? room.Furnished : false,
            CategoryName: category ? category.CategoryName : "Undefined"
        };
    });

    if (rentFilter && rentFilter.value.trim() !== '') {
        const maxRent = parseInt(rentFilter.value);
        processedListings = processedListings.filter(l => l.MonthlyRent <= maxRent);
    }
    
    if (petsFilter && petsFilter.checked) {
        processedListings = processedListings.filter(l => {
            const pref = DB.Preferences.find(p => p.ListingID === l.ListingID);
            return pref && pref.PetAllowed;
        });
    }

    if (smokingFilter && smokingFilter.checked) {
        processedListings = processedListings.filter(l => {
            const pref = DB.Preferences.find(p => p.ListingID === l.ListingID);
            return pref && pref.SmokingAllowed;
        });
    }

    if (matchFilter && matchFilter.checked && activeUser && DB.Preferences) {
        processedListings = processedListings.filter(l => {
            const pref = DB.Preferences.find(p => p.ListingID === l.ListingID);
            if (!pref) return false;
            let isMatch = true;
            if (pref.GenderPreference !== "Any" && pref.GenderPreference !== activeUser.Gender) isMatch = false;
            if (pref.AgeRange !== "Any" && activeUser.Age) {
                if (pref.AgeRange === "18-25" && (activeUser.Age < 18 || activeUser.Age > 25)) isMatch = false;
                if (pref.AgeRange === "26-35" && (activeUser.Age < 26 || activeUser.Age > 35)) isMatch = false;
                if (pref.AgeRange === "35+" && activeUser.Age <= 35) isMatch = false;
            }
            return isMatch;
        });
    }

    return processedListings;
}

function getApplicationsForListing(listingId) {
    const room = DB.Rooms.find(r => r.ListingID === listingId);
    if (!room) return [];
    
    return DB.Applications
        .filter(app => app.RoomID === room.RoomID)
        .map(app => {
            const user = DB.Users.find(u => u.UserID === app.UserID);
            return {
                ...app,
                ApplicantName: user ? user.Name : "Deleted User",
                ApplicantEmail: user ? user.Email : ""
            };
        });
}


// --- DOM MANIPULATION & RENDERING ---

function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(amount);
}

function renderStats() {
    const catContainer = document.getElementById('categoryStats');
    if (catContainer) {
        const categoriesStatsHTML = getListingsCountByCategory().map(stat => `
            <div class="stat-item">
                <span>${stat.name}</span>
                <strong>${stat.count} Listings</strong>
            </div>
        `).join('');
        catContainer.innerHTML = categoriesStatsHTML;
    }

    const priceContainer = document.getElementById('priceStats');
    if (priceContainer) {
        const priceStatsHTML = getAveragePricesByCity().map(stat => `
            <div class="stat-item">
                <span>${stat.city}</span>
                <strong>₺${formatCurrency(stat.averagePrice)} <span style="font-size:0.8rem; font-weight:normal; opacity: 0.7;">Avg/mo</span></strong>
            </div>
        `).join('');
        priceContainer.innerHTML = priceStatsHTML;
    }
}

function renderListings(cityFilter = "") {
    const listings = getFilteredListings(cityFilter);
    const container = document.getElementById('listingsGrid');
    const countEl = document.getElementById('listingsCount');

    if (!container) return; // Not on home page
    if (countEl) countEl.innerText = `${listings.length} valid listings found`;

    if (listings.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; background: var(--card-bg); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
                <ion-icon name="sad-outline" style="font-size: 4rem; color: var(--text-muted); margin-bottom: 1rem;"></ion-icon>
                <h3 style="color: var(--text-primary); font-size: 1.5rem; margin-bottom: 0.5rem;">No rooms found</h3>
                <p style="color: var(--text-muted);">Try searching for another city like Istanbul, Izmir, or Ankara.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = listings.map((l, index) => {
        const delayClass = `delay-${(index % 3) + 1}`;
        const isFav = DB.Favorites && DB.Favorites.some(f => f.UserID === activeUserId && f.ListingID === l.ListingID);
        const heartColor = isFav ? 'var(--accent)' : 'var(--text-muted)';
        const heartType = isFav ? 'heart' : 'heart-outline';
        
        let matchBadge = '';
        const matchFilter = document.getElementById('filterMatchOnly');
        if (matchFilter && matchFilter.checked && activeUserId && DB.Preferences) {
            const pref = DB.Preferences.find(p => p.ListingID === l.ListingID);
            const activeUser = DB.Users.find(u => u.UserID === activeUserId);
            if (pref && activeUser) {
                let isMatch = true;
                if (pref.GenderPreference !== "Any" && pref.GenderPreference !== activeUser.Gender) isMatch = false;
                if (pref.AgeRange !== "Any" && activeUser.Age) {
                    if (pref.AgeRange === "18-25" && (activeUser.Age < 18 || activeUser.Age > 25)) isMatch = false;
                    if (pref.AgeRange === "26-35" && (activeUser.Age < 26 || activeUser.Age > 35)) isMatch = false;
                    if (pref.AgeRange === "35+" && activeUser.Age <= 35) isMatch = false;
                }
                if (isMatch) {
                    matchBadge = `<div style="position:absolute; top: -10px; left: -10px; background: var(--accent); color: #0F172A; padding: 0.3rem 0.6rem; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 0.2rem; transform: rotate(-5deg); box-shadow: 0 4px 10px rgba(228,255,0,0.3); z-index: 10;"><ion-icon name="flash"></ion-icon> Match!</div>`;
                }
            }
        }
        
        return `
        <div class="listing-card reveal ${delayClass}" data-id="${l.ListingID}" style="position: relative;">
            ${matchBadge}
            <span class="category-badge">${l.CategoryName}</span>
            <div style="position: absolute; top: 1.5rem; right: 1.5rem; font-size: 1.5rem; color: ${heartColor}; cursor: pointer; transition: color 0.2s; z-index: 5;" onclick="toggleFavorite(${l.ListingID})">
                <ion-icon name="${heartType}"></ion-icon>
            </div>
            <div style="padding-top: 1.2rem; cursor: pointer;" onclick="openListingDetails(${l.ListingID})">
                <h3 style="padding-right: 3rem;">${l.Title}</h3>
                <div class="card-location">
                    <ion-icon name="location"></ion-icon> ${l.City}
                </div>
                <p>${l.Description.length > 80 ? l.Description.substring(0, 80) + '...' : l.Description}</p>
                <div style="margin-top:0.8rem; font-size:0.85rem; font-weight:600; color: var(--accent);"><ion-icon name="eye-outline" style="vertical-align:-2px; padding-right:2px;"></ion-icon> View matches & details</div>
            </div>
            
            <div class="card-foot" style="position: relative; z-index: 5;">
                <div class="card-price">
                    ₺${formatCurrency(l.MonthlyRent)}<span class="month">/mo</span>
                </div>
                <button class="btn-primary" style="padding: 0.6rem 1rem;" onclick="applyToListing(${l.ListingID})">
                    <span class="btn-text">Apply</span>
                </button>
            </div>
        </div>
    `;
    }).join('');

    // Attach IntersectionObserver to newly generated cards
    container.querySelectorAll('.listing-card').forEach(card => {
        if (window.globalScrollObserver) {
            window.globalScrollObserver.observe(card);
        }
    });
}

function setupModal() {
    const modal = document.getElementById('applicationModal');
    const closeBtn = document.getElementById('closeModal');

    if (!modal || !closeBtn) return;

    closeBtn.onclick = () => {
        modal.classList.remove('visible');
    };

    window.onclick = (e) => {
        if (e.target == modal) {
            modal.classList.remove('visible');
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('visible')) {
            modal.classList.remove('visible');
        }
    });
}

window.openListingDetails = function(listingId) {
    const modal = document.getElementById('listingDetailModal');
    if (!modal) return;
    
    const listing = DB.Listings.find(l => l.ListingID === listingId);
    const room = DB.Rooms.find(r => r.ListingID === listingId);
    const hostUser = DB.Users.find(u => u.UserID === listing.UserID);
    const hostProfile = DB.Profiles ? DB.Profiles.find(p => p.UserID === listing.UserID) : null;
    const host = { ...hostUser, ...(hostProfile || {}) };
    const category = DB.Categories.find(c => c.CategoryID === listing.CategoryID);
    
    // Listing -> Preference is 1:N, we pick the first one for display
    const prefs = (DB.Preferences || []).find(p => p.ListingID === listingId) || { SmokingAllowed: false, PetAllowed: false, GenderPreference: 'Any', AgeRange: 'Any' };
    
    if (!listing || !hostUser) return;

    // Room Info
    document.getElementById('detailCategory').innerText = category ? category.CategoryName : 'General';
    document.getElementById('detailTitle').innerText = listing.Title;
    document.getElementById('detailLocation').innerHTML = `<ion-icon name="location"></ion-icon> ${listing.City}`;
    document.getElementById('detailPrice').innerHTML = `₺${formatCurrency(room ? room.MonthlyRent : 0)}<span class="month" style="font-size: 0.9rem; font-weight: 500; opacity: 0.7;">/mo</span>`;
    document.getElementById('detailDesc').innerText = listing.Description;
    document.getElementById('detailSize').innerHTML = `<ion-icon name="expand-outline"></ion-icon> <span>${room ? room.Size : 0} m²</span>`;
    document.getElementById('detailFurnished').innerHTML = `<ion-icon name="bed-outline"></ion-icon> <span>${(room && room.Furnished) ? 'Furnished' : 'Unfurnished'}</span>`;
    
    // Host Info
    document.getElementById('detailHostAvatar').src = "https://api.dicebear.com/7.x/notionists/svg?seed=" + (host.Name || "").replace(/\s+/g,'');
    document.getElementById('detailHostName').innerText = host.Name;
    document.getElementById('detailHostBio').innerText = host.Biography || "No bio available.";
    document.getElementById('detailHostAgeGender').innerText = `${host.Age || 24} | ${host.Gender || 'Other'}`;
    document.getElementById('detailHostJob').innerText = host.Occupation || "Student";
    document.getElementById('detailHostCleanliness').innerText = `Cleanliness: ${host.CleanlinessLevel || 3}/5`;
    
    // Preferences Grid
    const prefGrid = document.getElementById('detailPreferencesGrid');
    prefGrid.innerHTML = `
        <div style="background: var(--bg-color); padding: 0.8rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.5rem; border: 1px solid var(--border-color);">
            <ion-icon name="${prefs.SmokingAllowed ? 'checkmark-circle' : 'close-circle'}" style="color: ${prefs.SmokingAllowed ? 'var(--accent)' : 'var(--text-muted)'}; font-size: 1.2rem;"></ion-icon>
            <span style="font-size: 0.9rem; font-weight: 500;">Smoking: ${prefs.SmokingAllowed ? 'Allowed' : 'No'}</span>
        </div>
        <div style="background: var(--bg-color); padding: 0.8rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.5rem; border: 1px solid var(--border-color);">
            <ion-icon name="${prefs.PetAllowed ? 'checkmark-circle' : 'close-circle'}" style="color: ${prefs.PetAllowed ? 'var(--accent)' : 'var(--text-muted)'}; font-size: 1.2rem;"></ion-icon>
            <span style="font-size: 0.9rem; font-weight: 500;">Pets: ${prefs.PetAllowed ? 'Allowed' : 'No'}</span>
        </div>
        <div style="background: var(--bg-color); padding: 0.8rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.5rem; border: 1px solid var(--border-color);">
            <ion-icon name="male-female-outline" style="color: var(--text-primary); font-size: 1.2rem;"></ion-icon>
            <span style="font-size: 0.9rem; font-weight: 500;">Gender: ${prefs.GenderPreference}</span>
        </div>
        <div style="background: var(--bg-color); padding: 0.8rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.5rem; border: 1px solid var(--border-color);">
            <ion-icon name="calendar-outline" style="color: var(--text-primary); font-size: 1.2rem;"></ion-icon>
            <span style="font-size: 0.9rem; font-weight: 500;">Age: ${prefs.AgeRange}</span>
        </div>
    `;
    
    // Setup Apply Button
    const applyBtn = document.getElementById('detailApplyBtn');
    applyBtn.onclick = () => { applyToListing(listingId); modal.classList.remove('visible'); };
    
    modal.classList.add('visible');
};

window.openApplicationsModal = function (listingId) {
    const apps = getApplicationsForListing(listingId);
    const container = document.getElementById('applicationsContainer');
    const title = document.getElementById('modalTitle');
    const modal = document.getElementById('applicationModal');

    const listing = DB.Listings.find(l => l.ListingID === listingId);
    title.innerHTML = `Applications: <span style="font-weight: 800;">${listing.Title}</span>`;

    if (apps.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem 0;">
                <ion-icon name="mail-open-outline" style="font-size: 3rem; color: var(--text-muted); opacity: 0.5;"></ion-icon>
                <p style="color: var(--text-muted); margin-top: 1rem;">No applications received yet.</p>
            </div>
        `;
    } else {
        container.innerHTML = apps.map(app => `
            <div class="app-item">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <strong>${app.ApplicantName}</strong>
                        <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.2rem;">${app.ApplicantEmail}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.6rem;">
                            <ion-icon name="calendar-outline" style="vertical-align:-2px; margin-right:4px;"></ion-icon> ${app.ApplicationDate}
                        </div>
                    </div>
                    <span class="status-badge status-${app.Status.toLowerCase()}">${app.Status}</span>
                </div>
            </div>
        `).join('');
    }

    modal.classList.add('visible');
};

function setupThemeSwitch() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme on load
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    themeBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

function setupScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // trigger animation only once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return observer;
}

window.renderFavorites = function() {
    const favGrid = document.getElementById('favoritesGrid');
    const favCount = document.getElementById('favoritesCount');
    if (!favGrid) return;
    
    if (!DB.Favorites || DB.Favorites.length === 0) {
        favGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; background: var(--card-bg); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
                <ion-icon name="heart-dislike-outline" style="font-size: 4rem; color: var(--text-muted); margin-bottom: 1rem;"></ion-icon>
                <h3 style="color: var(--text-primary); font-size: 1.5rem; margin-bottom: 0.5rem;">No favorites yet</h3>
                <p style="color: var(--text-muted);">Explore listings and click the heart icon to save them here.</p>
            </div>
        `;
        if (favCount) favCount.innerText = '0 saved';
        return;
    }
    
    const favListingIndicies = DB.Favorites.filter(f => f.UserID === activeUserId).map(f => f.ListingID);
    const listings = DB.Listings.filter(l => favListingIndicies.includes(l.ListingID));
    
    if (favCount) favCount.innerText = `${listings.length} saved`;
    
    favGrid.innerHTML = listings.map((l, index) => {
        const delayClass = `delay-${(index % 3) + 1}`;
        const room = DB.Rooms.find(r => r.ListingID === l.ListingID);
        const category = DB.Categories.find(c => c.CategoryID === l.CategoryID);
        const catName = category ? category.CategoryName : 'General';
        const rent = room ? room.MonthlyRent : 0;
        
        return `
        <div class="listing-card reveal ${delayClass}">
            <span class="category-badge">${catName}</span>
            <div style="position: absolute; top: 1.5rem; right: 1.5rem; font-size: 1.5rem; color: var(--accent); cursor: pointer; transition: color 0.2s;" onclick="toggleFavorite(${l.ListingID})">
                <ion-icon name="heart"></ion-icon>
            </div>
            <div style="padding-top: 1.2rem;">
                <h3 style="padding-right: 3rem;">${l.Title}</h3>
                <div class="card-location">
                    <ion-icon name="location"></ion-icon> ${l.City}
                </div>
                <p>${l.Description.length > 80 ? l.Description.substring(0, 80) + '...' : l.Description}</p>
            </div>
            
            <div class="card-foot">
                <div class="card-price">
                    ₺${formatCurrency(rent)}<span class="month">/mo</span>
                </div>
                <!-- Applying logic wrapper -->
                <button class="view-apps-btn" onclick="applyToListing(${l.ListingID})">
                    <ion-icon name="paper-plane-outline"></ion-icon> Apply
                </button>
            </div>
        </div>
        `;
    }).join('');
    
    favGrid.querySelectorAll('.listing-card').forEach(card => {
        if (window.globalScrollObserver) window.globalScrollObserver.observe(card);
    });
};

window.renderUserProfile = function() {
    if (!activeUserId) return;
    const userDisplays = document.querySelectorAll('.user-profile span');
    const userUserImages = document.querySelectorAll('.user-profile img');
    const currentUser = DB.Users.find(u => u.UserID === activeUserId);
    const currentProfile = DB.Profiles ? DB.Profiles.find(p => p.UserID === activeUserId) : null;
    const combinedUser = { ...currentUser, ...(currentProfile || {}) };
    if (!currentUser) return;
    
    userDisplays.forEach(el => { el.innerText = combinedUser.Name; });
    userUserImages.forEach(el => { el.src = "https://api.dicebear.com/7.x/notionists/svg?seed=" + combinedUser.Name.replace(/\s+/g,''); });
    
    // Inject into profile.html inputs
    const profileName = document.getElementById('profileName');
    if (profileName) profileName.innerText = combinedUser.Name;
    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) profileEmail.innerText = combinedUser.Email;
    
    const bioInput = document.getElementById('prefBio');
    if (bioInput && combinedUser.Biography) bioInput.value = combinedUser.Biography;
    
    const occInput = document.getElementById('prefOcc');
    if (occInput && combinedUser.Occupation) occInput.value = combinedUser.Occupation;
    
    const ageGenderInput = document.getElementById('profileAgeGender');
    if (ageGenderInput) ageGenderInput.innerText = `Age: ${combinedUser.Age || 24} | ${combinedUser.Gender || 'Other'}`;
};

window.renderMyApplications = function() {
    const container = document.getElementById('myApplicationsGrid');
    const myCount = document.getElementById('myApplicationsCount');
    if (!container) return;
    
    if (!DB.Applications) DB.Applications = [];
    const myApps = DB.Applications.filter(a => a.UserID === activeUserId);
    
    if (myCount) myCount.innerText = `${myApps.length} application${myApps.length !== 1 ? 's' : ''}`;
    
    if (myApps.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; background: var(--card-bg); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
                <ion-icon name="document-text-outline" style="font-size: 4rem; color: var(--text-muted); margin-bottom: 1rem;"></ion-icon>
                <h3 style="color: var(--text-primary); font-size: 1.5rem; margin-bottom: 0.5rem;">No applications yet</h3>
                <p style="color: var(--text-muted);">You haven't applied to any rooms yet. Explore listings to find your new home.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = myApps.map((app, index) => {
        const room = DB.Rooms.find(r => r.RoomID === app.RoomID);
        const l = room ? DB.Listings.find(list => list.ListingID === room.ListingID) : null;
        if (!l) return '';
        
        const delayClass = `delay-${(index % 3) + 1}`;
        const category = DB.Categories.find(c => c.CategoryID === l.CategoryID);
        const catName = category ? category.CategoryName : 'General';
        const rent = room ? room.MonthlyRent : 0;
        
        return `
        <div class="listing-card reveal ${delayClass}">
            <span class="category-badge">${catName}</span>
            <div style="position: absolute; top: 1.5rem; right: 1.5rem;">
                <span class="status-badge status-${app.Status.toLowerCase()}" style="font-size: 0.75rem;">${app.Status}</span>
            </div>
            <div style="padding-top: 1.2rem;">
                <h3 style="padding-right: 5rem;">${l.Title}</h3>
                <div class="card-location">
                    <ion-icon name="location"></ion-icon> ${l.City}
                </div>
                <p>${l.Description.length > 80 ? l.Description.substring(0, 80) + '...' : l.Description}</p>
            </div>
            
            <div class="card-foot" style="margin-top: 1rem;">
                <div class="card-price">
                    ₺${formatCurrency(rent)}<span class="month">/mo</span>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Applied: ${app.ApplicationDate}</div>
            </div>
        </div>
        `;
    }).join('');
    
    container.querySelectorAll('.listing-card').forEach(card => {
        if (window.globalScrollObserver) window.globalScrollObserver.observe(card);
    });
};

window.renderMyActiveListings = function() {
    const container = document.getElementById('myActiveListingsGrid');
    const myCount = document.getElementById('myActiveListingsCount');
    if (!container) return;
    
    const listings = DB.Listings.filter(l => l.UserID === activeUserId);
    if (myCount) myCount.innerText = `${listings.length} active room${listings.length !== 1 ? 's' : ''}`;
    
    if (listings.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; border: 1px dashed var(--border-color); border-radius: var(--radius-sm); color: var(--text-muted);">
                You haven't posted any listings yet.
            </div>
        `;
        return;
    }
    
    container.innerHTML = listings.map((l, index) => {
        const delayClass = `delay-${(index % 3) + 1}`;
        const room = DB.Rooms.find(r => r.ListingID === l.ListingID);
        const category = DB.Categories.find(c => c.CategoryID === l.CategoryID);
        const catName = category ? category.CategoryName : 'General';
        const rent = room ? room.MonthlyRent : 0;
        
        return `
        <div class="listing-card reveal ${delayClass}" style="position:relative;">
            <span class="category-badge">${catName}</span>
            <div style="position: absolute; top: 1.5rem; right: 1.5rem;">
                <span class="status-badge status-accepted" style="font-size: 0.75rem;">Open</span>
            </div>
            <div style="padding-top: 1.2rem;">
                <h3 style="padding-right: 5rem;">${l.Title}</h3>
                <div class="card-location">
                    <ion-icon name="location"></ion-icon> ${l.City}
                </div>
                <p>${l.Description.length > 80 ? l.Description.substring(0, 80) + '...' : l.Description}</p>
            </div>
            
            <div class="card-foot" style="margin-top: 1rem; flex-direction: column; align-items: stretch; gap: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="card-price">
                        ₺${formatCurrency(rent)}<span class="month">/mo</span>
                    </div>
                </div>
                <button onclick="openApplicationsModal(${l.ListingID})" class="view-apps-btn" style="width: 100%; justify-content: center; background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-primary);">
                    <ion-icon name="people-outline"></ion-icon> View Apps
                </button>
            </div>
        </div>
        `;
    }).join('');
    
    container.querySelectorAll('.listing-card').forEach(card => {
        if (window.globalScrollObserver) window.globalScrollObserver.observe(card);
    });
};

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    window.globalScrollObserver = setupScrollReveal();
    setupThemeSwitch();
    
    if (!activeUserId) {
        // Adjust UI for guest mode
        const profileLinks = document.querySelectorAll('a[href="profile.html"].user-profile');
        profileLinks.forEach(link => link.style.display = 'none');
        
        const logoutBtns = document.querySelectorAll('a[href="login.html"].view-apps-btn');
        logoutBtns.forEach(btn => {
            if(btn.querySelector('ion-icon[name="log-out-outline"]')) {
                btn.innerHTML = 'Sign In';
                btn.style.padding = '0.5rem 1rem';
                btn.style.borderRadius = 'var(--radius-sm)';
                btn.style.background = 'var(--accent)';
                btn.style.color = 'var(--bg-color)';
                btn.style.border = 'none';
            }
        });
        
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') !== 'index.html' && !link.classList.contains('active')) {
                link.style.display = 'none';
            }
        });
    } else {
        renderUserProfile();
    }
    
    renderStats();
    renderListings();
    if (activeUserId) {
        renderFavorites();
        renderMyApplications();
        if (window.renderMyActiveListings) renderMyActiveListings();
    }
    setupModal();

    // Events for Search / Filtering
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('citySearch');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            renderListings(searchInput.value);
        });

        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                renderListings(searchInput.value);
            }
        });
    }
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
             renderListings(searchInput ? searchInput.value : "");
        });
    }
    
    // Profile Update Handling
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.onsubmit = (e) => {
            e.preventDefault();
            const bio = document.getElementById('prefBio')?.value;
            const occ = document.getElementById('prefOcc')?.value;
            const userIndex = DB.Users.findIndex(u => u.UserID === activeUserId);
            if (userIndex > -1) {
                if (!DB.Profiles) DB.Profiles = [];
                let profileIndex = DB.Profiles.findIndex(p => p.UserID === activeUserId);
                if (profileIndex === -1) {
                    DB.Profiles.push({ ProfileID: Date.now(), UserID: activeUserId });
                    profileIndex = DB.Profiles.length - 1;
                }
                DB.Profiles[profileIndex].Biography = bio;
                DB.Profiles[profileIndex].Occupation = occ;
                saveDB();
                alert("Profile preferences saved!");
                renderUserProfile();
            }
        };
    }
    
    // Listing Creation Handling
    const createListingForm = document.getElementById('createListingForm');
    if (createListingForm) {
        createListingForm.onsubmit = (e) => {
            e.preventDefault();
            const title = document.getElementById('listTitle').value;
            const rent = parseInt(document.getElementById('listRent').value);
            const city = document.getElementById('listCity').value;
            const desc = document.getElementById('listDesc').value;
            
            const newListingId = Date.now() + Math.floor(Math.random() * 1000);
            
            DB.Listings.push({
                ListingID: newListingId,
                UserID: activeUserId,
                CategoryID: 2, 
                Title: title,
                Description: desc,
                City: city,
                Address: city + ", Turkey", 
                Status: "Open",
                DatePosted: new Date().toISOString().split('T')[0]
            });
            
            if (!DB.Rooms) DB.Rooms = [];
            DB.Rooms.push({
                RoomID: newListingId + 1000,
                ListingID: newListingId,
                RoomNumber: 1,
                Size: 15,
                Furnished: true,
                MonthlyRent: rent
            });
            
            // Save preferences
            if (!DB.Preferences) DB.Preferences = [];
            DB.Preferences.push({
                PreferenceID: newListingId + 2000,
                ListingID: newListingId,
                SmokingAllowed: document.getElementById('prefSmoking')?.checked || false,
                PetAllowed: document.getElementById('prefPets')?.checked || false,
                GenderPreference: document.getElementById('prefGender')?.value || 'Any',
                AgeRange: document.getElementById('prefAge')?.value || 'Any',
                OtherNotes: ""
            });
            
            saveDB();
            createListingForm.reset();
            alert("Listing published successfully!");
            if (window.renderMyActiveListings) renderMyActiveListings();
        };
    }
    
    // Messages Handling
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendMsgBtn = document.getElementById('sendMsgBtn');

    if (chatMessages && messageInput && sendMsgBtn) {
        if (!DB.Messages) DB.Messages = [];
        
        function renderMessages() {
            chatMessages.innerHTML = '';
            DB.Messages.forEach(msg => {
                const isMine = msg.SenderUserID === activeUserId;
                const msgEl = document.createElement('div');
                msgEl.style.cssText = isMine 
                    ? "align-self: flex-end; background: var(--accent); color: #0F172A; padding: 1rem; border-radius: var(--radius-sm); max-width: 70%; margin-bottom: 0.5rem;"
                    : "align-self: flex-start; background: var(--card-bg); color: var(--text-primary); border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--radius-sm); max-width: 70%; margin-bottom: 0.5rem;";
                msgEl.innerHTML = `
                    <p style="font-size: 0.95rem;">${msg.Content}</p>
                    <span style="font-size: 0.7rem; color: rgba(0,0,0,0.5); float: ${isMine ? 'right' : 'left'}; margin-top: 0.5rem;">${msg.Timestamp}</span>
                `;
                chatMessages.appendChild(msgEl);
            });
            setTimeout(() => chatMessages.scrollTop = chatMessages.scrollHeight, 50);
        }
        
        renderMessages();

        function sendMessage() {
            const text = messageInput.value.trim();
            if (text) {
                const date = new Date();
                const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const timestamp = date.toISOString().split('T')[0] + " " + time;
                
                const msg = {
                    MessageID: Date.now(),
                    SenderUserID: activeUserId || 0,
                    ReceiverUserID: 1, // Mock receiver
                    Content: text,
                    Timestamp: timestamp
                };
                DB.Messages.push(msg);
                saveDB();
                
                renderMessages();
                messageInput.value = '';
            }
        }

        sendMsgBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // Login Handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const foundUser = DB.Users.find(u => u.Email.toLowerCase() === email.toLowerCase());
            
            if (foundUser) {
                try {
                    localStorage.setItem('activeUserId', foundUser.UserID);
                } catch(e) {}
                window.location.href = "index.html";
            } else {
                // If not found, log them in as a generic new user anyway for mock purposes
                const parsedId = Date.now();
                const newUser = {
                    UserID: parsedId,
                    Name: email.split('@')[0],
                    Email: email,
                    PhoneNumber: "",
                    RegistrationDate: new Date().toISOString().split('T')[0],
                    Age: 25,
                    Gender: "Other"
                };
                const newProfile = {
                    ProfileID: parsedId + 1,
                    UserID: parsedId,
                    Biography: "",
                    Occupation: "Student",
                    CleanlinessLevel: 3,
                    SleepSchedule: "Regular"
                };
                DB.Users.push(newUser);
                if (!DB.Profiles) DB.Profiles = [];
                DB.Profiles.push(newProfile);
                saveDB();
                try {
                    localStorage.setItem('activeUserId', newUser.UserID);
                } catch(e) {}
                window.location.href = "index.html";
            }
        };
    }
});
