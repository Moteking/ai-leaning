const BASE = "";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `API error: ${res.status}`);
  }

  return data;
}

export const api = {
  auth: {
    register: (body: Record<string, unknown>) =>
      apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
    me: () => apiFetch("/api/auth/me"),
    logout: () => {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    },
  },
  campaigns: {
    list: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return apiFetch(`/api/campaigns${qs}`);
    },
    create: (body: Record<string, unknown>) =>
      apiFetch("/api/campaigns", { method: "POST", body: JSON.stringify(body) }),
    apply: (body: { campaignId: string; message?: string; proposedRate?: number }) =>
      apiFetch("/api/campaigns/apply", { method: "POST", body: JSON.stringify(body) }),
    updateApplicationStatus: (body: { applicationId: string; status: string }) =>
      apiFetch("/api/campaigns/status", { method: "PATCH", body: JSON.stringify(body) }),
  },
  creators: {
    list: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return apiFetch(`/api/creators${qs}`);
    },
  },
  messages: {
    list: () => apiFetch("/api/messages"),
    send: (body: { recipientId: string; content: string; campaignTitle?: string }) =>
      apiFetch("/api/messages/send", { method: "POST", body: JSON.stringify(body) }),
  },
  notifications: {
    list: () => apiFetch("/api/notifications"),
    markRead: (notificationId: string) =>
      apiFetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ notificationId }),
      }),
    markAllRead: () =>
      apiFetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ markAllRead: true }),
      }),
  },
};
