import React, { useState } from "react";
import { usePhoneValidation, type CountryCode } from "@sendt-media/campaign";

// Basic phone number validation component with HLR API
export const PhoneValidationBasic: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [country, setCountry] = useState<CountryCode>("NL");
    const [result, setResult] = useState<any>(null);

    const { validatePhone, quickValidate, isValidFormat, getPhoneData, isLoading, error, refresh } = usePhoneValidation({
        countryCode: country,
        onSuccess: (data) => {
            console.log("Phone validation successful:", data);
            setResult(data);
        },
        onError: (error) => {
            console.error("Phone validation failed:", error);
            setResult(null);
        },
    });

    const handleValidate = async () => {
        const data = await validatePhone(phoneNumber);
        setResult(data);
    };

    const handleQuickValidate = () => {
        const isValid = quickValidate(phoneNumber);
        alert(`Quick validation result: ${isValid ? "Valid" : "Invalid"} format`);
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", margin: "10px 0", borderRadius: "4px" }}>
            <h2>Basic Phone Number Validation</h2>

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
                    Phone Number:
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g., +31612345678 or 0612345678"
                        style={{ marginLeft: "10px", padding: "5px", width: "200px" }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <button
                    onClick={handleValidate}
                    disabled={isLoading || !phoneNumber}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: isLoading || !phoneNumber ? "#ccc" : "#007cba",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isLoading || !phoneNumber ? "not-allowed" : "pointer",
                        marginRight: "10px",
                    }}>
                    {isLoading ? "Validating..." : "Validate with HLR API"}
                </button>
                <button
                    onClick={handleQuickValidate}
                    disabled={!phoneNumber}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: !phoneNumber ? "#ccc" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: !phoneNumber ? "not-allowed" : "pointer",
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
                    <span style={{ color: isValidFormat(phoneNumber) ? "green" : "red" }}>{isValidFormat(phoneNumber) ? "Yes" : "No"}</span>
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
                            <strong>MSISDN:</strong> {getPhoneData("msisdn") || "N/A"}
                        </div>
                        <div>
                            <strong>Country:</strong> {getPhoneData("originalcountryname") || "N/A"}
                        </div>
                        <div>
                            <strong>Network:</strong> {getPhoneData("originalnetworkname") || "N/A"}
                        </div>
                        <div>
                            <strong>Valid:</strong> {getPhoneData("isvalid") === "1" ? "Yes" : "No"}
                        </div>
                        <div>
                            <strong>Status:</strong> {getPhoneData("subscriberstatus") || "N/A"}
                        </div>
                        <div>
                            <strong>Country Code:</strong> {getPhoneData("originalcountrycode") || "N/A"}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Format-only validation component (no API calls)
export const PhoneValidationFormatOnly: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [country, setCountry] = useState<CountryCode>("NL");

    const { quickValidate, isValidFormat } = usePhoneValidation({
        countryCode: country,
    });

    const handleQuickValidate = () => {
        const isValid = quickValidate(phoneNumber);
        alert(`Quick validation result: ${isValid ? "Valid" : "Invalid"} format for ${country}`);
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", margin: "10px 0", borderRadius: "4px" }}>
            <h2>Format-Only Phone Validation</h2>
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
                    Phone Number:
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number..."
                        style={{ marginLeft: "10px", padding: "5px", width: "200px" }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <button
                    onClick={handleQuickValidate}
                    disabled={!phoneNumber}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: !phoneNumber ? "#ccc" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: !phoneNumber ? "not-allowed" : "pointer",
                    }}>
                    Check Format
                </button>
            </div>

            <div
                style={{
                    padding: "10px",
                    backgroundColor: isValidFormat(phoneNumber) ? "#d4edda" : "#f8d7da",
                    border: `1px solid ${isValidFormat(phoneNumber) ? "#c3e6cb" : "#f5c6cb"}`,
                    borderRadius: "4px",
                    color: isValidFormat(phoneNumber) ? "#155724" : "#721c24",
                }}>
                <strong>Format Valid:</strong> {isValidFormat(phoneNumber) ? "Yes" : "No"}
                {phoneNumber && (
                    <div style={{ marginTop: "5px", fontSize: "14px" }}>
                        Testing "{phoneNumber}" against {country} format
                    </div>
                )}
            </div>
        </div>
    );
};

// International phone number formatting component
export const PhoneValidationInternational: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>("NL");
    const [results, setResults] = useState<{ [key: string]: boolean }>({});

    const handleValidateAll = () => {
        const countries: CountryCode[] = ["NL", "BE", "DE", "FR"];
        const newResults: { [key: string]: boolean } = {};

        countries.forEach((country) => {
            const { isValidFormat } = usePhoneValidation({ countryCode: country });
            newResults[country] = isValidFormat(phoneNumber);
        });

        setResults(newResults);
    };

    const { quickValidate, isValidFormat } = usePhoneValidation({
        countryCode: selectedCountry,
    });

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", margin: "10px 0", borderRadius: "4px" }}>
            <h2>International Phone Format Checker</h2>
            <p style={{ color: "#666", fontStyle: "italic" }}>Test phone number format against multiple countries</p>

            <div style={{ marginBottom: "15px" }}>
                <label>
                    Phone Number:
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter international phone number..."
                        style={{ marginLeft: "10px", padding: "5px", width: "250px" }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>
                    Primary Country:
                    <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value as CountryCode)}
                        style={{ marginLeft: "10px", padding: "5px" }}>
                        <option value="NL">Netherlands (NL)</option>
                        <option value="BE">Belgium (BE)</option>
                        <option value="DE">Germany (DE)</option>
                        <option value="FR">France (FR)</option>
                    </select>
                </label>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <button
                    onClick={() => quickValidate(phoneNumber) && alert(`Valid format for ${selectedCountry}`)}
                    disabled={!phoneNumber}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: !phoneNumber ? "#ccc" : "#007cba",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: !phoneNumber ? "not-allowed" : "pointer",
                        marginRight: "10px",
                    }}>
                    Check Primary Country
                </button>
                <button
                    onClick={handleValidateAll}
                    disabled={!phoneNumber}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: !phoneNumber ? "#ccc" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: !phoneNumber ? "not-allowed" : "pointer",
                    }}>
                    Check All Countries
                </button>
            </div>

            <div
                style={{
                    padding: "10px",
                    backgroundColor: isValidFormat(phoneNumber) ? "#d4edda" : "#f8d7da",
                    border: `1px solid ${isValidFormat(phoneNumber) ? "#c3e6cb" : "#f5c6cb"}`,
                    borderRadius: "4px",
                    color: isValidFormat(phoneNumber) ? "#155724" : "#721c24",
                    marginBottom: "15px",
                }}>
                <strong>Primary Country ({selectedCountry}) Valid:</strong> {isValidFormat(phoneNumber) ? "Yes" : "No"}
            </div>

            {Object.keys(results).length > 0 && (
                <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "4px" }}>
                    <h3>Multi-Country Validation Results:</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {Object.entries(results).map(([country, isValid]) => (
                            <div
                                key={country}
                                style={{
                                    padding: "8px",
                                    backgroundColor: isValid ? "#d4edda" : "#f8d7da",
                                    borderRadius: "4px",
                                    color: isValid ? "#155724" : "#721c24",
                                }}>
                                <strong>{country}:</strong> {isValid ? "Valid" : "Invalid"}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
