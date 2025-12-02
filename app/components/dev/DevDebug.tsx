"use client";

// Next
import { Link } from "@/i18n/navigation";

// Next Intl
import { useLocale } from "next-intl";

// RHF
import { useFormContext } from "react-hook-form";

// Component
import { BaseButton } from "@/app/components";

// Variables
import { FORM_FILL_VALUES, LOCALES } from "@/lib/variables";

type DevDebugProps = {};

const DevDebug = ({}: DevDebugProps) => {
    const { reset, formState } = useFormContext();
    const locale = useLocale();

    const handleFillForm = () => {
        const currentLocale = LOCALES.find((l) => l.code === locale);
        const language = currentLocale?.name || "English";
        const currency = locale === "sr" ? "RSD" : "USD";

        reset({
            ...FORM_FILL_VALUES,
            details: {
                ...FORM_FILL_VALUES.details,
                language,
                currency,
            },
        });
    };

    return (
        <div className="flex border-2 border-red-500 rounded-md">
            <div className="flex flex-col">
                <b>DEV:</b>
                Form: {formState.isDirty ? "Dirty" : "Clean"}
                <BaseButton
                    tooltipLabel="Form Test Fill"
                    variant="outline"
                    onClick={handleFillForm}
                >
                    Fill in the form
                </BaseButton>
            </div>

            <div className="flex flex-col">
                <Link href={`/template/1`}>Template 1</Link>
                <Link href={`/template/2`}>Template 2</Link>
            </div>
        </div>
    );
};

export default DevDebug;
