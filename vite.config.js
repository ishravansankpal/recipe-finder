import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite needs this small config file to understand React (JSX)
export default defineConfig({
  plugins: [react()],
});
