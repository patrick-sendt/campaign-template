import { useState, useCallback } from "react";

/**
 * SMS Verification Hook
 * React hook that provides state management and API functionality for SMS verification
 */

export interface SmsVerificationParams {
    phone: string;
    firstname: string;
    lastname: string;
    aanhef: string; // salutation
    campaign_id: string;
}

export interface SmsVerificationResponse {
    success: boolean;
    message?: string;
    data?: unknown;
}

export interface SmsVerificationError {
    status: number;
    statusText: string;
    message: string;
}

export interface SmsVerifyParams {
    code: string;
}

export interface SmsVerifyResponse {
    success: boolean;
    valid: boolean;
    message?: string;
    data?: unknown;
}

export interface UseSmsVerificationOptions {
    onSuccess?: (response: SmsVerificationResponse) => void;
    onError?: (error: SmsVerificationError) => void;
    onVerifySuccess?: (response: SmsVerifyResponse) => void;
    onVerifyError?: (error: SmsVerificationError) => void;
    timeout?: number; // in milliseconds, default 10000
}

/**
 * Custom hook for SMS verification with state management
 * @param options - Configuration options including callbacks and timeout
 * @returns Object with sendVerification function, loading state, error state, data, and reset function
 */
export const useSmsVerification = (options: UseSmsVerificationOptions = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<SmsVerificationError | null>(null);
    const [data, setData] = useState<SmsVerificationResponse | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState<SmsVerificationError | null>(null);
    const [verifyData, setVerifyData] = useState<SmsVerifyResponse | null>(null);

    const { onSuccess, onError, onVerifySuccess, onVerifyError, timeout = 10000 } = options;

    const sendVerification = useCallback(
        async (params: SmsVerificationParams) => {
            setIsLoading(true);
            setError(null);
            setData(null);

            try {
                // Format phone number for Dutch mobile numbers
                let formattedPhone = params.phone.replace(/\s/g, ""); // Remove all spaces

                // Handle Dutch mobile number formats
                if (formattedPhone.startsWith("06")) {
                    // Convert "06xxxxxxxx" to "316xxxxxxxx"
                    formattedPhone = "31" + formattedPhone.substring(1);
                } else if (formattedPhone.startsWith("+316")) {
                    // Convert "+316xxxxxxxx" to "316xxxxxxxx"
                    formattedPhone = formattedPhone.substring(1);
                } else if (formattedPhone.startsWith("+31")) {
                    // Convert "+31xxxxxxxxx" to "31xxxxxxxxx"
                    formattedPhone = formattedPhone.substring(1);
                }

                const searchParams = new URLSearchParams({
                    phone: formattedPhone,
                    firstname: params.firstname,
                    lastname: params.lastname,
                    aanhef: params.aanhef,
                    campaign_id: params.campaign_id,
                });

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);

                const response = await fetch(`https://v2.sendtportal.com/api/sms_verification?${searchParams}`, {
                    method: "POST",
                    headers: {
                        Cookie: "counter=1",
                    },
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result: SmsVerificationResponse = await response.json();
                setData(result);

                if (onSuccess) {
                    onSuccess(result);
                }

                return result;
            } catch (err) {
                const error: SmsVerificationError = {
                    status: err instanceof Response ? err.status : 0,
                    statusText: err instanceof Response ? err.statusText : "Unknown",
                    message: err instanceof Error ? err.message : "An unexpected error occurred",
                };

                setError(error);

                if (onError) {
                    onError(error);
                }

                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [onSuccess, onError, timeout]
    );

    const verifyCode = useCallback(
        async (params: SmsVerifyParams) => {
            setIsVerifying(true);
            setVerifyError(null);
            setVerifyData(null);

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);

                const response = await fetch(`https://v2.sendtportal.com/api/sms_verify?query=${params.code}`, {
                    method: "GET",
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result: SmsVerifyResponse = await response.json();
                setVerifyData(result);

                if (result.valid) {
                    if (onVerifySuccess) {
                        onVerifySuccess(result);
                    }
                } else {
                    throw new Error("Invalid verification code");
                }

                return result;
            } catch (err) {
                const error: SmsVerificationError = {
                    status: err instanceof Response ? err.status : 0,
                    statusText: err instanceof Response ? err.statusText : "Unknown",
                    message: err instanceof Error ? err.message : "An unexpected error occurred",
                };

                setVerifyError(error);

                if (onVerifyError) {
                    onVerifyError(error);
                }

                throw error;
            } finally {
                setIsVerifying(false);
            }
        },
        [onVerifySuccess, onVerifyError, timeout]
    );

    const reset = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setData(null);
        setIsVerifying(false);
        setVerifyError(null);
        setVerifyData(null);
    }, []);

    return {
        sendVerification,
        isLoading,
        error,
        data,
        verifyCode,
        isVerifying,
        verifyError,
        verifyData,
        reset,
    };
};
