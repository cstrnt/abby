import { AppProps, type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { trpc } from "../utils/trpc";
import { ThemeProvider } from "next-themes";
import { DefaultSeo } from "next-seo";

import { env } from "env/client.mjs";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { AbbyProvider, withAbby, AbbyDevtools } from "lib/abby";
import { useRouter } from "next/router";
import { TooltipProvider } from "components/Tooltip";
import "@fontsource/martian-mono/600.css";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import "../styles/shadcn.css";
import "@code-hike/mdx/dist/index.css";
import PlausibleProvider from "next-plausible";

if (typeof window !== "undefined" && env.NEXT_PUBLIC_POSTHOG_KEY) {
  // checks that we are client-side
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
    },
  });
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const seoDescription = `Discover the benefits of using Abby, the open-source feature management and A/B testing SaaS. Increase transparency, collaboration, and trust. Try it now!`;

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, __ABBY_PROJECT_DATA__, ...pageProps },
}: AppPropsWithLayout) => {
  const router = useRouter();

  const currentPageUrl = `https://www.tryabby.com${router.asPath}`;
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <PostHogProvider client={posthog}>
      <PlausibleProvider domain="tryabby.com">
        <AbbyProvider initialData={__ABBY_PROJECT_DATA__}>
          {/* we render different devtools on the landing page */}
          {router.asPath !== "/" && <AbbyDevtools />}
          <ThemeProvider attribute="class" defaultTheme="dark">
            <TooltipProvider>
              <SessionProvider session={session}>
                <PlausibleProvider
                  domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? ""}
                >
                  <main className={`font-sans`}>
                    <DefaultSeo
                      defaultTitle="Abby - Open Source A/B Testing & Feature Flags"
                      titleTemplate="%s"
                      description={seoDescription}
                      canonical={currentPageUrl}
                      openGraph={{
                        url: currentPageUrl,
                        title: "Abby",
                        type: "website",
                        description: seoDescription,
                        images: [
                          {
                            url: `${
                              process.env.VERCEL_URL
                                ? `https://${process.env.VERCEL_URL}`
                                : "https://www.tryabby.com"
                            }/og.png`,
                            width: 1200,
                            height: 630,
                            alt: "Abby",
                            type: "image/png",
                          },
                        ],
                        siteName: "Abby",
                      }}
                    />
                    <Toaster />
                    {getLayout(<Component {...pageProps} />)}
                  </main>
                </PlausibleProvider>
              </SessionProvider>
            </TooltipProvider>
          </ThemeProvider>
        </AbbyProvider>
      </PlausibleProvider>
    </PostHogProvider>
  );
};

export default trpc.withTRPC(withAbby(MyApp));
