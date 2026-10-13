// @lfy def/documentation/pages.lfy:DocumentationSection
export const DocumentationSection = {
  startHere: "Start here",
  languageGuide: "Language guide",
  diveDeeper: "Dive deeper",
  reference: "Reference",
} as const;

// @lfy def/documentation/pages.lfy:DocumentationSection
export type DocumentationSection =
  (typeof DocumentationSection)[keyof typeof DocumentationSection];

// @lfy def/documentation/pages.lfy:DocumentationPage
export type DocumentationPage = {
  // @lfy def/documentation/pages.lfy:DocumentationPage.slug
  readonly slug: string;
  // @lfy def/documentation/pages.lfy:DocumentationPage.title
  readonly title: string;
  // @lfy def/documentation/pages.lfy:DocumentationPage.section
  readonly section: DocumentationSection;
  // @lfy def/documentation/pages.lfy:DocumentationPage.description
  readonly description: string;
};

// @lfy def/documentation/pages.lfy:documentationPages
export const documentationPages: readonly DocumentationPage[] = [
  {
    description:
      "Explore the ideas behind Elfie, learn the shape of the language, and find your way from intent to a first program.",
    section: "Start here",
    slug: "overview",
    title: "Overview",
  },
  {
    description:
      "Install the compiler, connect the agent that writes your code, and create your first project.",
    section: "Start here",
    slug: "getting-started",
    title: "Getting started",
  },
  {
    description:
      "Build a small command-line greeter in Python. You'll go from an empty project to code that has been generated, tested, and reviewed, and then you'll change it.",
    section: "Start here",
    slug: "your-first-program",
    title: "Your first program",
  },
  {
    description:
      "Under its agentic features, Elfie is a small, expression-based language. If you've written TypeScript, JavaScript, or Rust, most of it will look familiar. This page covers that common ground and points out the places where Elfie differs.",
    section: "Language guide",
    slug: "familiar-concepts",
    title: "Familiar concepts",
  },
  {
    description:
      "Every entity in Elfie has a context layer: its name, what it means, what it must do, and how it is tested. The compiler reads this layer to write your code, and the verifier reads it to check that code.",
    section: "Language guide",
    slug: "context-layer",
    title: "Context layer",
  },
  {
    description:
      "`d` and `fn` are the heart of Elfie. You write what must be true, the compiler writes the code, and a separate verifier checks the code against what you wrote.",
    section: "Language guide",
    slug: "agentic-structures",
    title: "Agentic structures",
  },
  {
    description:
      "`ace` runs a statement while your program is compiled, not when it runs. Use it to build criteria, lookup tables, and targets from code instead of writing them out by hand.",
    section: "Language guide",
    slug: "ace",
    title: "At Compile Execution (ace)",
  },
  {
    description:
      "A trait packages members, criteria, and rules so that many entities can share them. Traits are how Elfie composes behavior, and how targets, frameworks, and team conventions reach your code.",
    section: "Language guide",
    slug: "traits",
    title: "Traits",
  },
  {
    description:
      "A target is one thing your definitions are built into, such as an app, a crate, or a script. You declare targets in your source, assembled from layers that packages provide.",
    section: "Language guide",
    slug: "compile-targets",
    title: "Compile targets",
  },
  {
    description:
      "Tests pin down the cases that prose leaves open. Documentation explains your intent to the people who read your definitions, and to the compiler.",
    section: "Language guide",
    slug: "tests-and-documentation",
    title: "Tests & documentation",
  },
  {
    description:
      "The scope layer holds an entity's members. `$` reaches into it, traits add to it, and `with` attaches rules to a single member.",
    section: "Dive deeper",
    slug: "scope-management",
    title: "Scope management",
  },
  {
    description:
      "Targets are assembled from packages and are never built into the compiler. When no package covers your stack, or your team has rules every target should follow, write a layer of your own.",
    section: "Dive deeper",
    slug: "custom-compile-targets",
    title: "Custom compile targets",
  },
  {
    description:
      "Knowledge is reading material for the compiler: references, examples, and definitions it might not already know. It ships with your code, so every compile reads the same text.",
    section: "Dive deeper",
    slug: "knowledge",
    title: "Knowledge",
  },
  {
    description:
      "What happens between `elfie compile` and reviewed output, and the choices behind the design.",
    section: "Dive deeper",
    slug: "compiler-details",
    title: "Compiler details",
  },
  {
    description: "Every `elfie` command, option, and exit code.",
    section: "Reference",
    slug: "cli",
    title: "CLI reference",
  },
  {
    description:
      "What `elfie.json` holds, what the compiler and verifier commands receive, and the files Elfie writes.",
    section: "Reference",
    slug: "configuration",
    title: "Configuration",
  },
  {
    description:
      "`global` is the entity that stands for your whole program. What you add to it reaches every entity of every file.",
    section: "Reference",
    slug: "global-properties",
    title: "Global properties",
  },
  {
    description:
      "Every member of the context layer, for every kind of entity, and the records criteria, tests, knowledge, and commands are made of.",
    section: "Reference",
    slug: "context-api",
    title: "Context API",
  },
  {
    description:
      "The package `elfie`: the values every program works with, the system modules for files, paths, JSON, time, and processes, and the vocabulary targets are built from.",
    section: "Reference",
    slug: "standard-library",
    title: "Standard library",
  },
];

// @lfy def/documentation/pages.lfy:documentationPath
export function documentationPath(slug: string): string {
  // @lfy def/documentation/pages.lfy:documentationPath#documentationPath:documentationPath:869b7f10260e9ceda20576d0b242ae8ab8be06560b7c395471103da97fe6609c
  if (slug === "overview") {
    return "/docs";
  }
  // @lfy def/documentation/pages.lfy:documentationPath#documentationPath:documentationPath:f6917cef9ea4711094c34a7effa2d0aff3b393ad84f47e8c6675b4ba562175fa
  return `/docs/${slug}`;
}

// @lfy def/documentation/pages.lfy:documentationPageOf
export function documentationPageOf(
  slug: string,
): DocumentationPage | undefined {
  return documentationPages.find((page) => page.slug === slug);
}

// @lfy def/documentation/pages.lfy:DocumentationNeighbors
export type DocumentationNeighbors = {
  // @lfy def/documentation/pages.lfy:DocumentationNeighbors.previous
  readonly previous: DocumentationPage | undefined;
  // @lfy def/documentation/pages.lfy:DocumentationNeighbors.next
  readonly next: DocumentationPage | undefined;
};

// @lfy def/documentation/pages.lfy:neighborsOf
export function neighborsOf(slug: string): DocumentationNeighbors {
  const index = documentationPages.findIndex((page) => page.slug === slug);
  // @lfy def/documentation/pages.lfy:neighborsOf#neighborsOf:neighborsOf:ccdd1043805aedd00130a3ef20ff861ba5c08f1ceb537423157d4f736e72f058
  if (index === -1) {
    return { previous: undefined, next: undefined };
  }
  // @lfy def/documentation/pages.lfy:neighborsOf#neighborsOf:neighborsOf:311a75f234fec41f555ce7f6fb31ed41d84490d0d6cfee4204e203e6fb4cabc6
  // @lfy def/documentation/pages.lfy:neighborsOf#neighborsOf:neighborsOf:e73c9a26cb6b7636d170b2b364886af32ba2c70a4c1f5b18c75308940874a866
  return {
    previous: index > 0 ? documentationPages[index - 1] : undefined,
    next: documentationPages[index + 1],
  };
}

// @lfy def/documentation/pages.lfy:searchDocumentation#searchDocumentation:searchDocumentation:eddc4a90f3dfac235065a5b7d6eda4c7f46948ab75d4a8a46b9ebe1e1d30c740
function searchable(text: string): string {
  return text.replaceAll("`", "").toLowerCase();
}

// @lfy def/documentation/pages.lfy:searchDocumentation#searchDocumentation:searchDocumentation:c9d336deef5d2083402d082c38347b7c0607b896d6035dd973a0e983a2c6265d
const searchLimit = 8;

// @lfy def/documentation/pages.lfy:searchDocumentation
export function searchDocumentation(
  query: string,
): readonly DocumentationPage[] {
  const whole = searchable(query).trim();
  // @lfy def/documentation/pages.lfy:searchDocumentation#searchDocumentation:searchDocumentation:440bb2c08fc1f5f744f66a3a89f6d261707cb59a8f7f216470a459fda74af175
  if (whole === "") {
    return [];
  }
  const words = whole.split(/\s+/);
  // @lfy def/documentation/pages.lfy:searchDocumentation#searchDocumentation:searchDocumentation:eddc4a90f3dfac235065a5b7d6eda4c7f46948ab75d4a8a46b9ebe1e1d30c740
  const matches = documentationPages.filter((page) => {
    const text = `${searchable(page.title)} ${searchable(page.description)}`;
    return words.every((word) => text.includes(word));
  });
  // @lfy def/documentation/pages.lfy:searchDocumentation#searchDocumentation:searchDocumentation:048e51fd0b6a8f3356f91d23120d501bf835f8b79ae9db878379a5d1a487c7f8
  const inTitle = matches.filter((page) =>
    searchable(page.title).includes(whole),
  );
  const rest = matches.filter(
    (page) => !searchable(page.title).includes(whole),
  );
  // @lfy def/documentation/pages.lfy:searchDocumentation#searchDocumentation:searchDocumentation:c9d336deef5d2083402d082c38347b7c0607b896d6035dd973a0e983a2c6265d
  return [...inTitle, ...rest].slice(0, searchLimit);
}
