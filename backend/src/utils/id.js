import crypto from "crypto";

// Small dependency-free unique id generator (avoids needing the nanoid package).
export function nanoid() {
  return crypto.randomBytes(12).toString("hex");
}
