import React, { useEffect, useState } from "react";
import { useSignupProcessing, useUrlParams, type SignupData, type SignupQuestions } from "@sendt-media/campaign";

// Complete signup processing component with full form
export const SignupProcessingComplete: React.FC = () => {
    const { getParam, getAllParams } = useUrlParams();

    // Form state
    const [formData, setFormData] = useState<SignupData>({
        email: "test@example.com",
        firstname: "John",
        lastname: "Doe",
        lastname_prefix: "",
        gender: "M",
        birthdate: "1990-01-01",
        address: "Main Street",
        city: "Amsterdam",
        housenumber: "123",
        housenumber_addition: "A",
        postalcode: "1000AA",
        province: "Noord-Holland",
        phone: "+31612345678",
        offer_id: getParam("offer_id"),
        params: JSON.stringify(getAllParams()),
        platform_id: getParam("pf_id"),
        publisher_id: getParam("aff_id"),
        transaction_id: getParam("transaction_id"),
        sndt_adv_id: getParam("sndt_adv_id"),
        ho_aff_click_id: "click123",
        ho_aff_source: "source123",
        ho_aff_sub_1: "sub1",
        ho_aff_sub_2: "sub2",
        ho_aff_sub_3: "sub3",
        ho_aff_sub_4: "sub4",
        ho_aff_sub_5: "sub5",
        facebook_click_id: getParam("fbclid"),
        google_click_id: "goog123",
    });

    const [questions, setQuestions] = useState<SignupQuestions>({
        "answers[huidige_energie_leverancier_nl]": "Energieleverancier: Vattenfall",
        "answers[gezinssamenstelling]": "Gezinssamenstelling: 2 volwassenen",
        "answers[type_woning]": "Type woning: Appartement",
        "answers[campaign_question]": "What is your interest?",
        "answers[campaign_answer]": "Energy savings",
        "answers[campagne]": "Energy Campaign 2024",
    });

    const [redirectUrl, setRedirectUrl] = useState("https://example.com/success");
    const [redirectTimeout, setRedirectTimeout] = useState(4000);

    // Initialize the hook with callbacks
    const { processSignup, isLoading, error, refresh } = useSignupProcessing({
        onSignupSuccess: (response) => {
            console.log("✅ Signup successful:", response);
            alert(`Signup successful! ID: ${response.id}, Conversion: ${response.conversion}`);
        },
        onSignupError: (error) => {
            console.error("❌ Signup failed:", error);
            alert(`Signup failed: ${error}`);
        },
        onQuestionsSuccess: () => {
            console.log("✅ Questions processed successfully");
        },
        onQuestionsError: (error) => {
            console.error("❌ Questions processing failed:", error);
        },
        onPartnerPixelSuccess: (pixelSrc) => {
            console.log("✅ Partner pixel loaded:", pixelSrc);
        },
        onPartnerPixelError: (error) => {
            console.error("❌ Partner pixel failed:", error);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await processSignup({
                data: formData,
                questions: questions,
                redirectUrl: redirectUrl || undefined,
                redirectTimeout: redirectTimeout,
            });
        } catch (err) {
            console.error("Process signup error:", err);
        }
    };

    const handleInputChange = (field: keyof SignupData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleQuestionChange = (key: string, value: string) => {
        setQuestions((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1>Complete Signup Processing</h1>

            {error && (
                <div
                    style={{
                        backgroundColor: "#fee",
                        border: "1px solid #fcc",
                        padding: "10px",
                        marginBottom: "20px",
                        borderRadius: "4px",
                    }}>
                    <strong>Error:</strong> {error}
                    <button
                        onClick={refresh}
                        style={{ marginLeft: "10px", padding: "5px 10px" }}>
                        Clear Error
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <h2>Personal Information</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        style={{ padding: "8px" }}
                    />
                    <input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstname}
                        onChange={(e) => handleInputChange("firstname", e.target.value)}
                        required
                        style={{ padding: "8px" }}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastname}
                        onChange={(e) => handleInputChange("lastname", e.target.value)}
                        required
                        style={{ padding: "8px" }}
                    />
                    <input
                        type="text"
                        placeholder="Last Name Prefix"
                        value={formData.lastname_prefix}
                        onChange={(e) => handleInputChange("lastname_prefix", e.target.value)}
                        style={{ padding: "8px" }}
                    />
                    <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        required
                        style={{ padding: "8px" }}>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                    </select>
                    <input
                        type="date"
                        value={formData.birthdate}
                        onChange={(e) => handleInputChange("birthdate", e.target.value)}
                        required
                        style={{ padding: "8px" }}
                    />
                </div>

                <h2>Address Information</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                    <input
                        type="text"
                        placeholder="Address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        required
                        style={{ padding: "8px" }}
                    />
                    <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        required
                        style={{ padding: "8px" }}
                    />
                    <input
                        type="text"
                        placeholder="House Number"
                        value={formData.housenumber}
                        onChange={(e) => handleInputChange("housenumber", e.target.value)}
                        required
                        style={{ padding: "8px" }}
                    />
                    <input
                        type="text"
                        placeholder="House Number Addition"
                        value={formData.housenumber_addition}
                        onChange={(e) => handleInputChange("housenumber_addition", e.target.value)}
                        style={{ padding: "8px" }}
                    />
                    <input
                        type="text"
                        placeholder="Postal Code"
                        value={formData.postalcode}
                        onChange={(e) => handleInputChange("postalcode", e.target.value)}
                        required
                        style={{ padding: "8px" }}
                    />
                    <input
                        type="text"
                        placeholder="Province"
                        value={formData.province}
                        onChange={(e) => handleInputChange("province", e.target.value)}
                        required
                        style={{ padding: "8px" }}
                    />
                </div>

                <h2>Campaign Questions (Optional)</h2>
                <div style={{ marginBottom: "20px" }}>
                    {Object.entries(questions).map(([key, value]) => (
                        <div
                            key={key}
                            style={{ marginBottom: "10px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                                {key.replace("answers[", "").replace("]", "").replace(/_/g, " ")}:
                            </label>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => handleQuestionChange(key, e.target.value)}
                                style={{ width: "100%", padding: "8px" }}
                            />
                        </div>
                    ))}
                </div>

                <h2>Redirect Settings</h2>
                <div style={{ marginBottom: "20px" }}>
                    <input
                        type="url"
                        placeholder="Redirect URL (optional)"
                        value={redirectUrl}
                        onChange={(e) => setRedirectUrl(e.target.value)}
                        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                    />
                    <input
                        type="number"
                        placeholder="Redirect Timeout (ms)"
                        value={redirectTimeout}
                        onChange={(e) => setRedirectTimeout(Number(e.target.value))}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        backgroundColor: isLoading ? "#ccc" : "#007cba",
                        color: "white",
                        padding: "12px 24px",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "16px",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        width: "100%",
                    }}>
                    {isLoading ? "Processing Signup..." : "Process Signup"}
                </button>
            </form>

            <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
                <h3>Hook State:</h3>
                <p>
                    <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
                </p>
                <p>
                    <strong>Error:</strong> {error || "None"}
                </p>
            </div>
        </div>
    );
};

// Quick signup test component
export const SignupProcessingQuick: React.FC = () => {
    const { processSignup, isLoading, error, refresh } = useSignupProcessing({
        onSignupSuccess: (response) => {
            alert(`Signup successful! ID: ${response.id}`);
        },
        onSignupError: (error) => {
            alert(`Signup failed: ${error}`);
        },
        onQuestionsSuccess: () => {
            console.log("Questions processed successfully");
        },
        onPartnerPixelSuccess: (pixelSrc) => {
            console.log("Partner pixel loaded:", pixelSrc);
        },
    });

    const handleQuickSignup = async () => {
        try {
            await processSignup({
                data: {
                    email: "test@example.com",
                    firstname: "John",
                    lastname: "Doe",
                    lastname_prefix: "",
                    gender: "M",
                    birthdate: "1990-01-01",
                    address: "Main Street",
                    city: "Amsterdam",
                    housenumber: "123",
                    housenumber_addition: "A",
                    postalcode: "1000AA",
                    province: "Noord-Holland",
                    phone: "+31612345678",
                    offer_id: "offer123",
                    params: "utm_source=google",
                    platform_id: "platform123",
                    publisher_id: "pub123",
                    transaction_id: "trans123",
                    sndt_adv_id: "adv123",
                    ho_aff_click_id: "click123",
                    ho_aff_source: "source123",
                    ho_aff_sub_1: "sub1",
                    ho_aff_sub_2: "sub2",
                    ho_aff_sub_3: "sub3",
                    ho_aff_sub_4: "sub4",
                    ho_aff_sub_5: "sub5",
                    facebook_click_id: "fb123",
                    google_click_id: "goog123",
                },
                questions: {
                    "answers[campaign_question]": "What is your interest?",
                    "answers[campaign_answer]": "Energy savings",
                },
                redirectUrl: "https://example.com/success",
                redirectTimeout: 5000,
            });
        } catch (err) {
            console.error("Process signup error:", err);
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", margin: "10px 0", borderRadius: "4px" }}>
            <h2>Quick Signup Test</h2>
            <p style={{ color: "#666", fontStyle: "italic" }}>Test signup processing with predefined data</p>

            <button
                onClick={handleQuickSignup}
                disabled={isLoading}
                style={{
                    backgroundColor: isLoading ? "#ccc" : "#007cba",
                    color: "white",
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    fontSize: "16px",
                }}>
                {isLoading ? "Processing..." : "Test Quick Signup"}
            </button>

            {error && (
                <div style={{ marginTop: "10px", color: "red", padding: "10px", backgroundColor: "#fee", borderRadius: "4px" }}>
                    <strong>Error:</strong> {error}
                    <button
                        onClick={refresh}
                        style={{ marginLeft: "10px", padding: "5px 10px" }}>
                        Clear
                    </button>
                </div>
            )}

            <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                <h3>Status:</h3>
                <p>
                    <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
                </p>
                <p>
                    <strong>Error:</strong> {error || "None"}
                </p>
            </div>
        </div>
    );
};

// Minimal signup component (only required fields)
export const SignupProcessingMinimal: React.FC = () => {
    const [email, setEmail] = useState("user@example.com");
    const [firstname, setFirstname] = useState("Jane");
    const [lastname, setLastname] = useState("Smith");

    const { processSignup, isLoading, error, refresh } = useSignupProcessing({
        onSignupSuccess: (response) => {
            alert(`Minimal signup successful! ID: ${response.id}`);
        },
        onSignupError: (error) => {
            alert(`Signup failed: ${error}`);
        },
    });

    const handleMinimalSignup = async () => {
        try {
            await processSignup({
                data: {
                    email,
                    firstname,
                    lastname,
                    lastname_prefix: "",
                    gender: "O",
                    birthdate: "2000-01-01",
                    address: "Default Address",
                    city: "Default City",
                    housenumber: "1",
                    housenumber_addition: "",
                    postalcode: "1000AA",
                    province: "Default Province",
                    phone: "+31600000000",
                    offer_id: "minimal123",
                    params: "",
                    platform_id: "minimal",
                    publisher_id: "minimal",
                    transaction_id: `min-${Date.now()}`,
                    sndt_adv_id: "",
                    ho_aff_click_id: "",
                    ho_aff_source: "",
                    ho_aff_sub_1: "",
                    ho_aff_sub_2: "",
                    ho_aff_sub_3: "",
                    ho_aff_sub_4: "",
                    ho_aff_sub_5: "",
                    facebook_click_id: "",
                    google_click_id: "",
                },
            });
        } catch (err) {
            console.error("Minimal signup error:", err);
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", margin: "10px 0", borderRadius: "4px" }}>
            <h2>Minimal Signup</h2>
            <p style={{ color: "#666", fontStyle: "italic" }}>Signup with only the essential user-facing fields</p>

            <div style={{ marginBottom: "15px" }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                />
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    style={{ width: "100%", padding: "8px" }}
                />
            </div>

            <button
                onClick={handleMinimalSignup}
                disabled={isLoading || !email || !firstname || !lastname}
                style={{
                    backgroundColor: isLoading || !email || !firstname || !lastname ? "#ccc" : "#28a745",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isLoading || !email || !firstname || !lastname ? "not-allowed" : "pointer",
                }}>
                {isLoading ? "Processing..." : "Submit Minimal Signup"}
            </button>

            {error && (
                <div style={{ marginTop: "10px", color: "red", padding: "10px", backgroundColor: "#fee", borderRadius: "4px" }}>
                    <strong>Error:</strong> {error}
                    <button
                        onClick={refresh}
                        style={{ marginLeft: "10px", padding: "5px 10px" }}>
                        Clear
                    </button>
                </div>
            )}

            <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "4px", fontSize: "14px" }}>
                <p>
                    <strong>Note:</strong> This uses minimal user input with defaults for tracking fields
                </p>
                <p>
                    <strong>Status:</strong> {isLoading ? "Processing..." : "Ready"}
                </p>
            </div>
        </div>
    );
};
