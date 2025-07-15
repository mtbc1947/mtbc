import React from 'react';

interface MaintainEntityManagerProps<T> {
  entities: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  renderMobileItem: (item: T, index: number) => React.ReactNode;
  selectedItems: T[];
  onSelectItem: (item: T) => void;
  onSelectAll: (checked: boolean) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function MaintainEntityManager<T>({
  entities,
  renderItem,
  renderMobileItem,
  selectedItems,
  onSelectItem,
  onSelectAll,
  itemsPerPage,
  onItemsPerPageChange,
  currentPage,
  onPageChange,
}: MaintainEntityManagerProps<T>) {
  const totalItems = entities.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = entities.slice(startIndex, startIndex + itemsPerPage);

  const isSelected = (item: T) =>
    selectedItems.includes(item); // assumes reference equality

  const allSelected =
    currentItems.length > 0 &&
    currentItems.every((item) => isSelected(item));

  return (
    <div className="flex flex-col gap-4">
      {/* Pagination Top */}
      <div className="flex items-center justify-between text-sm">
        <div>
          {selectedItems.length}/{totalItems} selected
        </div>
        <div className="flex items-center gap-2">
          <label>
            Items per page:
            <input
              type="number"
              min={1}
              value={itemsPerPage}
              onChange={(e) =>
                onItemsPerPageChange(Number(e.target.value))
              }
              className="ml-2 w-16 border rounded px-1 py-0.5"
            />
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
            />
            Select All
          </label>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block border rounded">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              {/* Customize column headers if needed */}
              <th className="p-2 text-left border">Date</th>
              <th className="p-2 text-center border">Time</th>
              <th className="p-2 text-left border">Subject</th>
              <th className="p-2 text-center border">Venue</th>
              <th className="p-2 text-center border">Dress</th>
              <th className="p-2 text-center border">League</th>
              <th className="p-2 text-center border">Team</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} className="border-t">
                {renderItem(item, index)}
                <td className="p-2 text-center bg-green-200">
                  <input
                    type="checkbox"
                    checked={isSelected(item)}
                    onChange={() => onSelectItem(item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-2">
        {currentItems.map((item, index) => (
          <div
            key={index}
            className="border rounded p-2 flex items-start gap-2"
          >
            <input
              type="checkbox"
              checked={isSelected(item)}
              onChange={() => onSelectItem(item)}
              className="mt-1"
            />
            <div className="flex-1">{renderMobileItem(item, index)}</div>
          </div>
        ))}
      </div>

      {/* Pagination Bottom */}
      <div className="flex justify-center gap-2 text-sm">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          &laquo;
        </button>
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          &lt;
        </button>
        <span className="px-2 py-1">{currentPage}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          &gt;
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}
