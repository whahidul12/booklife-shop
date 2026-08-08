export function AddAddressCard() {
  return (
    <button className="flex h-full min-h-30 w-full cursor-pointer items-center justify-center rounded border border-gray-200 bg-white transition-colors hover:bg-gray-50">
      <span className="flex items-center gap-2 text-sm font-semibold text-red-500">
        <span className="text-lg font-light">+</span> Add Address
      </span>
    </button>
  );
}
