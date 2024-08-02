import { OpenAI } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { createHash } from "crypto";
import { redis } from "server/db/redis";
import { ABGeneratorTarget, MAX_TRIES } from "pages/a-b-testing-generator";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const incomingSchema = z.object({
  text: z.string().max(256),
  count: z.number().min(1).max(5),
  target: z.nativeEnum(ABGeneratorTarget),
});

export type PostBody = z.infer<typeof incomingSchema>;

const responseSchema = z.record(z.string(), z.string());

export type GetResponse = {
  triesLeft: number;
};

export type PostResponse = {
  data: Record<string, string>;
  triesLeft: number;
};

const getRedisKey = (hashedIp: string) => `tools:ab-testing:${hashedIp}`;

function getHashedIp(req: NextApiRequest) {
  const clientIp =
    ((req.headers["x-forwarded-for"] as string) || "")
      .split(",")
      .pop()
      ?.trim() ?? req.socket.remoteAddress;

  if (!clientIp) {
    throw new Error("Unable to get client IP");
  }

  return createHash("sha256").update(clientIp).digest("hex");
}

export default async function abTestingGenerator(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET": {
      if (process.env.NODE_ENV !== "production") {
        return res.json({
          triesLeft: MAX_TRIES,
        });
      }
      const hashedIp = getHashedIp(req);
      const tries = await redis.get(getRedisKey(hashedIp));

      res.json({
        triesLeft: MAX_TRIES - Number(tries || "0"),
      });

      break;
    }
    case "POST": {
      let tries = 0;

      try {
        // we only want to rate limit in production
        if (process.env.NODE_ENV === "production") {
          const hashedIp = getHashedIp(req);
          tries = await redis.incr(getRedisKey(hashedIp));

          if (tries > MAX_TRIES) {
            res.status(429).end();
            return;
          }
        }

        const { text, count, target } = incomingSchema.parse(req.body);

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "you are an a/b testing assistant. you help users to find alternative text for their current text to test in their a/b testing suite. Only return the data in a json object where the keys of the object are uppercase letters of the alphabet. The values should have normal case",
            },
            {
              role: "user",
              content: `give me ${count} different variants for a ${target} with the context: ${text}.`,
            },
          ],
          temperature: 1,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

        const responseMessage = response.choices[0]?.message?.content;

        if (!responseMessage) {
          throw new Error("Could not generate response");
        }

        const data = responseSchema.parse(JSON.parse(responseMessage));

        res.json({
          data,
          triesLeft: MAX_TRIES - tries,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not generate response" });
      } finally {
        break;
      }
    }
    default: {
      res.status(405).end();
      break;
    }
  }
}
