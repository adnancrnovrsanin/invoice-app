import React from "react";

// Components
import { InvoiceLayout } from "@/app/components";

// Helpers
import { formatNumberWithCommas, isDataUrl } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { InvoiceType } from "@/types";

// Translations
import { getInvoiceTranslation } from "@/lib/invoice_translations";

const InvoiceTemplate = (data: InvoiceType) => {
    const { sender, receiver, details } = data;
    const t = getInvoiceTranslation(details.language);

    return (
        <InvoiceLayout data={data}>
            <div className="flex justify-between">
                <div>
                    <h1 className="mt-2 text-lg md:text-xl font-semibold text-blue-600">
                        {sender.name}
                    </h1>
                </div>
                <div className="text-right">
                    {details.invoiceLogo && (
                        <div className="flex justify-end mb-2">
                            <img
                                src={details.invoiceLogo}
                                className="object-contain object-right"
                                style={{
                                    width: "auto",
                                    height: "auto",
                                    maxWidth: "140px",
                                    maxHeight: "100px",
                                }}
                                alt={`Logo of ${sender.name}`}
                            />
                        </div>
                    )}
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                        {t.invoice}
                    </h2>
                    <span className="mt-1 block text-gray-500">
                        {details.invoiceNumber}
                    </span>
                    <address className="mt-4 not-italic text-gray-800">
                        {sender.address}
                        <br />
                        {sender.zipCode}, {sender.city}
                        <br />
                        {sender.country}
                        <br />
                        {sender.vatNumber && (
                            <>
                                {t.taxId} {sender.vatNumber}
                                <br />
                            </>
                        )}
                        {sender.registrationNumber && (
                            <>
                                {t.regNo} {sender.registrationNumber}
                                <br />
                            </>
                        )}
                    </address>
                </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {t.billTo}
                    </h3>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {receiver.name}
                    </h3>
                    {}
                    <address className="mt-2 not-italic text-gray-500">
                        {receiver.address && receiver.address.length > 0
                            ? receiver.address
                            : null}
                        {receiver.zipCode && receiver.zipCode.length > 0
                            ? `, ${receiver.zipCode}`
                            : null}
                        <br />
                        {receiver.city}, {receiver.country}
                        <br />
                        {receiver.vatNumber && (
                            <>
                                {t.taxId} {receiver.vatNumber}
                                <br />
                            </>
                        )}
                        {receiver.registrationNumber && (
                            <>
                                {t.regNo} {receiver.registrationNumber}
                                <br />
                            </>
                        )}
                    </address>
                </div>
                <div className="sm:text-right space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                        <dl className="grid sm:grid-cols-6 gap-x-3">
                            <dt className="col-span-3 font-semibold text-gray-800">
                                {t.invoiceDate}
                            </dt>
                            <dd className="col-span-3 text-gray-500">
                                {new Date(
                                    details.invoiceDate
                                ).toLocaleDateString("en-US", DATE_OPTIONS)}
                            </dd>
                        </dl>
                        <dl className="grid sm:grid-cols-6 gap-x-3">
                            <dt className="col-span-3 font-semibold text-gray-800">
                                {t.dueDate}
                            </dt>
                            <dd className="col-span-3 text-gray-500">
                                {new Date(details.dueDate).toLocaleDateString(
                                    "en-US",
                                    DATE_OPTIONS
                                )}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>

            <div className="mt-3">
                <div className="border border-gray-200 p-1 rounded-lg space-y-1">
                    <div className="hidden sm:grid sm:grid-cols-5">
                        <div className="sm:col-span-2 text-xs font-medium text-gray-500 uppercase">
                            {t.item}
                        </div>
                        <div className="text-left text-xs font-medium text-gray-500 uppercase">
                            {t.qty}
                        </div>
                        <div className="text-left text-xs font-medium text-gray-500 uppercase">
                            {t.rate}
                        </div>
                        <div className="text-right text-xs font-medium text-gray-500 uppercase">
                            {t.amount}
                        </div>
                    </div>
                    <div className="hidden sm:block border-b border-gray-200"></div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-y-1">
                        {details.items.map((item, index) => (
                            <React.Fragment key={index}>
                                <div className="col-span-full sm:col-span-2 border-b border-gray-300">
                                    <p className="font-medium text-gray-800">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-600 whitespace-pre-line">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="border-b border-gray-300">
                                    <p className="text-gray-800">
                                        {item.quantity}
                                    </p>
                                </div>
                                <div className="border-b border-gray-300">
                                    <p className="text-gray-800">
                                        {item.unitPrice} {details.currency}
                                    </p>
                                </div>
                                <div className="border-b border-gray-300">
                                    <p className="sm:text-right text-gray-800">
                                        {item.total} {details.currency}
                                    </p>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="sm:hidden border-b border-gray-200"></div>
                </div>
            </div>

            <div className="mt-2 flex sm:justify-end">
                <div className="sm:text-right space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                        <dl className="grid sm:grid-cols-5 gap-x-3">
                            <dt className="col-span-3 font-semibold text-gray-800">
                                {t.subTotal}
                            </dt>
                            <dd className="col-span-2 text-gray-500">
                                {formatNumberWithCommas(
                                    Number(details.subTotal)
                                )}{" "}
                                {details.currency}
                            </dd>
                        </dl>
                        {details.discountDetails?.amount != undefined &&
                            details.discountDetails?.amount > 0 && (
                                <dl className="grid sm:grid-cols-5 gap-x-3">
                                    <dt className="col-span-3 font-semibold text-gray-800">
                                        {t.discount}
                                    </dt>
                                    <dd className="col-span-2 text-gray-500">
                                        {details.discountDetails.amountType ===
                                        "amount"
                                            ? `- ${details.discountDetails.amount} ${details.currency}`
                                            : `- ${details.discountDetails.amount}%`}
                                    </dd>
                                </dl>
                            )}
                        {details.taxDetails?.amount != undefined &&
                            details.taxDetails?.amount > 0 && (
                                <dl className="grid sm:grid-cols-5 gap-x-3">
                                    <dt className="col-span-3 font-semibold text-gray-800">
                                        {t.tax}
                                    </dt>
                                    <dd className="col-span-2 text-gray-500">
                                        {details.taxDetails.amountType ===
                                        "amount"
                                            ? `+ ${details.taxDetails.amount} ${details.currency}`
                                            : `+ ${details.taxDetails.amount}%`}
                                    </dd>
                                </dl>
                            )}
                        {details.shippingDetails?.cost != undefined &&
                            details.shippingDetails?.cost > 0 && (
                                <dl className="grid sm:grid-cols-5 gap-x-3">
                                    <dt className="col-span-3 font-semibold text-gray-800">
                                        {t.shipping}
                                    </dt>
                                    <dd className="col-span-2 text-gray-500">
                                        {details.shippingDetails.costType ===
                                        "amount"
                                            ? `+ ${details.shippingDetails.cost} ${details.currency}`
                                            : `+ ${details.shippingDetails.cost}%`}
                                    </dd>
                                </dl>
                            )}
                        <dl className="grid sm:grid-cols-5 gap-x-3">
                            <dt className="col-span-3 font-semibold text-gray-800">
                                {t.total}
                            </dt>
                            <dd className="col-span-2 text-gray-500">
                                {formatNumberWithCommas(
                                    Number(details.totalAmount)
                                )}{" "}
                                {details.currency}
                            </dd>
                        </dl>
                        {details.language === "Srpski" &&
                            (details.taxDetails?.amount === undefined ||
                                details.taxDetails?.amount === 0) && (
                                <div className="mt-2 text-right">
                                    <p className="text-sm text-gray-600">
                                        {t.vatNote}
                                    </p>
                                </div>
                            )}
                        {details.totalAmountInWords && (
                            <dl className="grid sm:grid-cols-5 gap-x-3">
                                <dt className="col-span-3 font-semibold text-gray-800">
                                    {t.totalInWords}
                                </dt>
                                <dd className="col-span-2 text-gray-500">
                                    <em>
                                        {details.totalAmountInWords}{" "}
                                        {details.currency}
                                    </em>
                                </dd>
                            </dl>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-end">
                <div className="max-w-[60%]">
                    <div className="my-4">
                        {details.additionalNotes && (
                            <div className="my-2">
                                <p className="font-semibold text-blue-600">
                                    {t.additionalNotes}
                                </p>
                                <p className="font-regular text-gray-800">
                                    {details.additionalNotes}
                                </p>
                            </div>
                        )}
                        {details.paymentTerms && (
                            <div className="my-2">
                                <p className="font-semibold text-blue-600">
                                    {t.paymentTerms}
                                </p>
                                <p className="font-regular text-gray-800">
                                    {details.paymentTerms}
                                </p>
                            </div>
                        )}
                        <div className="my-2">
                            <span className="font-semibold text-md text-gray-800">
                                {t.paymentInfo}
                                <p className="text-sm">
                                    {t.bank}{" "}
                                    {details.paymentInformation?.bankName}
                                </p>
                                <p className="text-sm">
                                    {t.accountName}{" "}
                                    {details.paymentInformation?.accountName}
                                </p>
                                {details.paymentInformation?.paymentMethod ===
                                "international_transfer" ? (
                                    <>
                                        {details.paymentInformation?.iban && (
                                            <p className="text-sm">
                                                {t.iban}{" "}
                                                {
                                                    details.paymentInformation
                                                        ?.iban
                                                }
                                            </p>
                                        )}
                                        {details.paymentInformation?.swift && (
                                            <p className="text-sm">
                                                {t.swift}{" "}
                                                {
                                                    details.paymentInformation
                                                        ?.swift
                                                }
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm">
                                        {t.accountNo}{" "}
                                        {
                                            details.paymentInformation
                                                ?.accountNumber
                                        }
                                    </p>
                                )}
                            </span>
                        </div>
                    </div>
                    {(details.contactEmail || details.contactPhone) && (
                        <>
                            <p className="text-gray-500 text-sm">
                                {t.contactInfo}
                            </p>
                            <div>
                                {details.contactEmail && (
                                    <p className="block text-sm font-medium text-gray-800">
                                        {details.contactEmail}
                                    </p>
                                )}
                                {details.contactPhone && (
                                    <p className="block text-sm font-medium text-gray-800">
                                        {details.contactPhone}
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>{" "}
                <div className="max-w-[40%] flex flex-col items-end">
                    {/* Signature */}
                    {details?.signature?.data &&
                    isDataUrl(details?.signature?.data) ? (
                        <div className="mt-6">
                            <p className="font-semibold text-gray-800">
                                {t.signature}
                            </p>
                            <img
                                src={details.signature.data}
                                width={120}
                                height={60}
                                alt={`Signature of ${sender.name}`}
                            />
                        </div>
                    ) : details.signature?.data ? (
                        <div className="mt-6">
                            <p className="text-gray-800">{t.signature}</p>
                            <p
                                style={{
                                    fontSize: 30,
                                    fontWeight: 400,
                                    fontFamily: `${details.signature.fontFamily}, cursive`,
                                    color: "black",
                                }}
                            >
                                {details.signature.data}
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </InvoiceLayout>
    );
};

export default InvoiceTemplate;
