"use client";

import { useState, useCallback } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validatePasswordMatch,
  validateForm,
  resetPassword,
  type ResetPasswordRequest,
} from "@/lib/reset-password";

interface FormErrors {
  email?: string;
  phone?: string;
  new_password?: string;
  confirm_password?: string;
}

export function ResetPasswordForm() {
  const [formData, setFormData] = useState<ResetPasswordRequest>({
    email: "",
    phone: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error for this field when user starts typing
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      let errorMessage: string | null = null;

      switch (name) {
        case "email":
          errorMessage = validateEmail(value);
          break;
        case "phone":
          errorMessage = validatePhone(value);
          break;
        case "new_password":
          errorMessage = validatePassword(value);
          break;
        case "confirm_password":
          errorMessage = validatePasswordMatch(formData.new_password, value);
          break;
      }

      setErrors((prev) => ({
        ...prev,
        [name]: errorMessage || undefined,
      }));
    },
    [formData.new_password],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Validate entire form
    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
      const errorMap: FormErrors = {};
      validationErrors.forEach((err) => {
        errorMap[err.field as keyof FormErrors] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(formData);

      if (result.success) {
        setSuccessMessage(result.message || "Password berhasil direset!");
        setFormData({
          email: "",
          phone: "",
          new_password: "",
          confirm_password: "",
        });
        setErrors({});
      } else {
        setErrorMessage(result.error || "Gagal mereset password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Masukkan email, nomor telepon, dan password baru Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Success Alert */}
            {successMessage && (
              <Alert
                variant="default"
                className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-50 dark:border-emerald-800"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <AlertTitle>Sukses</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contoh@email.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.email}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="089xxxxxxxx"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.phone}
                disabled={loading}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="new_password">Password Baru</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  name="new_password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  value={formData.new_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.new_password}
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-sm text-destructive">
                  {errors.new_password}
                </p>
              )}
              {formData.new_password && !errors.new_password && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  ✓ Password kuat
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm_password">Konfirmasi Password</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ketik password yang sama"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.confirm_password}
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-sm text-destructive">
                  {errors.confirm_password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
