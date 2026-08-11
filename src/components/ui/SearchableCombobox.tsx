import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface ComboboxOption<T extends string | number> {
    value: T;
    label: string;
    icon?: React.ReactNode;
}

interface SearchableComboboxProps<T extends string | number> {
    options: ComboboxOption<T>[];
    value: T;
    onChange: (value: T) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    className?: string;
    disabled?: boolean;
}

export function SearchableCombobox<T extends string | number>({
    options,
    value,
    onChange,
    placeholder = 'Chọn...',
    searchPlaceholder = 'Tìm...',
    className,
    disabled = false,
}: SearchableComboboxProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const listboxId = useId();

    // Lọc danh sách theo từ khóa search
    const filteredOptions = options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()));

    const selectedOption = options.find((opt) => opt.value === value);

    // Focus ô tìm kiếm khi mở menu
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Đóng khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Tự động cuộn theo phím mũi tên
    useEffect(() => {
        if (isOpen && listRef.current && listRef.current.children[highlightedIndex]) {
            const itemEl = listRef.current.children[highlightedIndex] as HTMLElement;
            itemEl.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex, isOpen]);

    const openMenu = () => {
        setSearch('');
        setHighlightedIndex(0);
        setIsOpen(true);
    };

    // Xử lý Keyboard Navigation (Bàn phím)
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        if (!isOpen) {
            if (['Enter', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) {
                e.preventDefault();
                openMenu();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredOptions[highlightedIndex]) {
                    onChange(filteredOptions[highlightedIndex].value);
                    setIsOpen(false);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                break;
            case 'Tab':
                setIsOpen(false);
                break;
        }
    };

    return (
        <div
            ref={containerRef}
            onKeyDown={handleKeyDown}
            className={`relative inline-block text-xs font-semibold ${className}`}
        >
            {/* Trigger Button */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => {
                    if (isOpen) {
                        setIsOpen(false);
                    } else {
                        openMenu();
                    }
                }}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                className="flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-transparent px-2 py-1 text-slate-300 transition-colors hover:bg-slate-800/50 focus:ring-1 focus:ring-purple-500/50 focus:outline-none"
            >
                <span className="flex items-center gap-1.5 truncate">
                    {selectedOption?.icon}
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {/* Menu Popup */}
            {isOpen && (
                <div className="animate-in fade-in absolute left-0 z-50 mt-1.5 w-full min-w-42.5 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/95 shadow-xl backdrop-blur-md duration-100">
                    {/* Ô tìm kiếm */}
                    <div className="flex items-center gap-1.5 border-b border-slate-800 bg-slate-950/60 p-1.5">
                        <Search className="ml-1 h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setHighlightedIndex(0);
                            }}
                            placeholder={searchPlaceholder}
                            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                        />
                    </div>

                    {/* Danh sách lựa chọn */}
                    <ul
                        id={listboxId}
                        ref={listRef}
                        role="listbox"
                        className="max-h-48 space-y-0.5 overflow-y-auto p-1"
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt, idx) => {
                                const isSelected = opt.value === value;
                                const isHighlighted = idx === highlightedIndex;

                                return (
                                    <li
                                        key={String(opt.value)}
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        onMouseEnter={() => setHighlightedIndex(idx)}
                                        className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                                            isHighlighted
                                                ? 'bg-purple-600/30 text-purple-200'
                                                : 'text-slate-300 hover:bg-slate-800'
                                        } ${isSelected ? 'font-bold text-purple-300' : ''}`}
                                    >
                                        <span className="flex items-center gap-1.5 truncate">
                                            {opt.icon}
                                            {opt.label}
                                        </span>
                                        {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-purple-400" />}
                                    </li>
                                );
                            })
                        ) : (
                            <li className="px-3 py-2 text-center text-xs text-slate-500">Không tìm thấy</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
