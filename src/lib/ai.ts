import { scoreEmail, Evaluation } from "./scoring";
export interface AIProvider {
  evaluateResponse(text: string): Promise<Evaluation>;
  generateFeedback(facts: string[]): Promise<string>;
  roleplay(message: string): Promise<string>;
}
// Replace this provider with a server-only adapter; validate structured results against the rubric.
// This interface never writes mastery, selects missions, or supplies university facts.
export const fallbackProvider: AIProvider = {
  async evaluateResponse(text) {
    return scoreEmail(text);
  },
  async generateFeedback(facts) {
    return facts.join(" ");
  },
  async roleplay() {
    return "Try stating what happened, how it affects you, and a specific request. For example: “I have an early class. Could we agree on quiet hours?”";
  },
};
