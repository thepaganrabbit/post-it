import { SearchBar } from "@/lib/SearchBar/SearchBar";

/**
 * Example usage of the SearchBar component in your layouts:
 * 
 * In your page or layout component:
 */

// Example 1: Basic usage in a component
// import { SearchBar } from "@/lib/SearchBar/SearchBar";
// import { usePostItsNotes } from "@/store";
// import { useState } from "react";
//
// export default function YourPage() {
//   const postIts = usePostItsNotes((state) => state.postIts);
//   const tags = usePostItsNotes((state) => state.tags);
//   const [searchResults, setSearchResults] = useState(() => postIts || []);
//
//   return (
//     <div>
//       <SearchBar 
//         postIts={postIts || []}
//         tags={tags || []}
//         onSearchChange={setSearchResults}
//         placeholder="Search your postIts..."
//       />
//       {/* Render searchResults instead of all postIts */}
//     </div>
//   );
// }

// Export the component for easy importing
export { default } from "./SearchBar";
export type { SearchFilter } from "./SearchBar";
