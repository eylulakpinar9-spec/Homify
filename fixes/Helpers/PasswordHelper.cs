using System;
using System.Security.Cryptography;
using System.Text;

namespace HomiefyC.Helpers
{
    /// <summary>
    /// SHA-256 tabanli basit sifre hash yardimcisi.
    /// Production icin bcrypt / PBKDF2 kullanilmali.
    /// </summary>
    public static class PasswordHelper
    {
        /// <summary>
        /// Verilen sifreyi SHA-256 ile hashler, Base64 olarak dondurur.
        /// </summary>
        public static string Hash(string password)
        {
            if (string.IsNullOrEmpty(password))
                throw new ArgumentNullException("password");

            using (var sha = SHA256.Create())
            {
                byte[] bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }

        /// <summary>
        /// Girilen sifre ile stored hash eslesiyorsa true dondurur.
        /// </summary>
        public static bool Verify(string password, string storedHash)
        {
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(storedHash))
                return false;

            return Hash(password) == storedHash;
        }
    }
}
