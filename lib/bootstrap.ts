import { connectDB } from "@/lib/mongodb";
import { seedIfNeeded } from "@/lib/seed";

declare global {
  var bootstrapPromise: Promise<void> | undefined;
}

export async function bootstrapData() {
  if (!global.bootstrapPromise) {
    global.bootstrapPromise = (async () => {
      await connectDB();
      await seedIfNeeded();
    })();
  }

  await global.bootstrapPromise;
}
