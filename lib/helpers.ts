// Next
import { NextResponse } from "next/server";

// Utils
import n2words from "n2words";

// Currencies
import currenciesDetails from "@/public/assets/data/currencies.json";
import { CurrencyDetails } from "@/types";

/**
 * Formats a number with commas and decimal places
 *
 * @param {number} number - Number to format
 * @returns {string} A styled number to be displayed on the invoice
 */
const formatNumberWithCommas = (number: number) => {
    return number.toLocaleString("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

/**
 * @param {string} currency - The currency that is currently selected 
 * @returns {Object} - An object containing the currency details as
 * ```
 * {
    "currency": "United Arab Emirates Dirham",
    "decimals": 2,
    "beforeDecimal": "Dirham",
    "afterDecimal": "Fils"
 }
 */
const fetchCurrencyDetails = (currency: string): CurrencyDetails | null => {
    const data = currenciesDetails as Record<string, CurrencyDetails>;
    const currencyDetails = data[currency];
    return currencyDetails || null;
};

/**
 * Helper function to decline Serbian currency names based on number
 *
 * @param {number} num - Number to check
 * @param {string} singular - Singular form (e.g., "dolar")
 * @param {string} few - Few form (e.g., "dolara")
 * @param {string} many - Many form (e.g., "dolara")
 * @returns {string} Properly declined word
 */
const getSerbianDeclension = (
    num: number,
    singular: string,
    few: string,
    many: string
): string => {
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;

    if (lastDigit === 1 && lastTwoDigits !== 11) {
        return singular;
    } else if (
        lastDigit >= 2 &&
        lastDigit <= 4 &&
        (lastTwoDigits < 12 || lastTwoDigits > 14)
    ) {
        return few;
    } else {
        return many;
    }
};

/**
 * Turns a number into words for invoices
 *
 * @param {number} price - Number to format
 * @returns {string} Number in words
 */
const formatPriceToString = (
    price: number,
    currency: string,
    language: string = "English"
): string => {
    // Initialize variables
    let decimals: number;
    let beforeDecimal: string | null = null;
    let afterDecimal: string | null = null;

    const currencyDetails = fetchCurrencyDetails(currency);

    // If currencyDetails is available, use its values, else dynamically set decimals
    if (currencyDetails) {
        decimals = currencyDetails.decimals;
        beforeDecimal = currencyDetails.beforeDecimal;
        afterDecimal = currencyDetails.afterDecimal;
    } else {
        // Dynamically get decimals from the price if currencyDetails is null
        const priceString = price.toString();
        const decimalIndex = priceString.indexOf(".");
        decimals = decimalIndex !== -1 ? priceString.split(".")[1].length : 0;
    }

    // Ensure the price is rounded to the appropriate decimal places
    const roundedPrice = parseFloat(price.toFixed(decimals));

    // Split the price into integer and fractional parts
    const integerPart = Math.floor(roundedPrice);

    const fractionalMultiplier = Math.pow(10, decimals);
    const fractionalPart = Math.round(
        (roundedPrice - integerPart) * fractionalMultiplier
    );

    const langCode = language === "Srpski" ? "sr" : "en";

    // Convert the integer part to words with a capitalized first letter
    const integerPartInWords = n2words(integerPart, { lang: langCode }).replace(
        /^\w/,
        (c) => c.toUpperCase()
    );

    // Convert fractional part to words
    const fractionalPartInWords =
        fractionalPart > 0 ? n2words(fractionalPart, { lang: langCode }) : null;

    // Handle zero values for both parts
    if (integerPart === 0 && fractionalPart === 0) {
        return language === "Srpski" ? "Nula" : "Zero";
    }

    // Combine the parts into the final string
    let result = integerPartInWords;

    // Check if beforeDecimal is not null
    if (beforeDecimal !== null) {
        let currencyName = beforeDecimal;

        // Apply Serbian declension for Dollar
        if (language === "Srpski" && beforeDecimal === "Dollar") {
            currencyName = getSerbianDeclension(
                integerPart,
                "dolar",
                "dolara",
                "dolara"
            );
        }

        // Apply Serbian declension for Dinar
        if (language === "Srpski" && beforeDecimal === "Dinar") {
            currencyName = getSerbianDeclension(
                integerPart,
                "dinar",
                "dinara",
                "dinara"
            );
        }

        result += ` ${currencyName}`;
    }

    if (fractionalPartInWords) {
        const connectorAnd = language === "Srpski" ? " i " : " and ";
        const connectorPoint = language === "Srpski" ? " zarez " : " point ";

        // Check if afterDecimal is not null
        if (afterDecimal !== null) {
            let fractionalCurrencyName = afterDecimal;

            // Apply Serbian declension for Cents
            if (
                language === "Srpski" &&
                (afterDecimal === "Cent" || afterDecimal === "Cents")
            ) {
                fractionalCurrencyName = getSerbianDeclension(
                    fractionalPart,
                    "cent",
                    "centa",
                    "cenata"
                );
            }

            // Apply Serbian declension for Paras
            if (
                language === "Srpski" &&
                (afterDecimal === "Para" || afterDecimal === "Paras")
            ) {
                fractionalCurrencyName = getSerbianDeclension(
                    fractionalPart,
                    "para",
                    "pare",
                    "para"
                );
            }

            // Concatenate the after decimal and fractional part
            result += `${connectorAnd}${fractionalPartInWords} ${fractionalCurrencyName}`;
        } else {
            // If afterDecimal is null, concatenate the fractional part
            result += `${connectorPoint}${fractionalPartInWords}`;
        }
    }

    return result;
};

/**
 * This method flattens a nested object. It is used for xlsx export
 *
 * @param {Record<string, T>} obj - A nested object to flatten
 * @param {string} parentKey - The parent key
 * @returns {Record<string, T>} A flattened object
 */
const flattenObject = <T>(
    obj: Record<string, T>,
    parentKey = ""
): Record<string, T> => {
    const result: Record<string, T> = {};

    for (const key in obj) {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            const flattened = flattenObject(
                obj[key] as Record<string, T>,
                parentKey + key + "_"
            );
            for (const subKey in flattened) {
                result[parentKey + subKey] = flattened[subKey];
            }
        } else {
            result[parentKey + key] = obj[key];
        }
    }

    return result;
};

/**
 * A method to validate an email address
 *
 * @param {string} email - Email to validate
 * @returns {boolean} A boolean indicating if the email is valid
 */
const isValidEmail = (email: string) => {
    // Regular expression for a simple email pattern
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
};

/**
 * A method to check if a string is a data URL
 *
 * @param {string} str - String to check
 * @returns {boolean} Boolean indicating if the string is a data URL
 */
const isDataUrl = (str: string) => str.startsWith("data:");

/**
 * Dynamically imports and retrieves an invoice template React component based on the provided template ID.
 *
 * @param {number} templateId - The ID of the invoice template.
 * @returns {Promise<React.ComponentType<any> | null>} A promise that resolves to the invoice template component or null if not found.
 * @throws {Error} Throws an error if there is an issue with the dynamic import or if a default template is not available.
 */
const getInvoiceTemplate = async (templateId: number) => {
    // Dynamic template component name
    const componentName = `InvoiceTemplate${templateId}`;

    try {
        const module = await import(
            `@/app/components/templates/invoice-pdf/${componentName}`
        );
        return module.default;
    } catch (err) {
        console.error(`Error importing template ${componentName}: ${err}`);

        // Provide a default template
        return null;
    }
};

/**
 * Convert a file to a buffer. Used for sending invoice as email attachment.
 * @param {File} file - The file to convert to a buffer.
 * @returns {Promise<Buffer>} A promise that resolves to a buffer.
 */
const fileToBuffer = async (file: File) => {
    // Convert Blob to ArrayBuffer
    const arrayBuffer = await new NextResponse(file).arrayBuffer();

    // Convert ArrayBuffer to Buffer
    const pdfBuffer = Buffer.from(arrayBuffer);

    return pdfBuffer;
};

export {
    formatNumberWithCommas,
    formatPriceToString,
    flattenObject,
    isValidEmail,
    isDataUrl,
    getInvoiceTemplate,
    fileToBuffer,
};
