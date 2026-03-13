import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    username?: string;
    email?: string;
    portfolioBalance: number;
    cashBalance: number;
    wallet?: string;
    proxyWallet?: string;
    proxyStatus?: string;
    proxy_tx_hash?: string;
    isTradingEnabled?: boolean;
    isUSDCapproved?: boolean;
    token?: string;
  } | null;
  onboardingStep: "none" | "username" | "email";
  isTradingModalOpen: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  onboardingStep: "none",
  isTradingModalOpen: false,
};

/**
 * Determine what onboarding step to start at for this user.
 * Returns "none" if everything is already done.
 */
function resolveOnboardingStep(
  username?: string,
  email?: string,
  isTradingEnabled?: boolean
): AuthState["onboardingStep"] {
  // Skip ALL onboarding if trading is already fully enabled
  if (isTradingEnabled) return "none";
  // Username step only needed if not set
  if (!username) return "username";
  // Email step only needed if not set
  if (!email) return "email";
  // Both set but trading not yet enabled — skip onboarding, TradingModal will open
  return "none";
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        token: string;
        wallet: string;
        proxyWallet?: string;
        proxyStatus?: string;
        isTradingEnabled?: boolean;
        isUSDCapproved?: boolean;
        username?: string;
        email?: string;
      } | undefined>
    ) => {
      state.isAuthenticated = true;
      state.user = {
        portfolioBalance: 0,
        cashBalance: 0,
        ...action.payload,
      };

      const u = action.payload;

      // If trading is already enabled — nothing to show
      if (u?.isTradingEnabled) {
        state.onboardingStep = "none";
        state.isTradingModalOpen = false;
        return;
      }

      // Resolve where in the onboarding flow to start
      const step = resolveOnboardingStep(u?.username, u?.email, u?.isTradingEnabled);
      state.onboardingStep = step;

      // If onboarding is already done (username + email set) but trading not yet enabled,
      // open the TradingModal directly
      if (step === "none" && !u?.isTradingEnabled) {
        state.isTradingModalOpen = true;
      }
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.onboardingStep = "none";
      state.isTradingModalOpen = false;
    },

    updateUser: (
      state,
      action: PayloadAction<Partial<NonNullable<AuthState["user"]>>>
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    nextStep: (state) => {
      const isTradingEnabled = state.user?.isTradingEnabled;

      if (state.onboardingStep === "username") {
        // Only go to email step if email is not already set
        if (!state.user?.email) {
          state.onboardingStep = "email";
        } else {
          // Email already set — skip to TradingModal if needed
          state.onboardingStep = "none";
          if (!isTradingEnabled) {
            state.isTradingModalOpen = true;
          }
        }
      } else if (state.onboardingStep === "email") {
        state.onboardingStep = "none";
        // Only open TradingModal if not already enabled
        if (!isTradingEnabled) {
          state.isTradingModalOpen = true;
        }
      } else {
        state.onboardingStep = "none";
      }
    },

    setTradingModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isTradingModalOpen = action.payload;
    },

    setOnboardingStep: (
      state,
      action: PayloadAction<AuthState["onboardingStep"]>
    ) => {
      state.onboardingStep = action.payload;
    },

    addDemoFunds: (state) => {
      if (state.user) {
        state.user.cashBalance += 1000;
      }
    },
  },
});

export const {
  login,
  logout,
  updateUser,
  nextStep,
  setOnboardingStep,
  setTradingModalOpen,
  addDemoFunds,
} = authSlice.actions;

export default authSlice.reducer;
