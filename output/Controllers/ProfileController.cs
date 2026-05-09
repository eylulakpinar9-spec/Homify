using System.Linq;
using System.Web.Mvc;
using HomiefyC.Models;
using HomiefyC.ViewModels;

namespace HomiefyC.Controllers
{
    public class ProfileController : Controller
    {
        private HomiefyDBEntities1 db = new HomiefyDBEntities1();

        private int? GetUID() => Session["UserID"] != null ? (int?)((int)Session["UserID"]) : null;

        public ActionResult Index()
        {
            int? uid = GetUID();
            if (uid == null) return RedirectToAction("Login", "Account");

            var user = db.USERs.Include("PROFILEs").FirstOrDefault(u => u.UserID == uid);
            var profile = user?.PROFILEs.FirstOrDefault();

            var myListings = db.LISTINGs
                .Include("CATEGORY").Include("ROOMs")
                .Where(l => l.UserID == uid).ToList();

            var vm = new ProfileViewModel
            {
                UserID = user.UserID,
                Name = user.Name,
                Email = user.Email,
                Age = user.Age,
                Gender = user.Gender,
                ProfileID = profile?.ProfileID,
                Biography = profile?.Biography,
                Occupation = profile?.Occupation,
                CleanlinessLevel = profile?.CleanlinessLevel,
                SleepSchedule = profile?.SleepSchedule,
                MyPublishedRooms = myListings.Select(l => new ListingCardViewModel
                {
                    ListingID = l.ListingID,
                    Title = l.Title,
                    CategoryName = l.CATEGORY?.CategoryName ?? "General",
                    MonthlyRent = l.ROOMs.FirstOrDefault()?.MonthlyRent ?? 0
                }).ToList()
            };

            ViewBag.Categories = db.CATEGORies.ToList();
            return View(vm);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UpdateProfile(ProfileViewModel vm)
        {
            int? uid = GetUID();
            if (uid == null) return RedirectToAction("Login", "Account");

            var profile = db.PROFILEs.FirstOrDefault(p => p.UserID == uid);
            if (profile == null)
            {
                profile = new PROFILE { UserID = uid.Value };
                db.PROFILEs.Add(profile);
            }

            profile.Biography = vm.Biography;
            profile.Occupation = vm.Occupation;
            profile.CleanlinessLevel = vm.CleanlinessLevel;
            profile.SleepSchedule = vm.SleepSchedule;
            db.SaveChanges();

            TempData["Success"] = "Profile saved!";
            return RedirectToAction("Index");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult CreateListing(CreateListingViewModel vm)
        {
            int? uid = GetUID();
            if (uid == null) return RedirectToAction("Login", "Account");

            var listing = new LISTING
            {
                UserID = uid.Value,
                CategoryID = vm.CategoryID,
                Title = vm.Title,
                Description = vm.Description,
                CreatedAt = System.DateTime.Now
            };
            db.LISTINGs.Add(listing);
            db.SaveChanges();

            var room = new ROOM
            {
                ListingID = listing.ListingID,
                RoomNumber = vm.RoomNumber ?? "1",
                Size = vm.Size,
                Furnished = vm.Furnished,
                MonthlyRent = vm.MonthlyRent
            };
            db.ROOMs.Add(room);

            int? minAge = null, maxAge = null;
            if (vm.AgeRange == "18-25") { minAge = 18; maxAge = 25; }
            else if (vm.AgeRange == "26-35") { minAge = 26; maxAge = 35; }
            else if (vm.AgeRange == "35+") { minAge = 35; maxAge = 99; }

            var pref = new PREFERENCE
            {
                ListingID = listing.ListingID,
                SmokingAllowed = vm.SmokingAllowed,
                PetsAllowed = vm.PetsAllowed,
                GenderPreference = vm.GenderPreference ?? "Any",
                MinAge = minAge,
                MaxAge = maxAge
            };
            db.PREFERENCEs.Add(pref);
            db.SaveChanges();

            TempData["Success"] = "Listing published!";
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) db.Dispose();
            base.Dispose(disposing);
        }
    }
}
