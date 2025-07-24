import React, { useState } from "react";
import { useSmsVerification, type CountryCode } from "@sendt-media/campaign";

// Complete SMS verification flow component
export const SMSVerificationComplete: React.FC = () => {
    const [phone, setPhone] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [salutation, setSalutation] = useState("Mr");
    const [campaignId, setCampaignId] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [country, setCountry] = useState<CountryCode>("NL");
    const [sendResult, setSendResult] = useState<any>(null);
    const [verifyResult, setVerifyResult] = useState<any>(null);

    const { sendCode, isSending, sendError, verifyCode, isVerifying, verifyError, refresh } = useSmsVerification({
        countryCode: country,
        onSendSuccess: (data) => {
            console.log("SMS sent successfully:", data);
            setSendResult(data);
            alert("SMS verification code sent successfully!");
        },
        onSendError: (error) => {
            console.error("SMS sending failed:", error);
            setSendResult(null);
        },
        onVerifySuccess: (data) => {
            console.log("Code verified successfully:", data);
            setVerifyResult(data);
            if (data.valid) {
                alert("Code verified successfully!");
            } else {
                alert("Invalid verification code!");
            }
        },
        onVerifyError: (error) => {
            console.error("Code verification failed:", error);
            setVerifyResult(null);
        },
    });

    const handleSendCode = async () => {
        const result = await sendCode({
            phone,
            firstname,
            lastname,
            salutation,
            campaign_id: campaignId,
        });
        setSendResult(result);
    };

    const handleVerifyCode = async () => {
        const result = await verifyCode(verificationCode);
        setVerifyResult(result);
    };

    const handleRefresh = () => {
        refresh();
        setSendResult(null);
        setVerifyResult(null);
        setVerificationCode("");
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", margin: "10px 0", borderRadius: "4px" }}>
            <h2>Complete SMS Verification Flow</h2>

            {/* Step 1: Send SMS */}
            <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #e0e0e0", borderRadius: "5px" }}>
                <h3>Step 1: Send SMS Verification Code</h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
                    <div>
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
                    <div>
                        <label>
                            Phone:
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g., +31615220551 or 0615220551"
                                style={{ marginLeft: "10px", padding: "5px", width: "200px" }}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            First Name:
                            <input
                                type="text"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                placeholder="John"
                                style={{ marginLeft: "10px", padding: "5px" }}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Last Name:
                            <input
                                type="text"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                placeholder="Doe"
                                style={{ marginLeft: "10px", padding: "5px" }}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Salutation:
                            <select
                                value={salutation}
                                onChange={(e) => setSalutation(e.target.value)}
                                style={{ marginLeft: "10px", padding: "5px" }}>
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Ms">Ms</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            Campaign ID:
                            <input
                                type="text"
                                value={campaignId}
                                onChange={(e) => setCampaignId(e.target.value)}
                                placeholder="12345"
                                style={{ marginLeft: "10px", padding: "5px" }}
                            />
                        </label>
                    </div>
                </div>

                <button
                    onClick={handleSendCode}
                    disabled={isSending || !phone || !firstname || !lastname}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: isSending || !phone || !firstname || !lastname ? "#ccc" : "#007cba",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isSending || !phone || !firstname || !lastname ? "not-allowed" : "pointer",
                    }}>
                    {isSending ? "Sending..." : "Send Verification Code"}
                </button>

                {sendError && (
                    <div style={{ color: "red", marginTop: "10px", padding: "10px", backgroundColor: "#fee", borderRadius: "4px" }}>
                        <strong>Send Error:</strong> {sendError}
                    </div>
                )}

                {sendResult && (
                    <div style={{ backgroundColor: "#d4edda", padding: "10px", marginTop: "10px", borderRadius: "4px" }}>
                        <strong>SMS Sent Successfully!</strong>
                        <br />
                        Message IDs: {sendResult.ids?.join(", ") || "N/A"}
                        <br />
                        Total Cost: {sendResult.usage?.total_cost || "N/A"} {sendResult.usage?.currency || ""}
                    </div>
                )}
            </div>

            {/* Step 2: Verify Code */}
            <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #e0e0e0", borderRadius: "5px" }}>
                <h3>Step 2: Verify SMS Code</h3>

                <div style={{ marginBottom: "15px" }}>
                    <label>
                        Verification Code:
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Enter the 6-digit code"
                            style={{ marginLeft: "10px", padding: "5px", width: "150px" }}
                        />
                    </label>
                </div>

                <button
                    onClick={handleVerifyCode}
                    disabled={isVerifying || !verificationCode || !sendResult}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: isVerifying || !verificationCode || !sendResult ? "#ccc" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isVerifying || !verificationCode || !sendResult ? "not-allowed" : "pointer",
                    }}>
                    {isVerifying ? "Verifying..." : "Verify Code"}
                </button>

                {verifyError && (
                    <div style={{ color: "red", marginTop: "10px", padding: "10px", backgroundColor: "#fee", borderRadius: "4px" }}>
                        <strong>Verify Error:</strong> {verifyError}
                    </div>
                )}

                {verifyResult && (
                    <div
                        style={{
                            backgroundColor: verifyResult.valid ? "#d4edda" : "#f8d7da",
                            padding: "10px",
                            marginTop: "10px",
                            borderRadius: "4px",
                            color: verifyResult.valid ? "#155724" : "#721c24",
                        }}>
                        <strong>Verification Result:</strong> {verifyResult.valid ? "Valid" : "Invalid"}
                        {verifyResult.message && (
                            <div style={{ marginTop: "5px" }}>
                                <strong>Message:</strong> {verifyResult.message}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Reset Button */}
            <button
                onClick={handleRefresh}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}>
                Reset Flow
            </button>
        </div>
    );
};

// Quick SMS sending component
export const SMSVerificationQuickSend: React.FC = () => {
    const [phone, setPhone] = useState("");
    const [country, setCountry] = useState<CountryCode>("NL");

    const { sendCode, isSending, sendError } = useSmsVerification({
        countryCode: country,
        onSendSuccess: (data) => {
            alert(`SMS sent successfully! IDs: ${data.ids?.join(", ") || "N/A"}`);
        },
        onSendError: (error) => {
            alert(`SMS sending failed: ${error}`);
        },
    });

    const handleQuickSend = async () => {
        await sendCode({
            phone,
            firstname: "Test",
            lastname: "User",
            salutation: "Mr",
            campaign_id: "quick-test",
        });
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", margin: "10px 0", borderRadius: "4px" }}>
            <h2>Quick SMS Send</h2>
            <p style={{ color: "#666", fontStyle: "italic" }}>Quick SMS sending with default values</p>

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
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number..."
                        style={{ marginLeft: "10px", padding: "5px", width: "200px" }}
                    />
                </label>
            </div>

            <button
                onClick={handleQuickSend}
                disabled={isSending || !phone}
                style={{
                    padding: "10px 20px",
                    backgroundColor: isSending || !phone ? "#ccc" : "#007cba",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isSending || !phone ? "not-allowed" : "pointer",
                }}>
                {isSending ? "Sending..." : "Send Quick SMS"}
            </button>

            {sendError && (
                <div style={{ color: "red", marginTop: "10px", padding: "10px", backgroundColor: "#fee", borderRadius: "4px" }}>
                    <strong>Error:</strong> {sendError}
                </div>
            )}
        </div>
    );
};

// Code verification only component
export const SMSVerificationCodeOnly: React.FC = () => {
    const [verificationCode, setVerificationCode] = useState("");
    const [verifyResult, setVerifyResult] = useState<any>(null);

    const { verifyCode, isVerifying, verifyError, refresh } = useSmsVerification({
        countryCode: "NL", // Default country for verification-only component
        onVerifySuccess: (data) => {
            setVerifyResult(data);
            console.log("Code verified:", data);
        },
        onVerifyError: (error) => {
            setVerifyResult(null);
            console.error("Verification failed:", error);
        },
    });

    const handleVerifyCode = async () => {
        const result = await verifyCode(verificationCode);
        setVerifyResult(result);
    };

    const handleReset = () => {
        refresh();
        setVerifyResult(null);
        setVerificationCode("");
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", margin: "10px 0", borderRadius: "4px" }}>
            <h2>Code Verification Only</h2>
            <p style={{ color: "#666", fontStyle: "italic" }}>Verify SMS codes without sending - useful when you already have a code</p>

            <div style={{ marginBottom: "15px" }}>
                <label>
                    Verification Code:
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code..."
                        style={{ marginLeft: "10px", padding: "5px", width: "150px" }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <button
                    onClick={handleVerifyCode}
                    disabled={isVerifying || !verificationCode}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: isVerifying || !verificationCode ? "#ccc" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isVerifying || !verificationCode ? "not-allowed" : "pointer",
                        marginRight: "10px",
                    }}>
                    {isVerifying ? "Verifying..." : "Verify Code"}
                </button>
                <button
                    onClick={handleReset}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}>
                    Reset
                </button>
            </div>

            {verifyError && (
                <div style={{ color: "red", marginTop: "10px", padding: "10px", backgroundColor: "#fee", borderRadius: "4px" }}>
                    <strong>Error:</strong> {verifyError}
                </div>
            )}

            {verifyResult && (
                <div
                    style={{
                        backgroundColor: verifyResult.valid ? "#d4edda" : "#f8d7da",
                        padding: "15px",
                        marginTop: "10px",
                        borderRadius: "4px",
                        color: verifyResult.valid ? "#155724" : "#721c24",
                    }}>
                    <h3>Verification Result:</h3>
                    <p>
                        <strong>Valid:</strong> {verifyResult.valid ? "Yes" : "No"}
                    </p>
                    {verifyResult.message && (
                        <p>
                            <strong>Message:</strong> {verifyResult.message}
                        </p>
                    )}
                    {verifyResult.data && (
                        <details style={{ marginTop: "10px" }}>
                            <summary style={{ cursor: "pointer" }}>Raw Response Data</summary>
                            <pre style={{ backgroundColor: "rgba(0,0,0,0.1)", padding: "10px", marginTop: "5px", borderRadius: "4px" }}>
                                {JSON.stringify(verifyResult.data, null, 2)}
                            </pre>
                        </details>
                    )}
                </div>
            )}
        </div>
    );
};
