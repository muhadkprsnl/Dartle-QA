declare module 'react-date-range' {
    import * as React from 'react';

    export interface Range {
        startDate: Date;
        endDate: Date;
        key: string;
    }

    export interface DateRangeProps {
        ranges: Range[];
        onChange: (range: { selection: Range }) => void;
        editableDateInputs?: boolean;
        moveRangeOnFirstSelection?: boolean;
        className?: string;
    }

    export class DateRange extends React.Component<DateRangeProps> { }
}
