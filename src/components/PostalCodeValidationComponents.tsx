import React, { useState } from "react";
import { usePostalCodeValidation, type CountryCode } from "@sendt-media/campaign";

// Basic postal code validation component with Pro6PP API
export const PostalCodeValidationBasic: React.FC = () => {
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState<CountryCode>("NL");
    const [result, setResult] = useState<any>(null);

    const { validatePostalcode, quickValidate, isValidFormat, getAddressData, isLoading, error, refresh } = usePostalCodeValidation({
        countryCode: country,
        onSuccess: (data) => {
            console.log("Validation successful:", data);
            setResult(data);
        },
        onError: (error) => {
            console.error("Validation failed:", error);
            setResult(null);
        },
    });

    const handleValidate = async () => {
        const data = await validatePostalcode(postalCode);
        setResult(data);
    };

    const handleQuickValidate = () => {
        const isValid = quickValidate(postalCode);
        alert(`Quick validation result: ${isValid ? "Valid" : "Invalid"} format`);
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", margin: "10px 0", borderRadius: "4px" }}>
            <h2>Basic Postal Code Validation</h2>

            <div style={{ marginBottom: "15px" }}>
                <label>
                    Country:
                    <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value as CountryCode)}
                        style={{ marginLeft: "10px", padding: "5px" }}>
                        <option value="NL">Netherlands (NL)</option>
                        <option value="BE">Belgium (BE)</option>
                        <option value="DE">Germany (DE)</option>
                        <option value="FR">France (FR)</option>
                    </select>
                </label>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>
                    Postal Code:
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g., 1068NM"
                        style={{ marginLeft: "10px", padding: "5px" }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <button
                    onClick={handleValidate}
                    disabled={isLoading || !postalCode}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: isLoading || !postalCode ? "#ccc" : "#007cba",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isLoading || !postalCode ? "not-allowed" : "pointer",
                        marginRight: "10px",
                    }}>
                    {isLoading ? "Validating..." : "Validate with Pro6PP API"}
                </button>
                <button
                    onClick={handleQuickValidate}
                    disabled={!postalCode}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: !postalCode ? "#ccc" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: !postalCode ? "not-allowed" : "pointer",
                        marginRight: "10px",
                    }}>
                    Quick Format Check
                </button>
                <button
                    onClick={refresh}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}>
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <p>
                    <strong>Format Valid:</strong>{" "}
                    <span style={{ color: isValidFormat(postalCode) ? "green" : "red" }}>{isValidFormat(postalCode) ? "Yes" : "No"}</span>
                </p>
            </div>

            {error && (
                <div style={{ color: "red", marginBottom: "15px", padding: "10px", backgroundColor: "#fee", borderRadius: "4px" }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {result && (
                <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "4px" }}>
                    <h3>Validation Result:</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div>
                            <strong>Street:</strong> {getAddressData("street") || "N/A"}
                        </div>
                        <div>
                            <strong>Street Number:</strong> {getAddressData("streetNumber") || "N/A"}
                        </div>
                        <div>
                            <strong>Municipality:</strong> {getAddressData("municipality") || "N/A"}
                        </div>
                        <div>
                            <strong>Province:</strong> {getAddressData("province") || "N/A"}
                        </div>
                        <div>
                            <strong>Country:</strong> {getAddressData("country") || "N/A"}
                        </div>
                        <div>
                            <strong>Postal Code:</strong> {getAddressData("postalCode") || "N/A"}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// House number validation component
export const PostalCodeValidationHouseNumber: React.FC = () => {
    const [postalCode, setPostalCode] = useState("1068NM");
    const [houseNumber, setHouseNumber] = useState("461");
    const [result, setResult] = useState<any>(null);

    const { validateHouseNumber, getAddressData, isLoading, error, refresh } = usePostalCodeValidation({
        countryCode: "NL", // Fixed to Netherlands for this example
        onSuccess: (data) => {
            console.log("House number validation successful:", data);
            setResult(data);
        },
        onError: (error) => {
            console.error("House number validation failed:", error);
            setResult(null);
        },
    });

    const handleValidate = async () => {
        const data = await validateHouseNumber(postalCode, houseNumber);
        setResult(data);
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", margin: "10px 0", borderRadius: "4px" }}>
            <h2>House Number Validation (Netherlands)</h2>

            <div style={{ marginBottom: "15px" }}>
                <label>
                    Postal Code:
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g., 1068NM"
                        style={{ marginLeft: "10px", padding: "5px" }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>
                    House Number:
                    <input
                        type="text"
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                        placeholder="e.g., 461"
                        style={{ marginLeft: "10px", padding: "5px" }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <button
                    onClick={handleValidate}
                    disabled={isLoading || !postalCode || !houseNumber}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: isLoading || !postalCode || !houseNumber ? "#ccc" : "#007cba",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isLoading || !postalCode || !houseNumber ? "not-allowed" : "pointer",
                        marginRight: "10px",
                    }}>
                    {isLoading ? "Validating..." : "Validate House Number"}
                </button>
                <button
                    onClick={refresh}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}>
                    Reset
                </button>
            </div>

            {error && (
                <div style={{ color: "red", marginBottom: "15px", padding: "10px", backgroundColor: "#fee", borderRadius: "4px" }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {result && (
                <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "4px" }}>
                    <h3>House Number Validation Result:</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div>
                            <strong>Street:</strong> {getAddressData("street") || "N/A"}
                        </div>
                        <div>
                            <strong>Street Number:</strong> {getAddressData("streetNumber") || "N/A"}
                        </div>
                        <div>
                            <strong>Municipality:</strong> {getAddressData("municipality") || "N/A"}
                        </div>
                        <div>
                            <strong>Province:</strong> {getAddressData("province") || "N/A"}
                        </div>
                        <div>
                            <strong>Country:</strong> {getAddressData("country") || "N/A"}
                        </div>
                        <div>
                            <strong>Postal Code:</strong> {getAddressData("postalCode") || "N/A"}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Format-only validation component (no API calls)
export const PostalCodeValidationFormatOnly: React.FC = () => {
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState<CountryCode>("NL");

    const { quickValidate, isValidFormat } = usePostalCodeValidation({
        countryCode: country,
        // Format-only validation - simply don't call API functions
    });

    const handleQuickValidate = () => {
        const isValid = quickValidate(postalCode);
        alert(`Quick validation result: ${isValid ? "Valid" : "Invalid"} format for ${country}`);
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", margin: "10px 0", borderRadius: "4px" }}>
            <h2>Format-Only Validation</h2>
            <p style={{ color: "#666", fontStyle: "italic" }}>No API calls - only format validation using regex patterns</p>

            <div style={{ marginBottom: "15px" }}>
                <label>
                    Country:
                    <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value as CountryCode)}
                        style={{ marginLeft: "10px", padding: "5px" }}>
                        <option value="NL">Netherlands (NL)</option>
                        <option value="BE">Belgium (BE)</option>
                        <option value="DE">Germany (DE)</option>
                        <option value="FR">France (FR)</option>
                    </select>
                </label>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>
                    Postal Code:
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Enter postal code..."
                        style={{ marginLeft: "10px", padding: "5px" }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <button
                    onClick={handleQuickValidate}
                    disabled={!postalCode}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: !postalCode ? "#ccc" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: !postalCode ? "not-allowed" : "pointer",
                    }}>
                    Check Format
                </button>
            </div>

            <div
                style={{
                    padding: "10px",
                    backgroundColor: isValidFormat(postalCode) ? "#d4edda" : "#f8d7da",
                    border: `1px solid ${isValidFormat(postalCode) ? "#c3e6cb" : "#f5c6cb"}`,
                    borderRadius: "4px",
                    color: isValidFormat(postalCode) ? "#155724" : "#721c24",
                }}>
                <strong>Format Valid:</strong> {isValidFormat(postalCode) ? "Yes" : "No"}
                {postalCode && (
                    <div style={{ marginTop: "5px", fontSize: "14px" }}>
                        Testing "{postalCode}" against {country} format
                    </div>
                )}
            </div>
        </div>
    );
};
