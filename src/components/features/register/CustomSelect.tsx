import { useEffect, useRef, useState } from "react";
import { ChevronIcon, ComboBox, ComboLabel, ComboWrapper, Listbox, ListItem } from "./styles";

type DropdownOption = {
  value: string;
  label: string;
}

type CustomProps = {
  placeholder: string;
  options: DropdownOption[];
  value: string;
  onChange: (val: string) => void;
  id: string;
  $error?: boolean;
}

export const CustomSelect = ({ placeholder, options, value, onChange, id, $error }: CustomProps) => {

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (open && value && listRef.current) {
      const activeEl = listRef.current.querySelector("[data-active='true']") as HTMLElement;
      activeEl?.scrollIntoView({ block: "nearest" });
    }
  }, [open, value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const idx = options.findIndex(o => o.value === value);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) return setOpen(true);
      onChange(options[Math.min(idx + 1, options.length - 1)].value);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      onChange(options[Math.max(idx - 1, 0)].value);
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(o => !o);
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <ComboWrapper ref={ref}>
      <ComboBox
        $open={open}
        tabIndex={0}
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        onKeyDown={handleKeyDown}
        id={id}
        $error={$error} 
      >
        <ComboLabel $selected={!!selected}>
          {selected ? selected.label : placeholder}
        </ComboLabel>

        <ChevronIcon $open={open}>
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M6 9l6 6 6-6" fill="currentColor" />
          </svg>
        </ChevronIcon>
      </ComboBox>

      <Listbox ref={listRef} $open={open}>
        {options.map(opt => (
          <ListItem
            key={opt.value}
            $active={opt.value === value}
            data-active={opt.value === value}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
          >
            {opt.label}
          </ListItem>
        ))}
      </Listbox>
    </ComboWrapper>
  );
};

