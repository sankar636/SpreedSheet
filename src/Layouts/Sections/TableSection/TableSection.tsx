"use client";

import type React from "react";
import type { JSX } from 'react';


import { useState, useRef, useCallback } from "react";
import { Button } from "@/Components/Button";
import { Input } from "@/Components/Input";
import { Separator } from "@/Components/Separator";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Copy,
  ClipboardPasteIcon as Paste,
  Briefcase as BriefcaseIcon,
  Calendar as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  User as UserIcon,
  Globe as GlobeIcon,
  Smile as SmileIcon,
  ArrowUp as ArrowUpIcon,
  Clock as ClockIcon,
  IndianRupee as IndianRupeeSign,
  ChevronDown as DropDownIcon,
  Hand as HandIcon
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/Select";
import { Toggle } from "@/Components/Toggle";
import { Tabs } from "./Tabs";
import { Value } from "@radix-ui/react-select";

interface CellData {
  value: string;
  formula?: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    align?: "left" | "center" | "right";
    fontSize?: number;
    fontFamily?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

interface SpreadsheetData {
  [key: string]: CellData;
}

interface Sheet {
  data: SpreadsheetData;
  history: SpreadsheetData[];
  historyIndex: number;
}

interface Sheets {
  [key: string]: Sheet;
}

interface DataTableSectionProps {
  isToolbarVisible: boolean;
  cols: number;
  columnNames: { [key: number]: string };
  onColumnRename: (colIndex: number, newName: string) => void;
}

export const TableSection = ({ isToolbarVisible, cols, columnNames, onColumnRename }: DataTableSectionProps): JSX.Element => {

  const [sheets, setSheets] = useState<Sheets>({
    Sheet1: {
      data: {

        A1: { value: "Launch social media campaign for product" },
        B1: { value: "15-11-2024" },
        C1: { value: "In-process", style: { backgroundColor: "#FFF3D6", } },
        D1: { value: "Aisha Patel" },
        E1: { value: "www.aishapatel.com" },
        F1: { value: "Sophie Choudhury" },
        G1: { value: "Medium", style: { textColor: "orange" } },
        H1: { value: "20-11-2024" },
        I1: { value: "6,200,000" },

        A2: { value: "Update press kit for company redesign" },
        B2: { value: "28-10-2024" },
        C2: { value: "Need to start", style: { backgroundColor: "#dbeafe" } },
        D2: { value: "Irfan Khan" },
        E2: { value: "www.irfankhan.com" },
        F2: { value: "Tejas Pandey" },
        G2: { value: "High", style: { textColor: "red" } },
        H2: { value: "30-10-2024" },
        I2: { value: "3,500,000" },

        A3: { value: "Finalize user testing feedback for app" },
        B3: { value: "05-12-2024" },
        C3: { value: "In-process", style: { backgroundColor: "#fde68a" } },
        D3: { value: "Mark Johnson" },
        E3: { value: "www.markjohnson.com" },
        F3: { value: "Rachel Lee" },
        G3: { value: "Medium", style: { textColor: "orange" } },
        H3: { value: "10-12-2024" },
        I3: { value: "4,750,000" },

        A4: { value: "Design new features for the website" },
        B4: { value: "10-01-2025" },
        C4: { value: "Complete", style: { backgroundColor: "#bbf7d0" } },
        D4: { value: "Emily Green" },
        E4: { value: "www.emilygreen.com" },
        F4: { value: "Tom Wright" },
        G4: { value: "Low", style: { textColor: "blue" } },
        H4: { value: "15-01-2025" },
        I4: { value: "5,900,000" },

        A5: { value: "Prepare financial report for Q4" },
        B5: { value: "25-01-2025" },
        C5: { value: "Blocked", style: { backgroundColor: "#fecaca" } },
        D5: { value: "Jessica Brown" },
        E5: { value: "www.jessicabrown.com" },
        F5: { value: "Kevin Smith" },
        G5: { value: "Low", style: { textColor: "blue" } },
        H5: { value: "30-01-2025" },
        I5: { value: "2,800,000" }
      }, history: [{}], historyIndex: 0
    },
  });

  const [activeSheet, setActiveSheet] = useState<string>("Sheet1");
  const [selectedCell, setSelectedCell] = useState<string>("A1");
  const [formulaBarValue, setFormulaBarValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [clipboard, setClipboard] = useState<string>("");

  const [columnWidths, setColumnWidths] = useState<{ [key: number]: number }>(() => {
    const initialWidths = [
      240,
      140,
      140,
      140,
      150,
      140,
      160,
      100,
      120,
      120,
    ];
    return initialWidths.reduce((acc, width, index) => {
      acc[index] = width;
      return acc;
    }, {} as { [key: number]: number });
  });

  const [rowHeights, setRowHeights] = useState<{ [key: number]: number }>({});
  const [rows, setRows] = useState(50);
  const [numRowsToAdd, setNumRowsToAdd] = useState(1);
  const [editingColumn, setEditingColumn] = useState<number | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<{ [key: string]: HTMLInputElement }>({});

  const { data, history, historyIndex } = sheets[activeSheet];

  // Generate column letters (A, B, C, ..., Z)
  const getColumnLetter = (index: number): string => {

    return String.fromCharCode(65 + index); // Default A, B, C...
  };

  const sheet1Headers = [
    "Job Request",
    "Submitted",
    "Status",
    "Submitter",
    "URL",
    "Assigned",
    "Priority",
    "Due Date",
    "Est. Value",
  ];

  // Parse cell reference (e.g., "A1" -> {col: 0, row: 0})
  const parseCellRef = (cellRef: string) => {
    const match = cellRef.match(/^([A-Z]+)(\d+)$/);
    if (!match) return null;
    const col = match[1].charCodeAt(0) - 65;
    const row = Number.parseInt(match[2]) - 1;
    return { col, row };
  };

  // Get cell reference from coordinates
  const getCellRef = (col: number, row: number): string => {
    return `${getColumnLetter(col)}${row + 1}`;
  };

  // Evaluate formula
  const evaluateFormula = useCallback((formula: string, currentData: SpreadsheetData): string => {
    if (!formula.startsWith("=")) return formula;

    try {
      let expression = formula.slice(1);

      // Replace cell references with their values
      expression = expression.replace(/[A-Z]+\d+/g, (cellRef) => {
        const cellData = currentData[cellRef];
        if (!cellData) return "0";
        const value = cellData.formula ? evaluateFormula(cellData.formula, currentData) : cellData.value;
        return isNaN(Number(value)) ? "0" : value;
      });

      // Basic math evaluation (simplified)
      const result = Function(`"use strict"; return (${expression})`)();
      return isNaN(result) ? "#ERROR" : result.toString();
    } catch {
      return "#ERROR";
    }
  }, []);

  // Update cell data
  const updateCell = useCallback(
    (cellRef: string, value: string, isFormula = false) => {
      setSheets((prevSheets) => {
        const newSheets = { ...prevSheets };
        const newSheet = { ...newSheets[activeSheet] };
        const newData = { ...newSheet.data };
        const cellData = newData[cellRef] || { value: "" };

        if (isFormula) {
          cellData.formula = value;
          cellData.value = evaluateFormula(value, newData);
        } else {
          cellData.value = value;
          delete cellData.formula;
        }

        newData[cellRef] = cellData;

        // Recalculate all formulas
        Object.keys(newData).forEach((key) => {
          const cell = newData[key];
          if (cell.formula) {
            cell.value = evaluateFormula(cell.formula, newData);
          }
        });

        newSheet.data = newData;
        newSheets[activeSheet] = newSheet;
        return newSheets;
      });
    },
    [activeSheet, evaluateFormula],
  );

  // Handle cell selection
  const handleCellSelect = (cellRef: string) => {
    if (isEditing) return;
    setSelectedCell(cellRef);
    const cellData = data[cellRef];
    setFormulaBarValue(cellData?.formula || cellData?.value || "");
  };

  // Handle cell edit
  const handleCellEdit = (cellRef: string, value: string) => {
    const isFormula = value.startsWith("=");
    updateCell(cellRef, value, isFormula);

    // Add to history
    setSheets((prev) => {
      const newSheets = { ...prev };
      const newSheet = { ...newSheets[activeSheet] };
      const newHistory = newSheet.history.slice(0, newSheet.historyIndex + 1);
      newHistory.push({ ...newSheet.data });
      newSheet.history = newHistory;
      newSheet.historyIndex = newSheet.historyIndex + 1;
      newSheets[activeSheet] = newSheet;
      return newSheets;
    });
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, cellRef: string) => {
    if (isEditing) return;

    const parsed = parseCellRef(cellRef);
    if (!parsed) return;

    let newCol = parsed.col;
    let newRow = parsed.row;

    switch (e.key) {
      case "ArrowUp":
        newRow = Math.max(0, newRow - 1);
        break;
      case "ArrowDown":
        newRow = Math.min(rows - 1, newRow + 1);
        break;
      case "ArrowLeft":
        newCol = Math.max(0, newCol - 1);
        break;
      case "ArrowRight":
        newCol = Math.min(cols - 1, newCol + 1);
        break;
      case "Enter":
        setIsEditing(true);
        return;
      case "Delete":
        updateCell(cellRef, "");
        return;
      default:
        return;
    }

    e.preventDefault();
    const newCellRef = getCellRef(newCol, newRow);
    handleCellSelect(newCellRef);
    cellRefs.current[newCellRef]?.focus();
  };

  // Handle formula bar change
  const handleFormulaBarChange = (value: string) => {
    setFormulaBarValue(value);
    const isFormula = value.startsWith("=");
    updateCell(selectedCell, value, isFormula);
  };

  // Apply formatting
  const applyFormatting = (property: string, value: boolean | string | number | "left" | "center" | "right") => {
    setSheets((prevSheets) => {
      const newSheets = { ...prevSheets };
      const newSheet = { ...newSheets[activeSheet] };
      const newData = { ...newSheet.data };
      const cellData = newData[selectedCell] || { value: "" };
      cellData.style = { ...cellData.style, [property]: value };
      newData[selectedCell] = cellData;
      newSheet.data = newData;
      newSheets[activeSheet] = newSheet;
      return newSheets;
    });
  };

  // Copy/Paste functionality
  const handleCopy = () => {
    const cellData = data[selectedCell];
    setClipboard(cellData?.value || "");
  };

  const handlePaste = () => {
    if (clipboard) {
      updateCell(selectedCell, clipboard);
    }
  };

  // Undo/Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setSheets((prev) => {
        const newSheets = { ...prev };
        const newSheet = { ...newSheets[activeSheet] };
        newSheet.historyIndex = newSheet.historyIndex - 1;
        newSheet.data = newSheet.history[newSheet.historyIndex];
        newSheets[activeSheet] = newSheet;
        return newSheets;
      });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setSheets((prev) => {
        const newSheets = { ...prev };
        const newSheet = { ...newSheets[activeSheet] };
        newSheet.historyIndex = newSheet.historyIndex + 1;
        newSheet.data = newSheet.history[newSheet.historyIndex];
        newSheets[activeSheet] = newSheet;
        return newSheets;
      });
    }
  };

  // Handle column resize
  const handleColumnResize = (colIndex: number, newWidth: number) => {
    setColumnWidths((prev) => ({
      ...prev,
      [colIndex]: Math.max(50, newWidth), // Minimum width of 50px
    }));
  };

  // Handle row resize
  const handleRowResize = (rowIndex: number, newHeight: number) => {
    setRowHeights((prev) => ({
      ...prev,
      [rowIndex]: Math.max(20, newHeight), // Minimum height of 20px
    }));
  };

  // Handle mouse down on resize handle
  const handleResizeStart = (e: React.MouseEvent, type: "column" | "row", index: number) => {
    e.preventDefault();

    const startPos = type === "column" ? e.clientX : e.clientY;
    const startSize =
      type === "column"
        ? columnWidths[index] || 96 // Default 24 * 4 = 96px (w-24)
        : rowHeights[index] || 32; // Default 8 * 4 = 32px (h-8)

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = type === "column" ? e.clientX : e.clientY;
      const diff = currentPos - startPos;
      const newSize = startSize + diff;

      if (type === "column") {
        handleColumnResize(index, newSize);
      } else {
        handleRowResize(index, newSize);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleColumnRename = (colIndex: number, newName: string) => {
    onColumnRename(colIndex, newName);
    setEditingColumn(null);
  };

  const handleAddSheet = () => {
    const newSheetName = `Sheet${Object.keys(sheets).length + 1}`;
    setSheets((prev) => ({
      ...prev,
      [newSheetName]: { data: {}, history: [{}], historyIndex: 0 },
    }));
    setActiveSheet(newSheetName);
  };

  const handleSheetRename = (oldName: string, newName: string) => {
    const trimmedNewName = newName.trim();
    if (oldName === trimmedNewName || !trimmedNewName || sheets[trimmedNewName]) {
      return; // Name is the same, empty, or already exists
    }

    const newSheets = { ...sheets };
    const sheetData = newSheets[oldName];
    delete newSheets[oldName];
    newSheets[trimmedNewName] = sheetData;

    setSheets(newSheets);

    if (activeSheet === oldName) {
      setActiveSheet(trimmedNewName);
    }
  };

  const handleAddRows = () => {
    if (numRowsToAdd > 0) {
      setRows((prevRows) => prevRows + numRowsToAdd);
    }
  };

  const handleSheetDelete = (sheetName: string) => {
    if (Object.keys(sheets).length <= 1) {
      return; // Don't delete the last sheet
    }

    const newSheets = { ...sheets };
    delete newSheets[sheetName];

    let newActiveSheet = activeSheet;
    if (activeSheet === sheetName) {
      newActiveSheet = Object.keys(newSheets)[0];
    }

    setSheets(newSheets);
    setActiveSheet(newActiveSheet);
  };

  return (
    <div className="flex flex-col bg-background" style={{ height: 'calc(100vh - 120px)' }}>
      {isToolbarVisible && (
        <>
          {/* Toolbar */}
          <div className="border-b p-2 flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="sm" onClick={handleUndo}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRedo}>
              <Redo className="w-4 h-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />

            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePaste}>
              <Paste className="w-4 h-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />

            <Select defaultValue="Arial" onValueChange={(font: string) => applyFormatting("fontFamily", font)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times">Times</SelectItem>
                <SelectItem value="Courier">Courier</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="12" onValueChange={(size: string) => applyFormatting("fontSize", parseInt(size))}>
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="18">18</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />

            <Toggle
              pressed={data[selectedCell]?.style?.bold}
              onPressedChange={(pressed: boolean) => applyFormatting("bold", pressed)}
            >
              <Bold className="w-4 h-4" />
            </Toggle>
            <Toggle
              pressed={data[selectedCell]?.style?.italic}
              onPressedChange={(pressed: boolean) => applyFormatting("italic", pressed)}
            >
              <Italic className="w-4 h-4" />
            </Toggle>
            <Toggle
              pressed={data[selectedCell]?.style?.underline}
              onPressedChange={(pressed: boolean) => applyFormatting("underline", pressed)}
            >
              <Underline className="w-4 h-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6" />

            <Toggle
              pressed={data[selectedCell]?.style?.align === "left"}
              onPressedChange={() => applyFormatting("align", "left")}
            >
              <AlignLeft className="w-4 h-4" />
            </Toggle>
            <Toggle
              pressed={data[selectedCell]?.style?.align === "center"}
              onPressedChange={() => applyFormatting("align", "center")}
            >
              <AlignCenter className="w-4 h-4" />
            </Toggle>
            <Toggle
              pressed={data[selectedCell]?.style?.align === "right"}
              onPressedChange={() => applyFormatting("align", "right")}
            >
              <AlignRight className="w-4 h-4" />
            </Toggle>
          </div>

          {/* Formula Bar */}
          <div className="border-b p-2 flex items-center gap-2">
            <div className="w-20 text-sm font-medium">{selectedCell}</div>
            <Input
              value={formulaBarValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormulaBarChange(e.target.value)}
              placeholder="Enter formula or value"
              className="flex-1"
            />
          </div>
        </>
      )}

      {/* Spreadsheet Grid */}
      <div
        className="flex-1 relative w-full overflow-auto"
        ref={gridRef}
        style={{
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain',
          maxWidth: '100vw'
        }}
      >
        <div className="inline-block">
          {/* Top Row */}
          <div className="flex sticky top-0 bg-muted z-20">
            <div className="w-12 h-8 border border-gray-100 bg-white flex items-center justify-center text-sm  font-medium"></div>

            {/* Financial Overview Header */}
            <div
              className="flex items-center h-8 gap-2 px-3 bg-[#e2e2e2] border-b border-[#e0e0e0] rounded-tl"
              style={{ width: columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] }}
            >
              <div className="flex items-center" style={{ width: columnWidths[0] }}>
                <div className="flex items-center gap-1 bg-[#eeeeee] rounded px-2 py-1">
                  <img src="https://c.animaapp.com/mclmkdkf288FZk/img/link.svg" alt="Link" />
                  <span className="text-xs text-[#545454]">Q3 Financial Overview</span>
                </div>
                <img src="https://c.animaapp.com/mclmkdkf288FZk/img/arrow-sync.svg" alt="Arrow Sync" className="w-4 h-4 text-[#545454]" />
              </div>
            </div>

            {/* Other Section Headers */}
            <div className="bg-white" style={{ width: columnWidths[4] }}></div>

            <div className="flex items-center justify-center gap-2 h-8 px-3 bg-[#D2E0D4]" style={{ width: columnWidths[5] }}>
              <img className="w-6 h-6 mr-1" src="https://c.animaapp.com/mclmkdkf288FZk/img/arrow-split.svg" alt="Arrow Split" />
              <span className="text-[#505450] text-lg font-semibold truncate">ABC</span>
              <button><img src="https://c.animaapp.com/mclmkdkf288FZk/img/more.svg" alt="More" className="w-6 h-6" /></button>
            </div>

            <div className="flex items-center h-8 px-3 bg-[#DCCFFC]" style={{ width: columnWidths[6] + columnWidths[7] }}>
              <img className="w-6 h-6 mr-1" src="https://c.animaapp.com/mclmkdkf288FZk/img/arrow-split.svg" alt="Arrow Split" />
              <span className="text-[#505450] text-lg font-semibold truncate">Answer A question</span>
              <button><img src="https://c.animaapp.com/mclmkdkf288FZk/img/more.svg" alt="More" className="w-6 h-6" /></button>
            </div>

            <div className="flex items-center h-8 px-3 bg-[#FAC2AF]" style={{ width: columnWidths[8] }}>
              <img className="w-6 h-6 mr-1" src="https://c.animaapp.com/mclmkdkf288FZk/img/arrow-split.svg" alt="Arrow Split" />
              <span className="text-[#505450] text-lg font-semibold truncate">Extract</span>
              <button><img src="https://c.animaapp.com/mclmkdkf288FZk/img/more.svg" alt="More" className="w-6 h-6" /></button>
            </div>

            <div className="flex items-center justify-center h-8 px-3 bg-[#EEEEEE]" style={{ width: columnWidths[8] }}>+</div>
          </div>

          {/* Column Header Row */}
          <div className="flex sticky top-8 z-20">
            <div className="w-12 h-8 border border-gray-600 bg-[#EEEEEE] flex items-center justify-center text-xs font-medium">#</div>

            {Array.from({ length: cols }, (_, colIndex) => {
              const label = sheet1Headers[colIndex] || getColumnLetter(colIndex);
              const colHeaderName = sheet1Headers[colIndex]
              let backgroundColor = "#EEEEEE";
              if (colHeaderName === "Assigned") {
                backgroundColor = "#E8F0E9";
              } else if (colHeaderName === "Priority" || colHeaderName === "Due Date") {
                backgroundColor = "#EAE3FC";
              } else if (colHeaderName === "Est. Value") {
                backgroundColor = "#FFE9E0";
              }
              return (
                <div
                  key={colIndex}
                  className="relative flex items-center justify-between px-2 py-1 text-sm font-medium bg-[#EEEEEE] border border-r border-gray-300 whitespace-nowrap"
                  style={{
                    width: columnWidths[colIndex] || 120,
                    backgroundColor
                  }}
                >
                  <div className="flex items-center gap-1">
                    {
                      {
                        "Job Request": <BriefcaseIcon className="w-4 h-4 text-gray-500" />,
                        "Submitted": <CalendarIcon className="w-4 h-4 text-gray-500" />,
                        "Status": <CheckCircleIcon className="w-4 h-4 text-gray-500" />,
                        "Submitter": <UserIcon className="w-4 h-4 text-gray-500" />,
                        "URL": <GlobeIcon className="w-4 h-4 text-gray-500" />,
                        "Assigned": <div className="relative">
                          <SmileIcon className="w-4 h-4 text-gray-800" />
                          <HandIcon className="w-3.5 h-3.5 text-gray-700 bg-gray-100 rounded-2xl absolute -top-1 -left-1" />
                        </div>,
                        "Priority": <ArrowUpIcon className="w-4 h-4 text-gray-500" />,
                        "Due Date": <ClockIcon className="w-4 h-4 text-gray-500" />,
                        "Est. Value": <IndianRupeeSign className="w-4 h-4 text-gray-500" />
                      }[label] || null
                    }
                    <span className="text-sm">{label}</span>
                  </div>
                  <DropDownIcon className="w-4 h-4 text-[#AFAFAF]" />
                  <div
                    className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-500"
                    onMouseDown={(e) => handleResizeStart(e, "column", colIndex)}
                  />
                </div>
              );
            })}
          </div>

          {/* Data Rows */}
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="flex relative">
              {/* Row Header */}
              <div className="relative w-12 h-8 flex items-center justify-center border border-gray-100 text-xs font-medium cursor-pointer select-none bg-[#FFFFFF]  left-0 z-10">
                {rowIndex + 1}
                <div
                  className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize bg-transparent hover:bg-blue-500"
                  onMouseDown={(e) => handleResizeStart(e, "row", rowIndex)}
                />
              </div>

              {/* Cells */}
              {Array.from({ length: cols }, (_, colIndex) => {
                const cellRef = getCellRef(colIndex, rowIndex);
                const cellData = data[cellRef];
                const isSelected = selectedCell === cellRef;
                const columnName = sheet1Headers[colIndex]

                let textAlign = "left";
                if (columnName === "Priority") textAlign = "center";
                if (columnName === 'Status') textAlign = "center"
                if (["Submitted", "Due Date", "Est. Value"].includes(columnName)) textAlign = "right";

                let backgroundColor = cellData?.style?.backgroundColor;
                if (columnName === "Status") {
                  switch (cellData?.value) {
                    case "In-process":
                      backgroundColor = "#FFF3D6";
                      break;
                    case "Need to start":
                      backgroundColor = "#E2E8F0";
                      break;
                    case "Complete":
                      backgroundColor = "#D3F2E3";
                      break;
                    case "Blocked":
                      backgroundColor = "#FFE1DE";
                      break;
                    default:
                      backgroundColor = "white";
                  }
                }

                return (
                  <input
                    key={cellRef}
                    ref={(el) => {
                      if (el) cellRefs.current[cellRef] = el;
                    }}
                    className={`px-1 text-xs outline-none  ${isSelected ? "border-2 border-blue-500 bg-blue-50" : "border border-x-gray-200 border-y-gray-100 bg-[#FFFFFF]"}`}
                    style={{
                      width: columnWidths[colIndex] || 96,
                      height: rowHeights[rowIndex] || 32,
                      fontWeight: cellData?.style?.bold ? "bold" : "normal",
                      fontStyle: cellData?.style?.italic ? "italic" : "normal",
                      textDecoration: cellData?.style?.underline ? "underline" : "none",
                      textAlign: cellData?.style?.align || textAlign,
                      fontSize: cellData?.style?.fontSize ? `${cellData.style.fontSize}px` : "12px",
                      fontFamily: cellData?.style?.fontFamily || "Arial",
                      backgroundColor: cellData?.style?.backgroundColor,
                      color: cellData?.style?.textColor,
                      justify: 'center'
                    }}
                    value={cellData?.value || ""}
                    onChange={(e) => handleCellEdit(cellRef, e.target.value)}
                    onFocus={() => handleCellSelect(cellRef)}
                    onKeyDown={(e) => handleKeyDown(e, cellRef)}
                    onDoubleClick={() => setIsEditing(true)}
                    onBlur={() => setIsEditing(false)}
                  />
                );
              })}
            </div>
          ))}

          {/* Add Rows Footer */}
          <div className="relative py-2 px-12 border-t flex items-center gap-2 sticky left-0 z-10 bg-muted">
            <Input
              type="number"
              min="1"
              value={numRowsToAdd}
              onChange={(e) => setNumRowsToAdd(Number(e.target.value))}
              className="w-24"
              aria-label="Number of rows to add"
            />
            <Button className="bg-[#4b6a4f]"
              onClick={() => handleAddRows()}
            >Add Rows</Button>
            <span className="text-sm text-gray-500">number of rows to add</span>
          </div>
        </div>
      </div>




      {/* Status Bar */}
      <Tabs
        sheets={Object.keys(sheets)}
        activeSheet={activeSheet}
        onSheetChange={setActiveSheet}
        onAddSheet={handleAddSheet}
        onSheetRename={handleSheetRename}
        onSheetDelete={handleSheetDelete}
      />
    </div>
  );
};