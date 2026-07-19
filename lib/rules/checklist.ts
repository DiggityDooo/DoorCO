import type { ChecklistItem } from "../corpus/loader";
import type { ChecklistStatus, ProfileField } from "../types";

export interface ChecklistEval {
  id: string;
  label: string;
  description: string;
  status: ChecklistStatus;
  detail: string;
}

function daysSince(isoDate: string | null, now: Date): number | null {
  if (!isoDate) return null;
  const then = new Date(isoDate);
  if (Number.isNaN(then.getTime())) return null;
  const ms = now.getTime() - then.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function monthsSince(isoDate: string | null, now: Date): number | null {
  if (!isoDate) return null;
  const then = new Date(isoDate);
  if (Number.isNaN(then.getTime())) return null;
  return (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth());
}

function incomeCurrencyStatus(
  item: ChecklistItem,
  docDate: string | null,
  now: Date,
): { status: "expired" | "needs review"; detail: string } | null {
  if (!docDate) {
    return { status: "needs review", detail: "Income evidence needs a valid document date." };
  }

  const parsedDate = new Date(docDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return { status: "needs review", detail: "Income evidence has an invalid document date." };
  }

  const days = (item as ChecklistItem & { expiryDays?: number }).expiryDays ?? 0;
  if (days > 0) {
    const age = daysSince(docDate, now);
    if (age == null || age < 0) {
      return { status: "needs review", detail: "Income evidence date needs review." };
    }
    if (age > days) {
      return {
        status: "expired",
        detail: `Income evidence is ${age} days old (>${days}-day currency window).`,
      };
    }
    return null;
  }
  if (item.expiryMonths > 0) {
    const age = monthsSince(docDate, now);
    if (age == null || parsedDate > now) {
      return { status: "needs review", detail: "Income evidence date needs review." };
    }
    if (age > item.expiryMonths) {
      return {
        status: "expired",
        detail: `Income doc is ${age} months old (>${item.expiryMonths}).`,
      };
    }
  }
  return null;
}

export function evaluateChecklist(
  items: ChecklistItem[],
  fields: ProfileField[],
  now: Date = new Date(),
): ChecklistEval[] {
  const confirmed = fields.filter((f) => f.state === "confirmed" || f.state === "corrected");
  const hasIncome = confirmed.some((f) => {
    const value = Number(f.rawValue);
    return f.key === "annualIncome" && Number.isFinite(value) && value > 0;
  });
  const hasName = confirmed.some((f) => f.key === "applicantName" && f.rawValue.trim().length > 0);
  const docDate = confirmed.find((f) => f.key === "documentDate")?.rawValue ?? null;

  return items.map((item): ChecklistEval => {
    switch (item.id) {
      case "id-proof":
        return status(
          item,
          hasName ? "needs review" : "missing",
          hasName
            ? "A confirmed name is not proof of government-issued photo ID. Upload ID to verify."
            : "No confirmed photo ID document yet.",
        );
      case "income-proof": {
        if (!hasIncome) return status(item, "missing", "No confirmed income document.");
        const currency = incomeCurrencyStatus(item, docDate, now);
        if (currency) return status(item, currency.status, currency.detail);
        return status(item, "present", "Income document confirmed and within validity.");
      }
      case "household-composition":
        return status(
          item,
          confirmed.some((f) => f.key === "householdSize") ? "present" : "missing",
          confirmed.some((f) => f.key === "householdSize")
            ? "Household size confirmed."
            : "Household composition not yet confirmed.",
        );
      case "asset-statement":
        return status(item, "needs review", "Upload a bank/asset statement to confirm.");
      case "prior-address":
        return status(item, "needs review", "Add prior address / rental history.");
      case "ssn-or-itin":
        return status(item, "needs review", "Provide SSN/ITIN documentation when ready.");
      default:
        return status(item, "needs review", "Review required.");
    }
  });
}

function status(item: ChecklistItem, s: ChecklistStatus, detail: string): ChecklistEval {
  return { id: item.id, label: item.label, description: item.description, status: s, detail };
}
