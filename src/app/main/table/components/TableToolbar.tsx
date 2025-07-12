// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // import { DateRangePickers, type DateRange } from '@/components/ui/date-Range-Picker';
// import { useRouter } from 'next/navigation';


// import { DateRange, DateRangePickers } from '@/components/ui/date-range-picker';

// interface TableToolbarProps {
//     activeTab: 'dev' | 'prod';
//     searchTerm: string;
//     onSearch: () => void; // Add this prop
//     onSearchChange: (term: string) => void;
//     dateRange: DateRange;
//     onDateRangeChange: (range: DateRange) => void;
// }
// // interface TableToolbarProps {
// //     activeTab: string;
// //     searchTerm?: string;
// //     onSearchChange?: (term: string) => void;
// //     onDateRangeChange?: (range: DateRange) => void;
// // }

// export default function TableToolbar({
//     activeTab,
//     searchTerm = '',
//     onSearch, // Add this
//     onSearchChange = () => { },
//     onDateRangeChange = () => { }
// }: TableToolbarProps) {
//     const router = useRouter();
//     const [dateRange, setDateRange] = useState<DateRange>({
//         from: null,
//         to: null,
//     });

//     const handleDateChange = (range: DateRange) => {
//         setDateRange(range);
//         onDateRangeChange(range);
//     };

//     return (
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 ">

//             {/* Search Input */}
//             <div className="flex w-full md:w-auto items-center gap-2 ml-4 ">
//                 <Input
//                     placeholder="Search sprint..."
//                     value={searchTerm}
//                     onChange={(e) => onSearchChange(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && onSearch()} // Add enter key support
//                     className="w-full md:w-[300px]"
//                 />
//                 <Button variant="outline">Search</Button>
//                 {searchTerm && (
//                     <Button
//                         variant="ghost"
//                         onClick={() => {
//                             onSearchChange('');
//                             onSearch(); // Trigger search with empty term to show all
//                         }}
//                     >
//                         Clear
//                     </Button>
//                 )}
//             </div>


//             {/* Right Side Controls */}
//             <div className="flex items-center gap-4 w-full md:w-auto mr-12">
//                 {/* Environment Tabs */}
//                 <Tabs
//                     value={activeTab}
//                     onValueChange={(value) => router.push(`/main/table?tab=${value}`)}
//                     className="w-full md:w-auto"
//                 >
//                     <TabsList>
//                         <TabsTrigger value="dev">Development</TabsTrigger>
//                         <TabsTrigger value="prod">Production</TabsTrigger>
//                     </TabsList>
//                 </Tabs>

//                 {/* Date Range Picker - Updated prop name */}
//                 <DateRangePickers
//                     date={dateRange}
//                     onDateChange={handleDateChange}
//                 />

//                 {/* Create New Button */}
//                 <Button
//                     onClick={() => router.push(`/form?type=${activeTab}`)}
//                     className="whitespace-nowrap"
//                 >
//                     Create New
//                 </Button>
//             </div>
//         </div>
//     );
// }

// TableToolbar.tsx
// TableToolbar.tsx
// TableToolbar.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRange, DateRangePickers } from '@/components/ui/date-range-picker';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface TableToolbarProps {
    activeTab: 'dev' | 'prod';
    searchTerm: string;
    onSearch: () => void;
    onSearchChange: (term: string) => void;
    dateRange: DateRange;
    onDateRangeChange: (range: DateRange) => void;
}

export default function TableToolbar({
    activeTab,
    searchTerm,
    onSearch,
    onSearchChange,
    dateRange,
    onDateRangeChange
}: TableToolbarProps) {
    const router = useRouter();

    const handleDateChange = (range: DateRange) => {
        onDateRangeChange(range);
    };

    const handleClearSearch = () => {
        onSearchChange('');
        onSearch();
    };

    // Handle create new button click
    const handleCreateNew = () => {
        if (activeTab === 'dev') {
            router.push('/main/devform');
        } else {
            router.push('/main/prodform');
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 ml-4">
            {/* Search Input */}
            <div className="flex w-full md:w-auto items-center gap-2">
                <div className="relative flex-1">
                    <Input
                        placeholder="Search sprint..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                        className="w-full md:w-[300px] pl-9"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    {searchTerm && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5"
                            onClick={handleClearSearch}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <Button
                    variant={searchTerm ? "default" : "outline"}
                    onClick={onSearch}
                    disabled={!searchTerm.trim()}
                    className="flex items-center"
                >
                    {/* <Search className="h-4 w-4 mr-2" /> */}
                    Search
                </Button>
            </div>

            {/* Right Side Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto mr-12">
                {/* Environment Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => router.push(`/main/table?tab=${value}`)}
                    className="w-full md:w-auto"
                >
                    <TabsList>
                        <TabsTrigger value="dev">Development</TabsTrigger>
                        <TabsTrigger value="prod">Production</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-4">
                    {/* Date Range Picker */}
                    <DateRangePickers
                        date={dateRange}
                        onDateChange={handleDateChange}
                    />

                    {/* Updated Create New Button */}
                    <Button
                        onClick={handleCreateNew}
                        className="whitespace-nowrap"
                    >
                        Create New
                    </Button>
                </div>
            </div>
        </div>
    );
}