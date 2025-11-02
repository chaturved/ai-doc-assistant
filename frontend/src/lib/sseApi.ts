import { fetchEventSource } from "@microsoft/fetch-event-source";
import api from "./api";

type FetchEventSourceFn = typeof fetchEventSource;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

const sseApi: FetchEventSourceFn = (path, init) => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;

  const attempt = async (): Promise<void> => {
    await fetchEventSource(url, {
      ...init,
      headers: init.headers ?? { "Content-Type": "application/json" },
      credentials: init.credentials ?? "include",
      openWhenHidden: init.openWhenHidden ?? true,
      async onopen(res) {
        if (init.onopen) await init.onopen(res);

        if (res.status === 401) {
          if (isRefreshing) {
            await new Promise<void>((resolve, reject) =>
              failedQueue.push({ resolve, reject })
            );
            // retry after refresh
            return attempt();
          }

          isRefreshing = true;
          try {
            await api.post("/v1/auth/refresh", null);
            processQueue();
            // retry original request
            return attempt();
          } catch (err) {
            processQueue(err);
            window.location.href = "/login";
            throw err;
          } finally {
            isRefreshing = false;
          }
        }

        if (!res.ok && res.status !== 401) {
          throw new Error(`HTTP ${res.status}`);
        }
      },
      onmessage(event) {
        if (init.onmessage) init.onmessage(event);
      },
      onerror(err) {
        if (init.onerror) init.onerror(err);
      },
    });
  };

  return attempt();
};

export default sseApi;
