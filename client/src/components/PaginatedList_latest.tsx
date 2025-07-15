import React, { useState } from 'react';

// Define a generic type for items in the list
interface Item {
  id: string | number;
}

interface PaginatedListProps<T extends Item> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const PaginatedList = <T extends Item>({ items, renderItem }: PaginatedListProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSelectItem = (itemId: string | number) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <input
          type="number"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Math.max(1, parseInt(e.target.value, 10)))}
          className="w-20 p-2 border border-gray-300 rounded-md"
          min="1"
        />
        <span className="text-gray-600">{`${selectedItems.size} / ${items.length}`}</span>
      </div>
      <ul className="divide-y divide-gray-200">
        {paginatedItems.map((item) => (
          <li key={item.id} className="flex items-center p-3">
            <input
              type="checkbox"
              checked={selectedItems.has(item.id)}
              onChange={() => handleSelectItem(item.id)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-4"
            />
            {renderItem(item)}
          </li>
        ))}
      </ul>
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedList;