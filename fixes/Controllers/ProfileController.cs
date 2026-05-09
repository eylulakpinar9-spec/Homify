// DOSYA YOLU: HomiefyC/Controllers/ProfileController.cs
// Mevcut ProfileController.cs ile TAMAMEN degistir
// (veya "output/Controllers/ProfileController.cs"nin yerine koy)

using System;
using System.Linq;
using System.Web.Mvc;
using HomiefyC.Models;
using HomiefyC.ViewModels;

namespace HomiefyC.Controllers
{
    public class ProfileController : Controller
    {
        private HomiefyDBEntities1 db = new HomiefyDBEntities1();

        private int? GetUID()
        {
            return Session["UserID"] != null ? (int?)((int)Session["UserID"]) : null;
        }

        // ---------------------------------------------------------------
        // GET: /Profile/Index
        // Giris yapan kullanicinin kendi profil sayfasi
        // ---------------------------------------------------------------
        public ActionResult Index()
        {
            int? uid = GetUID();
            if (uid == null) return RedirectToAction("Login", "USERs");

            try
            {
                var user = db.USERs
                    .Include("PROFILEs")
                    .FirstOrDefault(u => u.UserID == uid.Value);

                if (user == null)
                {
                    Session.Clear();
                    return RedirectToAction("Login", "USERs");
                }

                var profile = user.PROFILEs != null ? user.PROFILEs.FirstOrDefault() : null;

                var myListings = db.LISTINGs
                    .Include("CATEGORY")
                    .Include("ROOMs")
                    .Where(l => l.UserID == uid.Value)
                    .ToList();

                var vm = new ProfileViewModel
                {
                    UserID           = user.UserID,
                    Name             = user.Name,
                    Email            = user.Email,
                    Age              = user.Age,
                    Gender           = user.Gender,
                    ProfileID        = profile?.ProfileID,
                    Biography        = profile?.Biography,
                    Occupation       = profile?.Occupation,
                    CleanlinessLevel = profile?.CleanlinessLevel,
                    SleepSchedule    = profile?.SleepSchedule,
                    MyPublishedRooms = myListings.Select(l => new ListingCardViewModel
                    {
                        ListingID    = l.ListingID,
                        Title        = l.Title,
                        Description  = l.Description ?? "",
                        CategoryName = l.CATEGORY?.CategoryName ?? "Genel",
                        MonthlyRent  = l.ROOMs != null && l.ROOMs.Count > 0
                                        ? l.ROOMs.First().MonthlyRent
                                        : 0m
                    }).ToList()
                };

                ViewBag.Categories = db.CATEGORies.ToList();
                if (TempData["Success"] != null) ViewBag.Success = TempData["Success"].ToString();

                return View(vm);
            }
            catch (Exception ex)
            {
                ViewBag.Error = "Profil yuklenirken hata: " + ex.Message;
                return View(new ProfileViewModel());
            }
        }

        // ---------------------------------------------------------------
        // POST: /Profile/UpdateProfile
        // Profil bilgilerini guncelle
        // ---------------------------------------------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UpdateProfile(ProfileViewModel vm)
        {
            int? uid = GetUID();
            if (uid == null) return RedirectToAction("Login", "USERs");

            try
            {
                var profile = db.PROFILEs.FirstOrDefault(p => p.UserID == uid.Value);
                if (profile == null)
                {
                    profile = new PROFILE { UserID = uid.Value };
                    db.PROFILEs.Add(profile);
                }

                profile.Biography        = vm.Biography;
                profile.Occupation       = vm.Occupation;
                profile.CleanlinessLevel = vm.CleanlinessLevel;
                profile.SleepSchedule    = vm.SleepSchedule;
                db.SaveChanges();

                TempData["Success"] = "Profil basariyla kaydedildi!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Profil kaydedilemedi: " + ex.Message;
            }

            return RedirectToAction("Index");
        }

        // ---------------------------------------------------------------
        // POST: /Profile/CreateListing
        // Yeni ilan olustur (sadece giris yapan kullanici)
        // ---------------------------------------------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult CreateListing(CreateListingViewModel vm)
        {
            int? uid = GetUID();
            if (uid == null) return RedirectToAction("Login", "USERs");

            if (!ModelState.IsValid)
            {
                TempData["Error"] = "Lutfen tum alanlari doldurun.";
                return RedirectToAction("Index");
            }

            try
            {
                var listing = new LISTING
                {
                    UserID      = uid.Value,
                    CategoryID  = vm.CategoryID,
                    Title       = vm.Title,
                    Description = vm.Description,
                    CreatedAt   = DateTime.Now
                };
                db.LISTINGs.Add(listing);
                db.SaveChanges();

                var room = new ROOM
                {
                    ListingID   = listing.ListingID,
                    RoomNumber  = vm.RoomNumber ?? "1",
                    Size        = vm.Size,
                    Furnished   = vm.Furnished,
                    MonthlyRent = vm.MonthlyRent
                };
                db.ROOMs.Add(room);

                int? minAge = null, maxAge = null;
                if (vm.AgeRange == "18-25") { minAge = 18; maxAge = 25; }
                else if (vm.AgeRange == "26-35") { minAge = 26; maxAge = 35; }
                else if (vm.AgeRange == "35+") { minAge = 35; maxAge = 99; }

                var pref = new PREFERENCE
                {
                    ListingID        = listing.ListingID,
                    SmokingAllowed   = vm.SmokingAllowed,
                    PetsAllowed      = vm.PetsAllowed,
                    GenderPreference = vm.GenderPreference ?? "Any",
                    MinAge           = minAge,
                    MaxAge           = maxAge
                };
                db.PREFERENCEs.Add(pref);
                db.SaveChanges();

                TempData["Success"] = "İlan yayinlandi!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "İlan olusturulamadi: " + ex.Message;
            }

            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) db.Dispose();
            base.Dispose(disposing);
        }
    }
}
