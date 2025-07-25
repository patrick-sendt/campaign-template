# Campaign Template

This repository provides a starter template for building new campaigns using the `@sendt-media/campaign` package. It includes standard form structure, validation, and hookup points for all necessary hooks and flows. Refer to the `src/components/` directory for examples on how to use each hook.

## Installation

1. **Clone the template**
    ```bash
    git clone <this-repo-url> my-campaign
    cd my-campaign
    ```
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **Install the campaign hooks package**
    ```bash
    npm install @sendt-media/campaign
    ```

## Project Structure

```
my-campaign/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom hooks (if any)
│   ├── pages/            # Campaign pages
│   ├── styles/           # Global styles
│   └── index.tsx         # Entry point
├── README.md             # This file
└── package.json
```

## Usage

All campaigns must use the hooks provided by `@sendt-media/campaign` to ensure:

-   **Postal code & address validation**
-   **Phone number validation**
-   **Optional SMS verification flows**
-   **Signup processing with URL parameters & redirect**
-   **Basic form field validation**

### Standard Flow

1. **Import hooks**

    ```ts
    import {
        usePostalCodeValidation,
        usePhoneValidation,
        useSmsVerification,
        useSignupProcessing,
        useUrlParams,
        useCampaignSettings,
    } from "@sendt-media/campaign";
    ```

2. **Postal Code Validation**

    - Use `usePostalCodeValidation` with `countryCode` from `useCampaignSettings.getSetting('language')`.
    - Validate postal code alone or with house number.

3. **Phone Number Validation**

    - Use `usePhoneValidation` with `countryCode` from `useCampaignSettings.getSetting('language')`.

4. **SMS Verification (if used)**

    - Use `sendCode` / `verifyCode` from `useSmsVerification`.
    - Pass `countryCode` = `useCampaignSettings.getSetting('language')`, and `campaign_id` = `useCampaignSettings.getSetting('campaign_id')`.

5. **Signup Processing**

    - Use `useSignupProcessing`.
    - Get URL params (`offer_id`, `params`, `platform_id`, ... ) via `useUrlParams.getParam(...)`.
    - Get address (`address`, `city`, `province`) via `usePostalCodeValidation.getAddressData(...)`.
    - Get `redirectUrl` and `redirectTimeout` via `useCampaignSettings.getSetting(...)`.

6. **Form Validation**

    - Add basic validation rules (required, email format, etc.) to all form fields except those validated by hooks.

7. **Rendering & Submission**

    - Display loading, error states from each hook.
    - Ensure clear user feedback for each step.

## Template Example

```tsx
import React from "react";
import { usePostalCodeValidation, usePhoneValidation, useSmsVerification, useSignupProcessing, useUrlParams, useCampaignSettings } from "@sendt-media/campaign";

export const CampaignPage: React.FC = () => {
    // Settings
    const { getSetting } = useCampaignSettings();
    const language = getSetting("language");
    const campaignId = getSetting("campaign_id");

    // URL params
    const { getParam } = useUrlParams();
    const offerId = getParam("offer_id");
    // ...other params

    // Postal code
    const { validatePostalcode, getAddressData } = usePostalCodeValidation({
        countryCode: language,
    });

    // Phone
    const { validatePhone } = usePhoneValidation({
        countryCode: language,
    });

    // SMS (optional)
    const { sendCode, verifyCode } = useSmsVerification({
        countryCode: language,
        campaign_id: campaignId,
    });

    // Signup
    const { processSignup } = useSignupProcessing({
        onSignupSuccess: () => {},
        onSignupError: () => {},
    });

    return (
        <form
            onSubmit={() =>
                processSignup({
                    /* data */
                })
            }>
            {/* Form fields with basic validation */}
        </form>
    );
};
```

## Customization

-   Modify form layout/styles in `src/components`.
-   Extend validation rules in `src/hooks` or inline.
-   Add tracking pixels or analytics as needed.

## Contributing

Feel free to open issues or PRs to improve this template.

---

_This template relies on the **`@sendt-media/campaign`** npm package for all core campaign functionality._
