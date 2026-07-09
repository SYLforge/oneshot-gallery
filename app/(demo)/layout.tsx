import "./demos.css";

// Bare root layout for full-screen demos. No site chrome, no locale, no fonts:
// each entry brings its own via registry/designs/<slug>/fonts.ts.
export default function DemoLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
