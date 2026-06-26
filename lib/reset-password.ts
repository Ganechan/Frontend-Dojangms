export interface ResetPasswordRequest {
  email: string;
  phone: string;
  new_password: string;
  confirm_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): string | null {
  if (!email) return "Email diperlukan";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Format email tidak valid";
  }
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone) return "Nomor telepon diperlukan";
  // Indonesian phone numbers typically start with 62 or 0 and are 10-13 digits
  if (!/^(\+62|62|0)[0-9]{9,12}$/.test(phone.replace(/\D/g, ""))) {
    return "Format nomor telepon tidak valid (contoh: 089xxxxxxxx)";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password baru diperlukan";
  if (password.length < 8) {
    return "Password minimal 8 karakter";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password harus mengandung huruf besar (A-Z)";
  }
  if (!/[a-z]/.test(password)) {
    return "Password harus mengandung huruf kecil (a-z)";
  }
  if (!/[0-9]/.test(password)) {
    return "Password harus mengandung angka (0-9)";
  }
  return null;
}

export function validatePasswordMatch(
  password: string,
  confirmPassword: string,
): string | null {
  if (!confirmPassword) return "Konfirmasi password diperlukan";
  if (password !== confirmPassword) {
    return "Password tidak cocok";
  }
  return null;
}

export function validateForm(data: ResetPasswordRequest): ValidationError[] {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(data.email);
  if (emailError) errors.push({ field: "email", message: emailError });

  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.push({ field: "phone", message: phoneError });

  const passwordError = validatePassword(data.new_password);
  if (passwordError)
    errors.push({ field: "new_password", message: passwordError });

  const matchError = validatePasswordMatch(
    data.new_password,
    data.confirm_password,
  );
  if (matchError)
    errors.push({ field: "confirm_password", message: matchError });

  return errors;
}

export async function resetPassword(
  data: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
  try {
    const response = await fetch(
      "https://api.jokotingkir-tc.online/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          result.error ||
          result.message ||
          "Gagal mereset password. Coba lagi.",
      };
    }

    return {
      success: true,
      message:
        result.message ||
        "Password berhasil direset. Silakan login dengan password baru Anda.",
    };
  } catch (error) {
    console.error("[v0] Reset password error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan. Silakan coba lagi nanti.",
    };
  }
}
