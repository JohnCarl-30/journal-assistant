import { getFinalReportData } from "@/modules/final-report/models/final-report";

export default function ReportPrintPage({
  params,
}: {
  params: {
    documentId: string;
  };
}) {
  const report = getFinalReportData();

  return (
    <main className="min-h-screen bg-white px-4 py-8 print:px-0 print:py-0">
      <article className="mx-auto w-full max-w-[860px] rounded-[1.5rem] border border-[rgba(223,231,225,0.96)] bg-white px-8 py-10 shadow-paper print:max-w-none print:rounded-none print:border-0 print:px-0 print:py-0 print:shadow-none">
        <header className="border-b border-[rgba(24,51,45,0.08)] pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#70817b]">
            Final internship report
          </p>
          <h1 className="mt-4 font-heading text-5xl leading-none text-[#18332d]">
            Internship Narrative
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#70817b]">
            Print preview for document <span className="font-semibold">{params.documentId}</span>.
            This page is optimized for browser print-to-PDF export.
          </p>
        </header>

        <section className="mt-10 space-y-10">
          {report.blocks.map((block) => (
            <div key={block.id}>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#70817b]">
                {block.heading}
              </p>
              <p className="mt-4 text-[17px] leading-9 text-[#18332d]">{block.text}</p>
            </div>
          ))}
        </section>

        <footer className="mt-12 border-t border-[rgba(24,51,45,0.08)] pt-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {report.referenceGroups.map((group) => (
              <section key={group.id}>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#70817b]">
                  {group.label}
                </p>
                <div className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4 text-sm text-[#18332d]">
                      <span className="text-[#70817b]">{item.label}</span>
                      <span className="text-right font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </footer>
      </article>
    </main>
  );
}
