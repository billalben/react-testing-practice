import { delay, http, HttpResponse } from "msw";
import { server } from "./mocks/server";

export const simulateDelay = (endpoint: string) => {
  // Simulate a delay for the given endpoint
  server.use(
    http.get(endpoint, async () => {
      //   await new Promise((resolve) => setTimeout(resolve, 1000));
      await delay();
      return HttpResponse.json([]);
    })
  );
};

export const simulateError = (endpoint: string) => {
  // Simulate an error for the given endpoint
  server.use(http.get(endpoint, () => HttpResponse.error()));
};
