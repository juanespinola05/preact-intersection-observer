import { Ref } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

type Entry = IntersectionObserverEntry | undefined;
type InView = boolean;
type TriggerOnce = boolean;

interface ObserverOptions {
  rootMargin?: IntersectionObserverInit["rootMargin"];
  threshold?: IntersectionObserverInit["threshold"];
  defaultInView?: InView;
  triggerOnce?: TriggerOnce;
}

export const useObserver = <T extends HTMLElement>(
  options?: ObserverOptions
): [ref: Ref<T>, inView: InView, entry: Entry] => {
  const [inView, setInView] = useState<InView>(options?.defaultInView || false);
  const observer = useRef<IntersectionObserver>();
  const entry = useRef<Entry>();
  const ref = useRef<T>(null);

  if (typeof window !== "undefined" && !observer.current) {
    observer.current = new IntersectionObserver(
      (e) => {
        entry.current = e[0];
        setInView(e[0].isIntersecting);
      },
      {
        ...options,
        root: ref.current,
      }
    );
  }

  useEffect(() => {
    if (!entry.current) {
      observer.current.observe(ref.current);
    } else if (options?.triggerOnce) {
      observer.current.unobserve(ref.current);
    }
  }, [ref, inView, options]);

  return [ref, inView, entry.current];
};
