import React from "react";
import { useUrlParams } from "@sendt-media/campaign";

// Basic usage component with immediate loading (default)
export const UrlParamsBasic: React.FC = () => {
    const { params, getParam, getAllParams, hasParam, isLoading, error, refresh } = useUrlParams();

    if (isLoading) {
        return <div>Loading URL parameters...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Basic URL Parameters</h2>

            {/* Display all parameters */}
            <div>
                <h3>All Parameters:</h3>
                <pre style={{ backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "4px" }}>{JSON.stringify(getAllParams(), null, 2)}</pre>
            </div>

            {/* Get specific parameter */}
            <div>
                <h3>Campaign ID:</h3>
                <p>{getParam("campaignId") || "Not found"}</p>
            </div>

            {/* Check if parameter exists */}
            <div>
                <h3>Has UTM Source:</h3>
                <p>{hasParam("utm_source") ? "Yes" : "No"}</p>
            </div>

            {/* Refresh button */}
            <button
                onClick={refresh}
                style={{ padding: "8px 16px", marginTop: "10px" }}>
                Refresh Parameters
            </button>
        </div>
    );
};

// Manual loading component (immediate: false)
export const UrlParamsManual: React.FC = () => {
    const { params, getParam, isLoading, error, refresh } = useUrlParams({ immediate: false });

    return (
        <div>
            <h2>Manual Loading Parameters</h2>

            <button
                onClick={refresh}
                disabled={isLoading}
                style={{
                    padding: "8px 16px",
                    backgroundColor: isLoading ? "#ccc" : "#007cba",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                }}>
                {isLoading ? "Loading..." : "Load URL Parameters"}
            </button>

            {error && <div style={{ color: "red", marginTop: "10px" }}>Error: {error}</div>}

            {params && (
                <div style={{ marginTop: "15px" }}>
                    <h3>Loaded Parameters:</h3>
                    <ul>
                        {Object.entries(params).map(([key, value]) => (
                            <li key={key}>
                                <strong>{key}:</strong> {String(value)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// Campaign tracking component
export const UrlParamsCampaignTracking: React.FC = () => {
    const { getParam, hasParam, isLoading } = useUrlParams();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const campaignId = getParam("campaignId");
    const utmSource = getParam("utm_source");
    const utmMedium = getParam("utm_medium");
    const utmCampaign = getParam("utm_campaign");

    return (
        <div>
            <h2>Campaign Tracking</h2>

            {campaignId && (
                <div style={{ marginBottom: "15px" }}>
                    <h3>Campaign Information</h3>
                    <p>
                        <strong>Campaign ID:</strong> {campaignId}
                    </p>
                </div>
            )}

            {hasParam("utm_source") && (
                <div style={{ marginBottom: "15px" }}>
                    <h3>UTM Parameters</h3>
                    <ul>
                        <li>
                            <strong>Source:</strong> {utmSource}
                        </li>
                        <li>
                            <strong>Medium:</strong> {utmMedium}
                        </li>
                        <li>
                            <strong>Campaign:</strong> {utmCampaign}
                        </li>
                    </ul>
                </div>
            )}

            {!hasParam("campaignId") && !hasParam("utm_source") && <p style={{ color: "#666", fontStyle: "italic" }}>No campaign parameters found in URL</p>}
        </div>
    );
};
