import { notFound } from "next/navigation";

// P1 wires this to the generated registry index (slug -> dynamic import).
// Until entries exist, every slug is a 404.
export function generateStaticParams(): { slug: string }[] {
  return [];
}

export default async function ViewPage(_props: PageProps<"/view/[slug]">) {
  notFound();
}
