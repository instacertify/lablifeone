"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolioEditor } from "@/components/editor/FolioEditor";
import { SeoSidecar } from "@/components/conservatory/SeoSidecar";
import type { SeoInput } from "@/lib/seo";

type Service = {
  id: string;
  name: string;
  slug: string;
  excerpt: string;
  description: string;
  standard: string | null;
  timeline: string | null;
  method: string | null;
  sample: string | null;
  notes: string | null;
  published: boolean;
};

type Child = {
  id: string;
  name: string;
  slug: string;
  excerpt: string;
  services: { id: string }[];
};

type ParentOption = { id: string; name: string; parentId: string | null };

type Props = {
  category: {
    id: string;
    name: string;
    slug: string;
    excerpt: string;
    description: string;
    image: string | null;
    accent: string;
    published: boolean;
    parentId: string | null;
    seo: (SeoInput & { path?: string; robots?: string }) | null;
    services: Service[];
    children: Child[];
  };
  parents: ParentOption[];
};

const emptyTest = {
  name: "",
  slug: "",
  excerpt: "",
  description: "",
  standard: "",
  timeline: "",
  method: "",
  sample: "",
  notes: "",
};

export function CategoryEditor({ category, parents }: Props) {
  const router = useRouter();
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [excerpt, setExcerpt] = useState(category.excerpt);
  const [description, setDescription] = useState(category.description);
  const [image, setImage] = useState(category.image || "");
  const [accent, setAccent] = useState(category.accent);
  const [parentId, setParentId] = useState(category.parentId || "");
  const [seo, setSeo] = useState<SeoInput & { path?: string; robots?: string }>(
    category.seo || {
      path: `/disciplines/${category.slug}`,
      title: `${category.name} | Metrra Lab`,
      description: category.excerpt,
    },
  );
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState(emptyTest);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState(emptyTest);
  const [childName, setChildName] = useState("");
  const [childExcerpt, setChildExcerpt] = useState("");
  const [testCsv, setTestCsv] = useState("");
  const [categoryCsv, setCategoryCsv] = useState("");

  const field = "w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm";

  async function save() {
    setStatus("Saving…");
    const response = await fetch(`/api/categories/${category.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        excerpt,
        description,
        image,
        accent,
        published: true,
        parentId,
      }),
    });
    await fetch("/api/seo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: seo.path || `/disciplines/${slug}`,
        title: seo.title || `${name} | Metrra Lab`,
        description: seo.description || excerpt,
        keywords: seo.keywords || "",
        ogTitle: seo.ogTitle || seo.title,
        ogDescription: seo.ogDescription || seo.description,
        ogImage: seo.ogImage || image,
        canonical: seo.canonical || `https://www.metrra.com/disciplines/${slug}`,
        robots: seo.robots || "index,follow",
        focusKeyword: seo.focusKeyword || name.toLowerCase(),
      }),
    });
    setStatus(response.ok ? "Discipline updated." : "Could not save.");
    router.refresh();
  }

  function toPayload(source: typeof emptyTest, fallbackName = name) {
    const serviceName = source.name.trim();
    const serviceSlug =
      source.slug.trim() || serviceName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return {
      name: serviceName,
      slug: serviceSlug,
      excerpt: source.excerpt || `${serviceName} within ${fallbackName}.`,
      description: source.description || `<p>Commission ${serviceName} from Metrra Lab.</p>`,
      standard: source.standard,
      timeline: source.timeline,
      method: source.method,
      sample: source.sample,
      notes: source.notes,
      categoryId: category.id,
      image,
      published: true,
    };
  }

  async function addService() {
    if (!draft.name.trim()) return;
    const response = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(draft)),
    });
    setStatus(response.ok ? "Test added." : "Could not add the test.");
    setDraft(emptyTest);
    router.refresh();
  }

  async function saveService(id: string) {
    const response = await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(editDraft)),
    });
    setStatus(response.ok ? "Test updated." : "Could not update the test.");
    setEditingId(null);
    router.refresh();
  }

  async function deleteService(id: string) {
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    setStatus("Test removed.");
    router.refresh();
  }

  async function addChild() {
    if (!childName.trim()) return;
    const childSlug = childName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: childName,
        slug: childSlug,
        excerpt: childExcerpt || `A subcategory of ${name}.`,
        description: `<p>${childExcerpt || `A subcategory of ${name}.`}</p>`,
        accent,
        image: image || "/images/labs/discipline.jpg",
        parentId: category.id,
      }),
    });
    setStatus(response.ok ? "Subcategory opened." : "Could not open the subcategory.");
    setChildName("");
    setChildExcerpt("");
    router.refresh();
  }

  async function uploadCsv(kind: "tests" | "categories") {
    const csv = kind === "tests" ? testCsv : categoryCsv;
    if (!csv.trim()) return;
    const path = kind === "tests" ? "/api/services/bulk" : "/api/categories/bulk";
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        kind === "tests"
          ? { categoryId: category.id, csv }
          : { parentId: category.id, csv },
      ),
    });
    const payload = await response.json().catch(() => ({}));
    setStatus(
      response.ok
        ? `Uploaded ${payload.created || 0} ${kind === "tests" ? "tests" : "subcategories"}.`
        : payload.error || "Upload failed.",
    );
    if (response.ok) {
      if (kind === "tests") setTestCsv("");
      else setCategoryCsv("");
      router.refresh();
    }
  }

  async function uploadFile(kind: "tests" | "categories", file: File) {
    const text = await file.text();
    if (kind === "tests") setTestCsv(text);
    else setCategoryCsv(text);
  }

  const parentChoices = parents.filter((item) => item.id !== category.id);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">Atelier</p>
          <h1 className="display mt-2 text-4xl">Edit discipline</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink/65">
            Food, cosmetics, electronics, metals, and polymers stay under Disciplines — never as
            separate top headings. Tests, standards, timelines, and subcategories are all editable here.
          </p>
        </div>
        <button onClick={save} className="rounded-full bg-ink px-5 py-2 text-[12px] tracking-[0.16em] text-white uppercase">
          Save wing
        </button>
      </div>
      {status && <p className="mt-3 text-sm text-ink/70">{status}</p>}
      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 display text-3xl" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className={field} />
            <select value={parentId} onChange={(e) => setParentId(e.target.value)} className={field}>
              <option value="">Top-level under Disciplines</option>
              {parentChoices.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image" className={field} />
            <select value={accent} onChange={(e) => setAccent(e.target.value)} className={field}>
              <option value="aqua">Aqua</option>
              <option value="iris">Iris</option>
              <option value="bronze">Bronze</option>
              <option value="jade">Jade</option>
            </select>
          </div>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={field} />
          <FolioEditor value={description} onChange={setDescription} />

          <section className="rounded-2xl border border-ink/10 p-4">
            <h3 className="display text-2xl">Subcategories</h3>
            <p className="mt-1 text-xs text-ink/55">
              Multiple categories can live under this discipline. Each gets its own public page and tests.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-ink/80">
              {category.children.map((child) => (
                <li key={child.id} className="flex items-center justify-between gap-3">
                  <span>
                    {child.name}
                    <span className="ml-2 text-[11px] text-ink/45">{child.services.length} tests</span>
                  </span>
                  <Link href={`/conservatory/atelier/${child.id}`} className="text-[11px] tracking-[0.14em] text-aqua uppercase">
                    Edit
                  </Link>
                </li>
              ))}
              {category.children.length === 0 && (
                <li className="text-ink/45">No subcategories yet.</li>
              )}
            </ul>
            <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <input
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="New subcategory name"
                className={field}
              />
              <input
                value={childExcerpt}
                onChange={(e) => setChildExcerpt(e.target.value)}
                placeholder="Short excerpt"
                className={field}
              />
              <button type="button" onClick={addChild} className="rounded-full bg-iris px-4 text-[11px] tracking-[0.14em] uppercase">
                Add
              </button>
            </div>
            <label className="mt-5 block text-[11px] tracking-[0.16em] text-ink/50 uppercase">
              Bulk upload subcategories (CSV)
            </label>
            <textarea
              value={categoryCsv}
              onChange={(e) => setCategoryCsv(e.target.value)}
              placeholder="name,slug,excerpt,accent"
              rows={4}
              className={`mt-2 ${field} font-mono text-xs`}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="cursor-pointer rounded-full border border-ink/20 px-4 py-1.5 text-[11px] tracking-[0.14em] uppercase">
                Choose CSV
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) uploadFile("categories", file);
                  }}
                />
              </label>
              <a href="/templates/categories-bulk.csv" className="text-[11px] text-aqua underline">
                Download template
              </a>
              <button type="button" onClick={() => uploadCsv("categories")} className="rounded-full bg-white px-4 py-1.5 text-[11px] tracking-[0.14em] text-ink uppercase">
                Upload categories
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-ink/10 p-4">
            <h3 className="display text-2xl">Tests in this discipline</h3>
            <p className="mt-1 text-xs text-ink/55">
              Each test carries a standard, timeline, method, sample, and notes — all generated from the Conservatory.
            </p>
            <ul className="mt-4 space-y-3">
              {category.services.map((service) => (
                <li key={service.id} className="rounded-xl border border-ink/10 p-3">
                  {editingId === service.id ? (
                    <TestFields value={editDraft} onChange={setEditDraft} field={field} />
                  ) : (
                    <div>
                      <p className="display text-xl">{service.name}</p>
                      <p className="mt-1 text-xs text-ink/55">
                        {service.standard || "Standard unset"} · {service.timeline || "Timeline unset"}
                      </p>
                    </div>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {editingId === service.id ? (
                      <button
                        type="button"
                        onClick={() => saveService(service.id)}
                        className="rounded-full bg-ink px-3 py-1 text-[11px] tracking-[0.14em] text-white uppercase"
                      >
                        Save test
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(service.id);
                          setEditDraft({
                            name: service.name,
                            slug: service.slug,
                            excerpt: service.excerpt,
                            description: service.description,
                            standard: service.standard || "",
                            timeline: service.timeline || "",
                            method: service.method || "",
                            sample: service.sample || "",
                            notes: service.notes || "",
                          });
                        }}
                        className="rounded-full border border-ink/20 px-3 py-1 text-[11px] tracking-[0.14em] uppercase"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteService(service.id)}
                      className="rounded-full border border-ink/20 px-3 py-1 text-[11px] tracking-[0.14em] uppercase"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
              {category.services.length === 0 && (
                <li className="text-sm text-ink/45">No tests yet. Add one or upload a CSV.</li>
              )}
            </ul>

            <div className="mt-6 border-t border-ink/10 pt-4">
              <p className="text-[11px] tracking-[0.16em] text-ink/50 uppercase">Add a test</p>
              <div className="mt-3">
                <TestFields value={draft} onChange={setDraft} field={field} />
              </div>
              <button type="button" onClick={addService} className="mt-3 rounded-full bg-iris px-4 py-2 text-[11px] tracking-[0.14em] uppercase">
                Add test
              </button>
            </div>

            <div className="mt-6 border-t border-ink/10 pt-4">
              <p className="text-[11px] tracking-[0.16em] text-ink/50 uppercase">
                Bulk upload tests and standards
              </p>
              <textarea
                value={testCsv}
                onChange={(e) => setTestCsv(e.target.value)}
                placeholder="name,standard,timeline,method,sample,notes,excerpt"
                rows={5}
                className={`mt-3 ${field} font-mono text-xs`}
              />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="cursor-pointer rounded-full border border-ink/20 px-4 py-1.5 text-[11px] tracking-[0.14em] uppercase">
                  Choose CSV
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) uploadFile("tests", file);
                    }}
                  />
                </label>
                <a href="/templates/tests-bulk.csv" className="text-[11px] text-aqua underline">
                  Download template
                </a>
                <button type="button" onClick={() => uploadCsv("tests")} className="rounded-full bg-white px-4 py-1.5 text-[11px] tracking-[0.14em] text-ink uppercase">
                  Upload tests
                </button>
              </div>
            </div>
          </section>
        </div>
        <SeoSidecar value={{ ...seo, content: description }} onChange={setSeo} />
      </div>
    </div>
  );
}

function TestFields({
  value,
  onChange,
  field,
}: {
  value: typeof emptyTest;
  onChange: (next: typeof emptyTest) => void;
  field: string;
}) {
  function set(key: keyof typeof emptyTest, next: string) {
    onChange({ ...value, [key]: next });
  }
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <input value={value.name} onChange={(e) => set("name", e.target.value)} placeholder="Test name" className={`sm:col-span-2 ${field}`} />
      <input value={value.slug} onChange={(e) => set("slug", e.target.value)} placeholder="Slug (optional)" className={field} />
      <input value={value.standard} onChange={(e) => set("standard", e.target.value)} placeholder="Standard (ISO / ASTM / FSSAI…)" className={field} />
      <input value={value.timeline} onChange={(e) => set("timeline", e.target.value)} placeholder="Timeline (e.g. 5–7 working days)" className={field} />
      <input value={value.method} onChange={(e) => set("method", e.target.value)} placeholder="Method" className={field} />
      <input value={value.sample} onChange={(e) => set("sample", e.target.value)} placeholder="Sample requirement" className={field} />
      <input value={value.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Notes" className={`sm:col-span-2 ${field}`} />
      <textarea value={value.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Short excerpt" className={`sm:col-span-2 ${field}`} />
    </div>
  );
}
