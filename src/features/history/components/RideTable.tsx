import type { RideHistoryEntry } from "@/services/rideApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RideRow from "./RideRow";

const TABLE_HEADERS = ["#", "Route", "Status", "Driver", "Duration", "Time"];

interface RideTableProps {
  rides: RideHistoryEntry[];
}

export default function RideTable({ rides }: RideTableProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-base">All Rides</CardTitle>
        <CardDescription className="text-zinc-400">
          {rides.length} ride{rides.length !== 1 ? "s" : ""} recorded
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                {TABLE_HEADERS.map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-left text-xs font-medium text-zinc-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rides.map((ride, index) => (
                <RideRow
                  key={`${ride.id}-${index}`}
                  ride={ride}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}