using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace HomiefyC.ViewModels
{
    // =====================================================================
    // LOGIN / REGISTER
    // =====================================================================

    public class LoginViewModel
    {
        [Required(ErrorMessage = "Email zorunludur.")]
        [EmailAddress(ErrorMessage = "Gecerli bir email girin.")]
        [Display(Name = "Email Adresi")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Sifre zorunludur.")]
        [DataType(DataType.Password)]
        [Display(Name = "Sifre")]
        public string Password { get; set; }
    }

    public class RegisterViewModel
    {
        [Required(ErrorMessage = "Ad zorunludur.")]
        [StringLength(100)]
        [Display(Name = "Ad Soyad")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email zorunludur.")]
        [EmailAddress(ErrorMessage = "Gecerli bir email girin.")]
        [Display(Name = "Email Adresi")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Sifre zorunludur.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Sifre en az 6 karakter olmali.")]
        [DataType(DataType.Password)]
        [Display(Name = "Sifre")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Sifre tekrar zorunludur.")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Sifreler eslesmiyor.")]
        [Display(Name = "Sifre Tekrar")]
        public string ConfirmPassword { get; set; }

        [StringLength(15)]
        [Display(Name = "Telefon Numarasi")]
        public string PhoneNumber { get; set; }

        [Range(18, 99, ErrorMessage = "Yas 18 veya uzeri olmali.")]
        [Display(Name = "Yas")]
        public int? Age { get; set; }

        [Display(Name = "Cinsiyet")]
        public string Gender { get; set; }
    }

    // =====================================================================
    // HOME / RECENT LISTINGS
    // =====================================================================

    public class RecentListingViewModel
    {
        public int ListingID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CategoryName { get; set; }
        public decimal MonthlyRent { get; set; }
        public string RoomNumber { get; set; }
        public DateTime? CreatedAt { get; set; }
        public bool IsLoggedIn { get; set; }
    }

    // =====================================================================
    // LISTINGS / CARDS
    // =====================================================================

    public class ListingCardViewModel
    {
        public int ListingID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CategoryName { get; set; }
        public decimal MonthlyRent { get; set; }
        public bool IsFavorite { get; set; }
    }

    public class FavoriteListingViewModel : ListingCardViewModel
    {
        public DateTime? SavedAt { get; set; }
    }

    // =====================================================================
    // MESSAGES
    // =====================================================================

    public class MessageViewModel
    {
        public int MessageID { get; set; }
        public int SenderID { get; set; }
        public int ReceiverID { get; set; }
        public string SenderName { get; set; }
        public string ReceiverName { get; set; }
        public string Content { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsMe { get; set; }
    }

    public class ConversationSummaryViewModel
    {
        public int OtherUserID { get; set; }
        public string OtherUserName { get; set; }
        public string LastMessage { get; set; }
        public DateTime? LastTime { get; set; }
    }

    public class MessagesIndexViewModel
    {
        public List<ConversationSummaryViewModel> Conversations { get; set; } = new List<ConversationSummaryViewModel>();
        public List<MessageViewModel> CurrentChat { get; set; } = new List<MessageViewModel>();
        public int? ActiveConversationUserID { get; set; }
        public string ActiveConversationUserName { get; set; }
        public int ReceiverID { get; set; }
        public List<SelectListItem> AllUsers { get; set; } = new List<SelectListItem>();

        [Required(ErrorMessage = "Alici secilmeli.")]
        public int NewMessageReceiverID { get; set; }

        [Required(ErrorMessage = "Mesaj bos olamaz.")]
        [StringLength(1000)]
        public string NewMessageContent { get; set; }
    }

    // =====================================================================
    // PROFILE
    // =====================================================================

    public class ProfileViewModel
    {
        public int UserID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int? Age { get; set; }
        public string Gender { get; set; }

        // Profile ek bilgiler
        public int? ProfileID { get; set; }
        public string Biography { get; set; }
        public string Occupation { get; set; }
        public string CleanlinessLevel { get; set; }
        public string SleepSchedule { get; set; }

        public List<ListingCardViewModel> MyPublishedRooms { get; set; } = new List<ListingCardViewModel>();
    }

    // =====================================================================
    // CREATE LISTING
    // =====================================================================

    public class CreateListingViewModel
    {
        [Required]
        public int CategoryID { get; set; }

        [Required(ErrorMessage = "Baslik zorunludur.")]
        [StringLength(100)]
        public string Title { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public string RoomNumber { get; set; }
        public int? Size { get; set; }
        public bool Furnished { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Kira 0'dan buyuk olmali.")]
        public decimal MonthlyRent { get; set; }

        public bool SmokingAllowed { get; set; }
        public bool PetsAllowed { get; set; }
        public string GenderPreference { get; set; }
        public string AgeRange { get; set; }
    }
}
