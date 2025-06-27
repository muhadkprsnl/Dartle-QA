// utils/transformData.ts
interface DonutData {
    name: string;
    value: number;
}

interface DeveloperStats {
    name: string;
    prodSuccess: number;
    prodError: number;
    devSuccess: number;
    devError: number;
}

export function transformToDonutData(reports: any[]): DeveloperStats[] {
    const developerStats: Record<string, DeveloperStats> = {};

    reports.forEach(report => {
        // Process development environment
        if (report.environment === 'development') {
            if (report.developer1) {
                developerStats[report.developer1] = {
                    name: report.developer1,
                    devSuccess: report.d1_passed,
                    devError: report.d1_failed,
                    prodSuccess: 0,
                    prodError: 0,
                };
            }
            if (report.developer2) {
                developerStats[report.developer2] = {
                    name: report.developer2,
                    devSuccess: report.d2_passed,
                    devError: report.d2_failed,
                    prodSuccess: 0,
                    prodError: 0,
                };
            }
        }

        // Process production environment (using P_ prefixed fields)
        if (report.P_developer1) {
            if (!developerStats[report.P_developer1]) {
                developerStats[report.P_developer1] = {
                    name: report.P_developer1,
                    prodSuccess: 0,
                    prodError: 0,
                    devSuccess: 0,
                    devError: 0,
                };
            }
            developerStats[report.P_developer1].prodSuccess = report.P_d1_passed || 0;
            developerStats[report.P_developer1].prodError = report.P_d1_failed || 0;
        }

        if (report.P_developer2) {
            if (!developerStats[report.P_developer2]) {
                developerStats[report.P_developer2] = {
                    name: report.P_developer2,
                    prodSuccess: 0,
                    prodError: 0,
                    devSuccess: 0,
                    devError: 0,
                };
            }
            developerStats[report.P_developer2].prodSuccess = report.P_d2_passed || 0;
            developerStats[report.P_developer2].prodError = report.P_d2_failed || 0;
        }
    });

    return Object.values(developerStats);
}