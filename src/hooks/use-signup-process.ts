import { useState, useCallback } from "react";

/**
 * Signup Process Hook
 * React hook that provides state management and API functionality for signup processing
 */

export interface SignupData {
    email: string;
    firstname: string;
    lastname: string;
    lastname_prefix: string;
    gender: string;
    birthdate: string;
    address: string;
    city: string;
    housenumber: string;
    housenumber_addition: string;
    postalcode: string;
    province: string;
    phone: string;
    offer_id: string;
    params: string;
    platform_id: string;
    publisher_id: string;
    transaction_id: string;
    sndt_adv_id: string;
    ho_aff_click_id: string;
    ho_aff_source: string;
    ho_aff_sub_1: string;
    ho_aff_sub_2: string;
    ho_aff_sub_3: string;
    ho_aff_sub_4: string;
    ho_aff_sub_5: string;
    facebook_click_id: string;
    google_click_id: string;
}

export interface SignupResponse {
    hash: string;
    id: string;
    conversion: boolean;
    [key: string]: unknown;
}

export interface Questions {
    [key: string]: string | number | boolean;
}

export interface ProcessSignupParams {
    data: SignupData;
    questions?: Questions;
    redirectUrl?: string;
    redirectTimeout?: number; // in milliseconds, default 4000
}

export interface SignupError {
    status: number;
    statusText: string;
    message: string;
}

export interface UseSignupProcessOptions {
    onSuccess?: (response: SignupResponse) => void;
    onError?: (error: SignupError) => void;
    timeout?: number; // in milliseconds, default 10000
}

/**
 * Custom hook for signup processing with automatic question handling and redirect
 * @param options - Configuration options including callbacks and timeout
 * @returns Object with processSignup function, loading state, error state, data, and reset function
 */
export const useSignupProcess = (options: UseSignupProcessOptions = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<SignupError | null>(null);
    const [data, setData] = useState<SignupResponse | null>(null);

    const { onSuccess, onError, timeout = 10000 } = options;

    const processSignup = useCallback(
        async (params: ProcessSignupParams) => {
            setIsLoading(true);
            setError(null);
            setData(null);

            try {
                // Clean address and city data (remove non-alphabetic characters except spaces)
                const cleanedData = {
                    ...params.data,
                    address: params.data.address.replace(/[^a-zA-Z ]/g, ""),
                    city: params.data.city.replace(/[^a-zA-Z ]/g, ""),
                    postalcode: params.data.postalcode.toUpperCase(),
                };

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);

                const formData = new FormData();
                Object.entries(cleanedData).forEach(([key, value]) => {
                    formData.append(key, value);
                });

                const response = await fetch("https://v2.sendtportal.com/api/v2/processSignup", {
                    method: "POST",
                    body: formData,
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result: SignupResponse = await response.json();
                setData(result);

                // Process questions if provided and conversion is true
                if (params.questions && result.conversion && result.hash) {
                    try {
                        const questionController = new AbortController();
                        const questionTimeoutId = setTimeout(() => questionController.abort(), timeout);

                        const questionFormData = new FormData();
                        questionFormData.append("hash", result.hash);

                        Object.entries(params.questions).forEach(([key, value]) => {
                            questionFormData.append(key, String(value));
                        });

                        const questionResponse = await fetch("https://v2.sendtportal.com/api/v2/processQuestion", {
                            method: "POST",
                            body: questionFormData,
                            signal: questionController.signal,
                        });

                        clearTimeout(questionTimeoutId);

                        if (!questionResponse.ok) {
                            console.warn(`Question processing failed: ${questionResponse.status}`);
                        }
                    } catch (questionErr) {
                        console.warn("Question processing failed:", questionErr);
                        // Don't throw - questions are optional
                    }
                }

                // Handle automatic redirect
                if (params.redirectUrl) {
                    const redirectTimeout = params.redirectTimeout || 4000;
                    setTimeout(() => {
                        window.location.href = params.redirectUrl!;
                    }, redirectTimeout);
                }

                if (onSuccess) {
                    onSuccess(result);
                }

                return result;
            } catch (err) {
                const error: SignupError = {
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

    const reset = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setData(null);
    }, []);

    return {
        processSignup,
        isLoading,
        error,
        data,
        reset,
    };
};
