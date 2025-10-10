"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

interface TwoFactorSetupProps {
  user: any;
  onSuccess?: () => void;
}

export const TwoFactorSetup = ({ user, onSuccess }: TwoFactorSetupProps) => {
  const [isEnabling, setIsEnabling] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUri, setQrCodeUri] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleEnable2FA = async () => {
    setIsEnabling(true);
    try {
      // Gerar QR code e backup codes
      const response = await authClient.twoFactor.enable({
        password: "", // BetterAuth pode requerer senha para habilitar 2FA
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to enable 2FA");
        setIsEnabling(false);
        return;
      }

      // BetterAuth retorna o QR code URI e backup codes
      if (response.data) {
        setQrCodeUri(response.data.qrCodeUri || "");
        setBackupCodes(response.data.backupCodes || []);
        setShowQRCode(true);
        toast.success("Scan the QR code with your authenticator app");
      }
    } catch (error) {
      console.error("Enable 2FA error:", error);
      toast.error("Failed to enable 2FA");
    } finally {
      setIsEnabling(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await authClient.twoFactor.verifyTotp({
        code: verificationCode,
      });

      if (response.error) {
        toast.error(response.error.message || "Invalid code");
        setIsVerifying(false);
        return;
      }

      toast.success("2FA enabled successfully!");
      setShowQRCode(false);
      setVerificationCode("");
      onSuccess?.();
    } catch (error) {
      console.error("Verify 2FA error:", error);
      toast.error("Failed to verify code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisable2FA = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to disable two-factor authentication? This will make your account less secure."
    );

    if (!confirmed) return;

    setIsDisabling(true);
    try {
      const response = await authClient.twoFactor.disable({
        password: "", // Pode requerer senha
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to disable 2FA");
        setIsDisabling(false);
        return;
      }

      toast.success("2FA disabled successfully");
      onSuccess?.();
    } catch (error) {
      console.error("Disable 2FA error:", error);
      toast.error("Failed to disable 2FA");
    } finally {
      setIsDisabling(false);
    }
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    toast.success("Backup codes copied to clipboard");
  };

  // Se 2FA já está habilitado
  if (user?.twoFactorEnabled) {
    return (
      <div className="space-y-4">
        <div className="alert alert-success">
          <span className="iconify lucide--shield-check size-5" />
          <span>Two-factor authentication is enabled</span>
        </div>

        <button
          type="button"
          onClick={handleDisable2FA}
          disabled={isDisabling}
          className="btn btn-error btn-sm"
        >
          {isDisabling ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <span className="iconify lucide--shield-off size-4" />
          )}
          Disable 2FA
        </button>
      </div>
    );
  }

  // Se está no processo de configuração
  if (showQRCode) {
    return (
      <div className="space-y-4">
        <div className="alert alert-info">
          <span className="iconify lucide--info size-5" />
          <span>Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</span>
        </div>

        {/* QR Code */}
        {qrCodeUri && (
          <div className="flex justify-center p-4 bg-white rounded-lg">
            <QRCodeSVG value={qrCodeUri} size={200} />
          </div>
        )}

        {/* Backup Codes */}
        {backupCodes.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Backup Codes (save these safely!):</p>
            <div className="p-4 bg-base-200 rounded-lg font-mono text-sm space-y-1">
              {backupCodes.map((code, idx) => (
                <div key={idx}>{code}</div>
              ))}
            </div>
            <button
              type="button"
              onClick={copyBackupCodes}
              className="btn btn-sm btn-outline"
            >
              <span className="iconify lucide--copy size-4" />
              Copy Codes
            </button>
          </div>
        )}

        {/* Verification Code Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Enter 6-digit code from your app</span>
          </label>
          <input
            type="text"
            placeholder="000000"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
            className="input input-bordered"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleVerify2FA}
            disabled={isVerifying || verificationCode.length !== 6}
            className="btn btn-primary"
          >
            {isVerifying ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <span className="iconify lucide--check size-4" />
            )}
            Verify & Enable
          </button>

          <button
            type="button"
            onClick={() => {
              setShowQRCode(false);
              setQrCodeUri("");
              setBackupCodes([]);
              setVerificationCode("");
            }}
            className="btn btn-ghost"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Estado inicial: 2FA desabilitado
  return (
    <div className="space-y-4">
      <div className="alert alert-warning">
        <span className="iconify lucide--shield-alert size-5" />
        <span>Two-factor authentication is not enabled</span>
      </div>

      <p className="text-sm text-base-content/70">
        Add an extra layer of security to your account by requiring a verification code in addition to your password.
      </p>

      <button
        type="button"
        onClick={handleEnable2FA}
        disabled={isEnabling}
        className="btn btn-primary btn-sm"
      >
        {isEnabling ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <span className="iconify lucide--shield-plus size-4" />
        )}
        Enable 2FA
      </button>
    </div>
  );
};
