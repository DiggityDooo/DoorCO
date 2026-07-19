import { spawn } from "child_process";

const rawArgs = process.argv.slice(2);
const args = [];

for (let i = 0; i < rawArgs.length; i++) {
  args.push(rawArgs[i]);
}

console.log("Starting Vite dev server with arguments:", args);

const child = spawn("npx", ["vite", "dev", ...args], {
  stdio: "inherit",
  shell: true,
});

child.on("close", (code) => {
  process.exit(code || 0);
});
