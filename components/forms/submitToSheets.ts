"use client";

export type WebsiteFormType = "franchisee" | "contact";

export async function submitToSheets(formType: WebsiteFormType, values: FormData) {
  const endpoint = process.env.NEXT_PUBLIC_FORM_AUTOMATION_URL;
  if (!endpoint) throw new Error("Form automation has not been configured.");

  await fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      formType,
      name: values.get("name"),
      email: values.get("email"),
      phone: values.get("phone"),
      message: values.get("message"),
    }),
  });
}
