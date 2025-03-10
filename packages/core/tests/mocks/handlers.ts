import { rest } from "msw";
import { ABBY_BASE_URL, type AbbyDataResponse } from "../../src/shared";

const returnData: AbbyDataResponse = {
  tests: [
    {
      name: "test",
      weights: [1, 1, 1, 1],
    },
    {
      name: "test2",
      weights: [1, 0],
    },
  ],
  flags: [
    {
      name: "flag1",
      value: true,
    },
  ],
  remoteConfig: [{ name: "remoteConfig1", value: "asdf" }],
};

export const handlers = [
  rest.get(
    `${ABBY_BASE_URL}api/dashboard/:projectId/data`,
    (_req, res, ctx) => {
      return res(ctx.json(returnData));
    }
  ),
  rest.get(`${ABBY_BASE_URL}api/v2/data/:projectId`, (_req, res, ctx) => {
    return res(ctx.json(returnData));
  }),
];
