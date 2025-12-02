"use client";

// RHF
import { useFormContext } from "react-hook-form";

// Components
import { FormInput, Subheading } from "@/app/components";

// ShadCn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

const PaymentInformation = () => {
    const { _t } = useTranslationContext();
    const { setValue, watch } = useFormContext();

    const paymentMethod = watch("details.paymentInformation.paymentMethod");
    const currentPaymentMethod = paymentMethod || "bank_transfer";

    const handleTabChange = (value: string) => {
        setValue("details.paymentInformation.paymentMethod", value);
    };

    return (
        <section>
            <Subheading>{_t("form.steps.paymentInfo.heading")}:</Subheading>

            <div className="mt-5">
                <Tabs
                    value={currentPaymentMethod}
                    onValueChange={handleTabChange}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="bank_transfer">
                            Domestic (Serbia)
                        </TabsTrigger>
                        <TabsTrigger value="international_transfer">
                            International
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex flex-wrap gap-10 mb-4">
                        <FormInput
                            name="details.paymentInformation.bankName"
                            label={_t("form.steps.paymentInfo.bankName")}
                            placeholder={_t("form.steps.paymentInfo.bankName")}
                            vertical
                        />
                        <FormInput
                            name="details.paymentInformation.accountName"
                            label={_t("form.steps.paymentInfo.accountName")}
                            placeholder={_t(
                                "form.steps.paymentInfo.accountName"
                            )}
                            vertical
                        />
                    </div>

                    <TabsContent value="bank_transfer">
                        <div className="flex flex-wrap gap-10">
                            <FormInput
                                name="details.paymentInformation.accountNumber"
                                label={_t(
                                    "form.steps.paymentInfo.accountNumber"
                                )}
                                placeholder={_t(
                                    "form.steps.paymentInfo.accountNumber"
                                )}
                                vertical
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="international_transfer">
                        <div className="flex flex-wrap gap-10">
                            <FormInput
                                name="details.paymentInformation.iban"
                                label={_t("form.steps.paymentInfo.iban")}
                                placeholder={_t("form.steps.paymentInfo.iban")}
                                vertical
                            />
                            <FormInput
                                name="details.paymentInformation.swift"
                                label={_t("form.steps.paymentInfo.swift")}
                                placeholder={_t("form.steps.paymentInfo.swift")}
                                vertical
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default PaymentInformation;
