// components/DonutChart.tsx
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// interface DonutChartProps {
//   successRate: number;
//   errorRate: number;
//   title: string;
//   environment: 'prod' | 'dev';
//   colors: string[];
// }

// export default function DonutChart({
//   successRate,
//   errorRate,
//   title,
//   environment,
//   colors,
// }: DonutChartProps) {
//   const data = [
//     { name: 'Success', value: successRate },
//     { name: 'Error', value: errorRate },
//   ];

//   return (
//     <div className="flex flex-col items-center p-4 border rounded-lg">
//       <h3 className="font-medium mb-2">
//         {title} {environment === 'prod' ? '🖥️ Prod' : '🧪 Dev'}
//       </h3>
//       <div className="text-center">
//         <p className="text-2xl font-bold">{successRate}%</p>
//         <p className="text-sm text-gray-500">Success Rate</p>
//       </div>
//       <div className="w-32 h-32 mt-2">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               innerRadius={40}
//               outerRadius={50}
//               paddingAngle={5}
//               dataKey="value"
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={colors[index]} />
//               ))}
//             </Pie>
//             <Tooltip
//               formatter={(value) => [`${value}%`, data[Number(value === successRate ? 0 : 1)].name}
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"


interface DonutChartProps {
  successRate: number;
  errorRate: number;
  title: string;
  environment: 'prod' | 'dev';
  colors: string[];
  avatarUrl?: string; // ✅ ADD THIS LINE
}

export default function DonutChart({
  successRate,
  errorRate,
  title,
  environment,
  colors,
  avatarUrl, // ✅ ADD THIS
}: DonutChartProps) {
  const data = [
    { name: 'Success', value: successRate },
    { name: 'Error', value: errorRate },
  ];

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg">
      {/* Top: Avatar + Developer Name */}
      <h3 className="font-medium mb-2 flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={avatarUrl || "https://github.com/evilrabbit.png"}
            alt={title}
          />
          <AvatarFallback className="hidden" />
        </Avatar>
        <span>{title}</span>
      </h3>

      {/* Success Rate */}
      <div className="text-center">
        <p className="text-2xl font-bold">{successRate}%</p>
        <p className="text-sm text-gray-500">Success Rate</p>
      </div>

      {/* Donut Chart */}
      <div className="w-32 h-32 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={50}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Center: Environment Badge */}
      <div className="mt-4">
        {environment === "prod" ? (
          <Badge className="bg-[#3b82f6] text-white">🖥️ Prod</Badge>
        ) : (
          <Badge className="bg-[#22c55e] text-white">🧪 Dev</Badge>
        )}
      </div>
    </div>
  );
}