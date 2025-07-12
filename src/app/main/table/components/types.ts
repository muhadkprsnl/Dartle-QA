export interface Developer {
    name: string;
    passed: number;
    failed: number;
}

export interface TableData {
    _id: string;
    sprint: string;
    version: string;
    totalTestCases: number;
    totalBugs: number;
    developers: Developer[];
    environment: 'development' | 'production';
    dueDate?: string;
    closeDate?: string;
    createdAt?: string;
}