"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getDatabase, ref, onValue } from "firebase/database"

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const chartConfig = {
  female: {
    label: "Female",
    color: "hsl(var(--chart-1))",  // Change to your desired color
  },
  male: {
    label: "Male",
    color: "hsl(var(--chart-2))",  // Change to your desired color
  },
} satisfies ChartConfig

export function BirthdayBarChart() {
  const [chartData, setChartData] = React.useState<{ month: string; female: number; male: number }[]>([]);

  React.useEffect(() => {
    const db = getDatabase();
    const birthdaysRef = ref(db, "validated_nics");

    const unsubscribe = onValue(birthdaysRef, (snapshot) => {
      if (!snapshot.exists()) {
        setChartData([]);
        return;
      }

      const data = snapshot.val();
      const monthCountsFemale = Array(12).fill(0);
      const monthCountsMale = Array(12).fill(0);

      Object.values(data).forEach((item: any) => {
        const birthDay = item.birthDay; 
        const gender = item.gender;  // Assuming gender is stored as "Male" or "Female"
        if (birthDay && birthDay.length >= 6) {
          const monthIndex = parseInt(birthDay.substring(2, 4), 10) - 1; 
          if (monthIndex >= 0 && monthIndex < 12) {
            if (gender === "Female") {
              monthCountsFemale[monthIndex] += 1;
            } else if (gender === "Male") {
              monthCountsMale[monthIndex] += 1;
            }
          }
        }
      });

      const totalBirthdaysFemale = monthCountsFemale.reduce((sum, count) => sum + count, 0);
      const totalBirthdaysMale = monthCountsMale.reduce((sum, count) => sum + count, 0);

      const formattedData = monthNames.map((month, index) => ({
        month,
        female: totalBirthdaysFemale > 0 ? (monthCountsFemale[index] / totalBirthdaysFemale) * 100 : 0,
        male: totalBirthdaysMale > 0 ? (monthCountsMale[index] / totalBirthdaysMale) * 100 : 0,
      }));

      setChartData(formattedData);
    });

    return () => unsubscribe();
  }, []);

  if (chartData.length === 0) {
    return (
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="text-center">
          <CardTitle className="text-lg sm:text-xl font-semibold">Birthday Distribution by Gender</CardTitle>
          <CardDescription className="text-sm sm:text-base">Percentage of birthdays per month by gender</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 w-full h-full flex items-center justify-center">
          <p className="text-sm sm:text-base font-semibold text-gray-600">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="text-center">
        <CardTitle className="text-lg sm:text-xl font-semibold">Birthday Distribution by Gender</CardTitle>
        <CardDescription className="text-sm sm:text-base">Percentage of birthdays per month by gender (Real-Time)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 w-full h-full">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis 
                dataKey="female" 
                type="number" 
                tickFormatter={(tick) => `${tick.toFixed(1)}%`} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                dataKey="month"
                type="category"
                width={0} 
                tick={{ fontSize: 12, textAnchor: "middle" }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Bar
                dataKey="female"
                stackId="a"
                fill="var(--color-female)"
                radius={[4, 0, 0, 4]}
              >
                <LabelList 
                  dataKey="month" 
                  position="insideLeft" 
                  offset={8} 
                  className="fill-background font-medium text-center" 
                  fontSize={12} 
                />
              </Bar>
              <Bar
                dataKey="male"
                stackId="a"
                fill="var(--color-male)"
                radius={[0, 4, 4, 0]}
              >
                <LabelList 
                  dataKey="Total per Month" 
                  position="right" 
                  offset={8} 
                  formatter={(val: number) => `${val.toFixed(1)}%`} 
                  className="fill-foreground font-semibold text-center" 
                  fontSize={14} 
                />
              </Bar>
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                iconType="square"
                iconSize={12}
                formatter={(value) => <span className="font-semibold">{value}</span>}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}