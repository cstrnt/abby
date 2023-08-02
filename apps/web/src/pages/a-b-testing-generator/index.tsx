import { MarketingLayout } from "components/MarketingLayout";
import type { NextPageWithLayout } from "../_app";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  GetResponse,
  PostBody,
  PostResponse,
} from "pages/api/tools/ab-testing";
import styles from "./styles.module.css";
import { DashboardButton } from "components/DashboardButton";
import { LoadingSpinner } from "components/LoadingSpinner";
import { BrowserWindow } from "components/BrowserWindow";
import { useRef } from "react";
import { cn } from "lib/utils";
import { usePlausible } from "next-plausible";
import { TrackingEvent } from "lib/tracking";

export enum ABGeneratorTarget {
  CTAButton = "CTA Button",
  Headline = "Headline",
  Slogan = "Marketing Slogan",
}

export const MAX_TRIES = 5;

const QUERY_KEY = "ab-testing-generator";

const ABTestingGeneratorPage: NextPageWithLayout = () => {
  const plausible = usePlausible();
  const targetRef = useRef<HTMLSelectElement>(null);
  const queryClient = useQueryClient();
  const { data } = useQuery([QUERY_KEY], () =>
    fetch("/api/tools/ab-testing").then(
      (res) => res.json() as Promise<GetResponse>
    )
  );

  const generateResponseMutation = useMutation(
    (data: PostBody) =>
      fetch("/api/tools/ab-testing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((r) => r.json()) as Promise<PostResponse>,
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY]);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: PostBody = {
      text: formData.get("text") as string,
      count: Number(formData.get("count")),
      target: formData.get("target") as ABGeneratorTarget,
    };
    plausible(TrackingEvent.AB_TESTING_GENERATOR, {
      props: {
        target: data.target,
        count: data.count,
      },
    });
    generateResponseMutation.mutate(data);
  };

  const target = targetRef.current?.value as ABGeneratorTarget;

  const isMutating = generateResponseMutation.isLoading;

  return (
    <>
      <div className="mx-auto max-w-xl">
        <h1 className="text-center text-5xl font-bold">
          Generate your A/B Tests with <span className={styles.ai}>AI</span>
        </h1>
        <h2 className="mb-12 mt-10 text-center text-base font-normal">
          Want to get started with A/B testing? Let&apos;s generate some ideas!
          The A/BBY Generator will generate A/B tests for you to try on your
          website. Simply describe your business and choose the usecase for your
          A/B test and the A/BBY Generator will generate some ideas for you to
          try.
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label htmlFor="count">
            Number of Variants:
            <input
              type="number"
              name="count"
              id="count"
              min={1}
              max={5}
              defaultValue={3}
              className="block w-full rounded-md border border-gray-300 bg-transparent"
              required
            />
          </label>
          <label htmlFor="target">
            Type:
            <select
              name="target"
              id="target"
              className="block w-full rounded-md border border-gray-300 bg-transparent"
              ref={targetRef}
              defaultValue={ABGeneratorTarget.CTAButton}
              required
            >
              {Object.values(ABGeneratorTarget).map((target) => (
                <option key={target} value={target}>
                  {target}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="text">
            Describe your business here:
            <textarea
              name="text"
              id="text"
              className="block w-full rounded-md border border-gray-300 bg-transparent"
              placeholder="Streetwear clothing for young people"
              required
              rows={5}
            />
          </label>
          <DashboardButton
            type="submit"
            className="flex justify-center space-x-2 bg-accent-background px-4 py-2 text-accent-foreground"
            aria-busy={isMutating}
            disabled={isMutating}
          >
            {isMutating && <LoadingSpinner />}
            <span>Generat{isMutating ? "ing.." : "e"}</span>
          </DashboardButton>
          <span className="text-right text-sm text-primary-foreground-muted">
            You have {data?.triesLeft ?? MAX_TRIES} tries left.
          </span>
        </form>
      </div>
      <div className="mx-auto my-8 grid w-full max-w-7xl grid-cols-2 items-center gap-6">
        {generateResponseMutation.isSuccess &&
          Object.entries(generateResponseMutation.data.data).map(
            ([key, value]) => (
              <BrowserWindow key={key} className="min-h-[250px]">
                <div className="flex flex-col items-center space-y-5 p-3">
                  <h1
                    className={cn(
                      "text-center text-xl font-bold",
                      target !== ABGeneratorTarget.Headline && "blur-md"
                    )}
                  >
                    {target === ABGeneratorTarget.Headline ? value : "Headline"}
                  </h1>
                  <button
                    type="button"
                    className={cn(
                      "rounded-lg px-5 py-2.5 font-medium focus:ring-4",
                      "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700  text-white shadow-lg shadow-purple-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-purple-300 dark:shadow-lg dark:shadow-purple-800/80 dark:focus:ring-purple-800",
                      target !== ABGeneratorTarget.CTAButton && "blur-md"
                    )}
                  >
                    {target === ABGeneratorTarget.CTAButton
                      ? value
                      : "Click me!"}
                  </button>
                  <p
                    className={cn(
                      "prose text-center text-primary-foreground",
                      target !== ABGeneratorTarget.Slogan && "blur-md"
                    )}
                  >
                    <b>Your Brand</b> -{" "}
                    {target === ABGeneratorTarget.Slogan
                      ? value
                      : "Lorem ipsum dolor sit amet, consectetur adipiscing elit"}
                  </p>
                </div>
              </BrowserWindow>
            )
          )}
      </div>
    </>
  );
};

ABTestingGeneratorPage.getLayout = (page) => (
  <MarketingLayout>{page}</MarketingLayout>
);

export default ABTestingGeneratorPage;
