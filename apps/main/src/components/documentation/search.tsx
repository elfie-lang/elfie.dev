"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import {
  documentationPath,
  searchDocumentation,
} from "@/lib/documentation/pages";

import styles from "./search.module.css";

// @lfy def/documentation/search.lfy:SearchImage
export const SearchImage: string = "/elfie/docs-search.svg";

// @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
// @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
export function DocumentationSearch() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:DocumentationSearch:5b1ec26f0e4a8dd70039d2c407845835396f7bacea4675700b72c74722993d2c
  const results = searchDocumentation(text);
  const expanded = open && text !== "";
  const optionId = (index: number) => `${listId}-option-${index}`;

  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:DocumentationSearch:90452e8af00e782ce261a8d2d321319af5e7d62ddba1c9983605482cbc5793a1
  useEffect(() => {
    const focusSearch = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:DocumentationSearch:f81f35a519b72a5c51aa45f291b53b67507168abf50f58cb691f1b15311e24f6
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!expanded) {
      if (event.key === "ArrowDown" && text !== "") {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    const count = results.length;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((current) => (count === 0 ? -1 : (current + 1) % count));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((current) =>
        count === 0 ? -1 : current <= 0 ? count - 1 : current - 1,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      const page = results[highlight] ?? results[0];
      if (page) {
        setOpen(false);
        setHighlight(-1);
        router.push(documentationPath(page.slug));
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setHighlight(-1);
    }
  }

  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:DocumentationSearch:b8547279e78e29dc26f06c1a6b6f08fdf9199c7ddf459ba44f63c8ed0d79190b
  function onBlur(event: FocusEvent<HTMLInputElement>) {
    if (
      event.relatedTarget instanceof Node &&
      popupRef.current?.contains(event.relatedTarget)
    ) {
      return;
    }
    setOpen(false);
    setHighlight(-1);
  }

  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:fromFigma:c186aca8ddb4437469a640a0dfdab14793ae619e5d05cd0774dfefb8d730b39b
  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:DocumentationSearch:e9a59f3af2cc8d3b9afb3a594e4a7d3e849634f0f6c0427fd7e777b289b19d0f
  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:DocumentationSearch:5a1ed5a4b4bab25eacd9a3edb88d2dc7acda44dec07b56b6ed54c07e5689d580
  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:DocumentationSearch:1e9ac72f67e9e12343e69fb94ca52904af2793a533d1e4947f8c274baf904d2d
  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:DocumentationSearch:5b1ec26f0e4a8dd70039d2c407845835396f7bacea4675700b72c74722993d2c
  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:DocumentationSearch:f29388bda717a5ec5ffc24fd19caebf39b4c61208290bd209601867306b69a89
  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:DocumentationSearch:76cae05876b761a04a876fa41db7b9758d7c68c109e65376d2bc102810758f90
  return (
    <div className={styles.searchBox} role="search">
      <div className={styles.field}>
        <img
          className={styles.icon}
          src={SearchImage}
          alt=""
          width={17}
          height={17}
          decoding="async"
        />
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          role="combobox"
          placeholder="Search docs"
          aria-label="Search docs"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={
            expanded && results[highlight] ? optionId(highlight) : undefined
          }
          autoComplete="off"
          spellCheck={false}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setOpen(true);
            setHighlight(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
        <kbd className={styles.shortcut} aria-hidden="true">
          ⌘ K
        </kbd>
      </div>
      <div ref={popupRef} className={styles.popup} hidden={!expanded}>
        <div
          id={listId}
          className={styles.results}
          role="listbox"
          aria-label="Search results"
        >
          {expanded &&
            results.map((page, index) => (
              <NextLink
                key={page.slug}
                id={optionId(index)}
                className={styles.result}
                href={documentationPath(page.slug)}
                role="option"
                aria-selected={index === highlight}
                tabIndex={-1}
                onClick={() => {
                  setOpen(false);
                  setHighlight(-1);
                }}
              >
                <span className={styles.resultTitle}>{page.title}</span>
                <span className={styles.resultDescription}>
                  {page.description.replaceAll("`", "")}
                </span>
              </NextLink>
            ))}
        </div>
        {expanded && results.length === 0 && (
          <p className={styles.empty}>No pages match</p>
        )}
      </div>
    </div>
  );
}
