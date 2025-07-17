import { useState, useEffect, useCallback } from "react";

/**
 * URL Parameters Hook
 * React hook that provides access to URL search parameters
 */

export interface UrlParams {
    [key: string]: string | null;
}

export interface UseUrlParamsOptions {
    parseOnMount?: boolean; // Whether to parse parameters on component mount (default: true)
    watchForChanges?: boolean; // Whether to watch for URL changes (default: false)
}

/**
 * Custom hook for managing URL parameters
 * @param options - Configuration options
 * @returns Object with parameters, getParam function, and refresh function
 */
export const useUrlParams = (options: UseUrlParamsOptions = {}) => {
    const { parseOnMount = true, watchForChanges = false } = options;

    const [params, setParams] = useState<UrlParams>({});
    const [isLoading, setIsLoading] = useState(true);

    const parseUrlParams = useCallback(() => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const paramObject: UrlParams = {};

            // Convert URLSearchParams to plain object
            for (const [key, value] of urlParams.entries()) {
                paramObject[key] = value;
            }

            setParams(paramObject);
        } catch (error) {
            console.error("Error parsing URL parameters:", error);
            setParams({});
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Get a specific parameter value
    const getParam = useCallback(
        (key: string): string | null => {
            return params[key] || null;
        },
        [params]
    );

    // Get all parameters
    const getAllParams = useCallback((): UrlParams => {
        return { ...params };
    }, [params]);

    // Check if a parameter exists
    const hasParam = useCallback(
        (key: string): boolean => {
            return key in params;
        },
        [params]
    );

    // Refresh parameters (re-parse from current URL)
    const refresh = useCallback(() => {
        setIsLoading(true);
        parseUrlParams();
    }, [parseUrlParams]);

    // Parse parameters on mount if enabled
    useEffect(() => {
        if (parseOnMount) {
            parseUrlParams();
        } else {
            setIsLoading(false);
        }
    }, [parseOnMount, parseUrlParams]);

    // Watch for URL changes if enabled
    useEffect(() => {
        if (!watchForChanges) return;

        const handlePopState = () => {
            parseUrlParams();
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [watchForChanges, parseUrlParams]);

    return {
        params,
        getParam,
        getAllParams,
        hasParam,
        refresh,
        isLoading,
    };
};
