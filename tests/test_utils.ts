import { TextLineStream } from "./deps.ts";

export async function startFreshServer(options: Deno.CommandOptions) {
  const { serverProcess, lines, address } = await spawnServer(options);

  if (!address) {
    throw new Error("Server didn't start up");
  }

  return { serverProcess, lines, address };
}

export async function withFresh(
  name: string,
  fn: (address: string) => Promise<void>
) {
  const { lines, serverProcess, address } = await startFreshServer({
    args: ["run", "-A", name],
  });

  try {
    await fn(address);
  } finally {
    await lines.cancel();

    serverProcess.kill("SIGTERM");

    // Wait until the process exits
    await serverProcess.status;
  }
}

async function spawnServer(options: Deno.CommandOptions, expectErrors = false) {
  const serverProcess = new Deno.Command(Deno.execPath(), {
    ...options,
    stdin: "null",
    stdout: "piped",
    stderr: expectErrors ? "piped" : "inherit",
  }).spawn();

  const decoder = new TextDecoderStream();
  const lines: ReadableStream<string> = serverProcess.stdout
    .pipeThrough(decoder)
    .pipeThrough(new TextLineStream(), {
      preventCancel: true,
    });

  let address = "";
  for await (const line of lines) {
    const match = line.match(/https?:\/\/localhost:\d+/g);
    if (match) {
      address = match[0];
      break;
    }
  }

  return { serverProcess, lines, address };
}

/**
 * Format date to YYYY-MM-DD
 * @param date
 * @returns formatted date
 */
export function formatYearMonthDate(date: Date) {
  return `${date.getFullYear()}-${("00" + (date.getMonth() + 1)).slice(-2)}-${(
    "00" + date.getDate()
  ).slice(-2)}`;
}

export async function fetchSitemapAsText(address: string) {
  const resp = await fetch(address);
  return resp.text();
}
