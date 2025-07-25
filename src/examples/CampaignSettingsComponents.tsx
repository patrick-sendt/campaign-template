import React from "react";
import { useCampaignSettings } from "@sendt-media/campaign";

// Basic usage component with immediate loading (default)
export const CampaignSettingsBasic: React.FC = () => {
    const { settings, getSetting, getSettings, isLoading, error, refresh } = useCampaignSettings();

    if (isLoading) {
        return <div>Loading campaign settings...</div>;
    }

    if (error) {
        return (
            <div style={{ color: "red" }}>
                <h3>Error loading settings:</h3>
                <p>{error}</p>
                <button
                    onClick={refresh}
                    style={{ padding: "8px 16px", marginTop: "10px" }}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2>Campaign Settings - Basic</h2>

            {/* Display all settings */}
            <div>
                <h3>All Settings:</h3>
                <pre style={{ background: "#f5f5f5", padding: "10px", borderRadius: "4px", overflow: "auto" }}>{JSON.stringify(getSettings(), null, 2)}</pre>
            </div>

            {/* Get specific settings */}
            <div>
                <h3>Specific Settings:</h3>
                <ul>
                    <li>
                        <strong>Setting1:</strong> {getSetting("setting1") || "Not found"}
                    </li>
                    <li>
                        <strong>Setting2:</strong> {getSetting("setting2") || "Not found"}
                    </li>
                    <li>
                        <strong>Setting3:</strong> {getSetting("setting3") || "Not found"}
                    </li>
                </ul>
            </div>

            {/* Refresh button */}
            <button
                onClick={refresh}
                style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    backgroundColor: "#007cba",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}>
                Refresh Settings
            </button>
        </div>
    );
};

// Manual loading component (immediate: false)
export const CampaignSettingsManual: React.FC = () => {
    const { settings, getSetting, isLoading, error, refresh } = useCampaignSettings({
        immediate: false,
    });

    return (
        <div>
            <h2>Manual Loading Campaign Settings</h2>

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
                {isLoading ? "Loading..." : "Load Campaign Settings"}
            </button>

            {error && (
                <div style={{ color: "red", marginTop: "10px" }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {settings && (
                <div style={{ marginTop: "15px" }}>
                    <h3>Loaded Settings:</h3>
                    <table style={{ borderCollapse: "collapse", width: "100%" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f0f0f0" }}>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Key</th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(settings).map(([key, value]) => (
                                <tr key={key}>
                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{key}</td>
                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Custom configuration component
export const CampaignSettingsCustom: React.FC = () => {
    const { settings, getSetting, isLoading, error, refresh } = useCampaignSettings({
        apiKey: "custom-api-key", // Override environment variable
        offerId: "custom-offer-id", // Override environment variable
        immediate: false,
    });

    return (
        <div>
            <h2>Custom Configuration</h2>
            <p style={{ color: "#666", fontStyle: "italic" }}>Using custom API key and offer ID</p>

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
                {isLoading ? "Loading..." : "Load with Custom Config"}
            </button>

            {error && (
                <div style={{ color: "red", marginTop: "10px" }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {settings && (
                <div style={{ marginTop: "15px" }}>
                    <h3>Settings with Custom Config:</h3>
                    <p>
                        <strong>Total settings:</strong> {Object.keys(settings).length}
                    </p>
                    <p>
                        <strong>Sample setting1:</strong> {getSetting("setting1") || "Not found"}
                    </p>
                </div>
            )}
        </div>
    );
};

// Environment variables component
export const CampaignSettingsEnvironment: React.FC = () => {
    const { settings, isLoading, error, refresh } = useCampaignSettings();

    return (
        <div>
            <h2>Environment Variables</h2>
            <p style={{ color: "#666", fontStyle: "italic" }}>Make sure to set VITE_SENDT360_API_KEY and VITE_SENDT360_OFFER_ID</p>

            <div style={{ background: "#f9f9f9", padding: "10px", borderRadius: "4px", marginBottom: "15px" }}>
                <h4>Required Environment Variables:</h4>
                <code style={{ display: "block", marginBottom: "5px" }}>VITE_SENDT360_API_KEY=your-api-key</code>
                <code>VITE_SENDT360_OFFER_ID=your-offer-id</code>
            </div>

            {isLoading && <div>Loading...</div>}

            {error && (
                <div style={{ color: "red" }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {settings && (
                <div>
                    <h3>Successfully Loaded Settings</h3>
                    <p>Total settings: {Object.keys(settings).length}</p>
                </div>
            )}

            <button
                onClick={refresh}
                style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    backgroundColor: "#007cba",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}>
                Refresh
            </button>
        </div>
    );
};
