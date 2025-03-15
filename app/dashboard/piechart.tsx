import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartTooltip, ChartTooltipContent, ChartContainer, ChartConfig } from "@/components/ui/chart"
import { ref, onValue } from "firebase/database"
import { database } from "@/app/firebase" // Import the initialized database

const chartConfig = {
  eligible: {
    label: "Eligible",
    color: "hsl(var(--chart-1))", // Consistent with the bar chart colors
  },
  ineligible: {
    label: "Ineligible",
    color: "hsl(var(--chart-2))",
  },
  unknown: {
    label: "Unknown",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function VotingEligibilityChart() {
  const [chartData, setChartData] = React.useState([
    { category: "Eligible", count: 0, fill: "var(--color-eligible)" },
    { category: "Ineligible", count: 0, fill: "var(--color-ineligible)" },
    { category: "Unknown", count: 0, fill: "var(--color-unknown)" },
  ]);

  // Fetch real-time data from Firebase
  React.useEffect(() => {
    const votingRef = ref(database, "validated_nics");

    const unsubscribe = onValue(votingRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.log("No data found in Firebase.");
        setChartData([
          { category: "Eligible", count: 0, fill: "var(--color-eligible)" },
          { category: "Ineligible", count: 0, fill: "var(--color-ineligible)" },
          { category: "Unknown", count: 0, fill: "var(--color-unknown)" },
        ]);
        return;
      }

      const data = snapshot.val();
      console.log("Fetched data:", data);

      // Initialize chart data
      const updatedChartData = [
        { category: "Eligible", count: 0, fill: "var(--color-eligible)" },
        { category: "Ineligible", count: 0, fill: "var(--color-ineligible)" },
        { category: "Unknown", count: 0, fill: "var(--color-unknown)" },
      ];

      // Process data and categorize based on 'votingEligibility'
      Object.values(data).forEach((item: any, index: number) => {
        console.log(`Processing NIC data for index ${index}:`, item);

        // Check for valid 'votingEligibility' values
        if (item.votingEligibility === true) {
          updatedChartData[0].count += 1; // Eligible
        } else if (item.votingEligibility === "Unknown") {
          updatedChartData[2].count += 1; // Unknown
        } else if (item.votingEligibility === "N/A" || item.votingEligibility === false) {
          updatedChartData[1].count += 1; // Ineligible
        } else {
          // Handle cases where 'votingEligibility' is undefined or other unexpected values
          updatedChartData[2].count += 1; // Default to Unknown for unexpected values
        }
      });

      console.log("Updated chart data:", updatedChartData);

      setChartData(updatedChartData);
    });

    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, []);

  // Calculate total number of voters
  const totalVoters = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  // Calculate percentage for each category
  const getPercentage = (count: number) => {
    return totalVoters > 0 ? ((count / totalVoters) * 100).toFixed(2) : "0.00";
  };

  // Prevent rendering if there's no valid data
  if (chartData.every((data) => data.count === 0)) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="text-center pb-0">
          <CardTitle className="text-lg sm:text-xl font-semibold">Voting Eligibility Breakdown</CardTitle>
          <CardDescription className="text-sm sm:text-base">Breakdown of voter eligibility status</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="text-center text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="text-center pb-0">
        <CardTitle className="text-lg sm:text-xl font-semibold">Voting Eligibility Breakdown</CardTitle>
        <CardDescription className="text-sm sm:text-base">Breakdown of voter eligibility status</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="w-full min-h-[200px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVoters.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Sri Lankans
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none text-center">
          Eligible: {getPercentage(chartData[0].count)}% | Ineligible: {getPercentage(chartData[1].count)}% | Unknown: {getPercentage(chartData[2].count)}%
        </div>
      </CardFooter>
    </Card>
  );
}