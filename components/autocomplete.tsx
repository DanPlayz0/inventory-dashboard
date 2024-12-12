import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";

export interface AutocompleteSelectProps {
  options: string[];
  value?: string;
  placeholder: string;
  onChange: (value: string) => void;
  onAddNewOption?: (value: string) => void;
  inputId?: string;
}

export default function AutocompleteSelect(props: AutocompleteSelectProps) {
  const { options, value, onChange, placeholder, onAddNewOption, inputId } = props;
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value || "");
  }, [value])

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase()) ||
    searchTerm.toLowerCase().split('').every(char => 
      option.toLowerCase().includes(char)
    )
  );

  const displayOptions = searchTerm && !options.includes(searchTerm)
    ? [...filteredOptions, `Add "${searchTerm}" as new option`]
    : filteredOptions;

  const handleSelect = (option: string) => {
    if (option.startsWith('Add "')) {
      const newOption = searchTerm.trim();
      if (typeof onAddNewOption == "function") onAddNewOption(newOption);
      onChange(newOption);
      setSearchTerm(newOption)
    } else {
      onChange(option);
      setSearchTerm(option);
    }
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < displayOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : displayOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(displayOptions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    if (isOpen && selectedIndex >= 0 && dropdownRef.current) {
      const selectedElement = dropdownRef.current.children[selectedIndex];
      if (selectedElement instanceof HTMLElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && event.target instanceof Node && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <div className="relative">
        <input
          type="text"
          id={inputId}
          className="w-full p-2 pr-8 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
          value={searchTerm || ""}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <ChevronDown 
          className={`absolute right-2 top-3 h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto"
        >
          {displayOptions.length > 0 ? (
            displayOptions.map((option, index) => (
              <div
                key={option}
                className={`p-2 cursor-pointer transition-colors duration-150
                  ${index === selectedIndex ? 'bg-blue-100' : 'hover:bg-gray-100'}
                  ${option.startsWith('Add "') ? 'text-blue-600 font-medium' : ''}
                `}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500 text-center">No matches found</div>
          )}
        </div>
      )}
    </div>
  );
}