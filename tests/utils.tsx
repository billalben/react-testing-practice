import { delay, http, HttpResponse } from "msw";
import { server } from "./mocks/server";
import { useAuth0, User } from "@auth0/auth0-react";
import { render } from "@testing-library/react";
import routes from "../src/routes";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
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

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
};

export const mockAuthState = (authState: AuthState) => {
  vi.mocked(useAuth0).mockReturnValue({
    ...authState,
    getAccessTokenSilently: vi.fn().mockResolvedValue("mocked-access-token"),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: vi.fn(),
    loginWithRedirect: vi.fn(),
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
    handleRedirectCallback: vi.fn(),
  });
};

export const navigateTo = (path: string) => {
  const router = createMemoryRouter(routes, {
    initialEntries: [path],
  });

  render(<RouterProvider router={router} />);
};
