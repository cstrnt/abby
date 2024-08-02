import { Hono } from "hono";
import OpenAI from "openai";
import { AIFlagRemovalService } from "server/services/AIFlagRemovalService";
import { apiKeyMiddleware } from "../v1_config";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_URL,
});

const flagRemovalService = new AIFlagRemovalService(openai);

export const flagAiRoute = new Hono().post(
  "/flag-removal",
  apiKeyMiddleware,
  zValidator(
    "json",
    z.object({
      flagName: z.string(),
      files: z.array(
        z.object({
          filePath: z.string(),
          fileContent: z.string(),
        })
      ),
    })
  ),
  async (c) => {
    const { files, flagName } = c.req.valid("json");
    const updated = await Promise.all(
      files.map(async (f) => {
        const updatedCode = await flagRemovalService.removeFlagFromCode(
          f.fileContent,
          flagName
        );
        if (!updatedCode) return null;
        return { filePath: f.filePath, fileContent: updatedCode };
      })
    );
    return c.json(updated);
  }
);
