import { Check, ChevronDown, Search } from 'lucide-react';
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';

import { cn } from '@/src/lib/utils';

// TypeScript Generics (<T extends string | number>): Tái sử dụng cho mọi kiểu giá trị enum, string, number

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
    classNameWrapper?: string;
    disabled?: boolean;
    classNameInputSearch?: string;
    classNameSelect?: string;
    textNotFound?: string;
    showSearch?: boolean;
}

export function SearchableCombobox<T extends string | number>({
    options,
    value,
    onChange,
    placeholder = 'Chọn...',
    searchPlaceholder = 'Tìm...',
    classNameWrapper,
    disabled = false,
    classNameInputSearch,
    classNameSelect,
    textNotFound = 'Không tìm thấy',
    showSearch = true,
}: SearchableComboboxProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null); // Kiểm tra click-outside
    const searchInputRef = useRef<HTMLInputElement>(null); // Auto Focus khi mở menu
    const listRef = useRef<HTMLUListElement>(null); // Tính toán vị trí cuộn scrollIntoView
    const listboxId = useId();

    // Lọc danh sách theo từ khóa search
    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
    );

    const selectedOption = options.find((opt) => opt.value === value);

    // Focus ô tìm kiếm khi mở menu
    useEffect(() => {
        if (isOpen && showSearch) {
            const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        }
    }, [isOpen, showSearch]);

    // Đóng khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        // Lắng nghe sự kiện mousedown trên toàn bộ trang web
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Tự động cuộn theo phím mũi tên
    useEffect(() => {
        // .children là thuộc tính chuẩn của HTML DOM (HTMLCollection). Nó chứa danh sách tất cả các thẻ con nằm trực tiếp bên trong thẻ <ul>
        if (isOpen && listRef.current && listRef.current.children[highlightedIndex]) {
            const itemEl = listRef.current.children[highlightedIndex];

            // Đảm bảo thẻ <li> được highlight luôn nằm trong khung nhìn thấy của danh sách (không bị trôi ra ngoài vùng cuộn)
            itemEl.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex, isOpen]);

    const openMenu = useCallback(() => {
        setSearch('');
        setHighlightedIndex(0);
        setIsOpen(true);
    }, []);

    // Xử lý Keyboard Navigation (Bàn phím)
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (disabled) return;

            // Khi Menu chưa mở: Nhấn Enter, Mũi tên, hoặc phím space sẽ kích hoạt mở Menu
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
                    // Tăng index. Nếu đến cuối danh sách thì quay lại 0
                    setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    // Giảm index. Nếu ở vị trí 0 thì chuyển xuống cuối danh sách
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (filteredOptions[highlightedIndex]) {
                        // Chọn item tại vị trí highlightedIndex hiện tại và đóng menu
                        onChange(filteredOptions[highlightedIndex].value);
                        setIsOpen(false);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    // Đóng menu ngay lập tức và giữ focus tại Combobox hiện tại
                    // Có e.preventDefault() là để ngăn phím Escape kích hoạt các hành vi mặc định khác (như đóng Modal/Dialog cha nếu Combobox nằm trong 1 Popup)
                    setIsOpen(false);
                    break;
                case 'Tab':
                    // Đóng menu ngay lập tức
                    // Không có e.preventDefault() là để trình duyệt tự do chuyển con trỏ sang ô input / button tiếp theo trong Form. Đảm bảo
                    // người dùng dùng bàn phím không bị mắc kẹt (Focus Trap) và có thể Tab sang phần tử khác
                    setIsOpen(false);
                    break;
            }
        },
        [disabled, filteredOptions, highlightedIndex, isOpen, onChange, openMenu],
    );

    return (
        <div
            ref={containerRef}
            onKeyDown={handleKeyDown}
            className={cn('relative inline-block text-xs font-semibold', classNameWrapper)}
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
                    className={cn(
                        'h-3.5 w-3.5 text-slate-400 transition-transform duration-200',
                        isOpen && 'rotate-180',
                    )}
                />
            </button>

            {/* Menu Popup */}
            {isOpen && (
                <div className="animate-in fade-in absolute left-0 z-50 mt-1.5 w-full min-w-42.5 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/95 shadow-xl backdrop-blur-md duration-100">
                    {/* Ô tìm kiếm */}
                    {showSearch && (
                        <div
                            className={cn(
                                'flex items-center gap-1.5 border-b border-slate-800 bg-slate-950/60 p-1.5',
                                classNameInputSearch,
                            )}
                        >
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
                    )}

                    {/* Danh sách lựa chọn */}
                    <ul
                        id={listboxId}
                        ref={listRef}
                        role="listbox"
                        className={cn('max-h-48 space-y-0.5 overflow-y-auto p-1', classNameSelect)}
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
                                        className={cn(
                                            'flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors',
                                            isSelected && 'font-bold text-purple-300',
                                            isHighlighted
                                                ? 'bg-purple-600/30 text-purple-200'
                                                : 'text-slate-300 hover:bg-slate-800',
                                        )}
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
                            <li className="px-3 py-2 text-center text-xs text-slate-500">{textNotFound}</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
