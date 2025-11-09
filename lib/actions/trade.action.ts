"use server";

export async function createTrade(formData: FormData) {
  // Placeholder for DB logic (PostgreSQL etc.)
  const pair = formData.get("pair") as string;
  const type = formData.get("type") as string;
  const result = formData.get("result") as string;
  const profit = formData.get("profit") as string;

  console.log("Server Action: Trade Created =>", {
    pair,
    type,
    result,
    profit,
  });

  // Simulate delay
  await new Promise((r) => setTimeout(r, 500));

  // Return mock trade (replace with db insert result)
  return { id: Date.now(), pair, type, result, profit };
}
