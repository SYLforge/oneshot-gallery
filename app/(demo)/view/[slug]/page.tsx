import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demoIndex, demoSlugs } from "@/__generated__/registry-index";

export function generateStaticParams(): { slug: string }[] {
  return demoSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/view/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return {
    // Thin-content duplicate of the detail page — keep demos out of the index.
    robots: { index: false },
    alternates: { canonical: `/en/design/${slug}` },
  };
}

export default async function ViewPage({ params }: PageProps<"/view/[slug]">) {
  const { slug } = await params;
  const Demo = demoIndex[slug];
  if (!Demo) notFound();
  return <Demo />;
}
