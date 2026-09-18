import { NextResponse } from "next/server";

const RECIPIENT = "tonmay.production@gmail.com";
const MAX_TEXT = 1200;

type InquiryPayload = {
  projectType?: unknown;
  projectSummary?: unknown;
  location?: unknown;
  date?: unknown;
  usage?: unknown;
  budget?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
};

function clean(value: unknown, max = MAX_TEXT) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let payload: InquiryPayload;
  try {
    payload = (await request.json()) as InquiryPayload;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 180).toLowerCase();
  const projectType = clean(payload.projectType, 80);
  const projectSummary = clean(payload.projectSummary, 500);
  const location = clean(payload.location, 180);
  const date = clean(payload.date, 40);
  const usage = clean(payload.usage, 300);
  const budget = clean(payload.budget, 120);
  const phone = clean(payload.phone, 80);

  if (!name || !validEmail(email) || !projectType || !projectSummary || !location || !usage) {
    return NextResponse.json(
      { ok: false, message: "Please complete the required project and contact details." },
      { status: 400 },
    );
  }

  const form = new FormData();
  form.set("_subject", `New Tonmay project inquiry — ${projectType}`);
  form.set("_template", "table");
  form.set("_captcha", "false");
  form.set("_replyto", email);
  form.set("Name", name);
  form.set("Email", email);
  form.set("Phone", phone || "Not provided");
  form.set("Project type", projectType);
  form.set("What they need", projectSummary);
  form.set("Location", location);
  form.set("Date", date || "Not confirmed");
  form.set("Usage", usage);
  form.set("Budget", budget || "Not provided");

  try {
    const delivery = await fetch(`https://formsubmit.co/ajax/${RECIPIENT}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: form,
      cache: "no-store",
    });

    const result = (await delivery.json().catch(() => null)) as
      | { success?: boolean | string; message?: string }
      | null;
    const accepted = delivery.ok && (result?.success === true || result?.success === "true");

    if (!accepted) {
      return NextResponse.json(
        { ok: false, message: "The message service did not accept this submission. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "The message service is temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
}
