import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RequestCard, { type RideRequest } from "./RequestCard";
import EmptyState from "./EmptyState";
import MinimizeButton from "./MinimizeButton";


interface DriverRequestsProps {
  requests: RideRequest[];
  onAccept: (rideId: string) => void | Promise<void>;
  onReject: (rideId: string) => void | Promise<void>;
  loadingId?: string | null;
}


export default function DriverRequests({
  requests,
  onAccept,
  onReject,
  loadingId = null,
}: DriverRequestsProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-2xl p-2 transition-all duration-300">
      <CardHeader className="pb-4 pt-5 px-6">
        <div className="flex items-center justify-between ">
          <div>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Ride Requests
            </CardTitle>
            {!isMinimized && (
              <CardDescription className="text-zinc-400 mt-1">
                Incoming ride requests from riders.
              </CardDescription>
            )}
          </div>

          <div className="flex items-center gap-2">
            {requests.length > 0 && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                {requests.length}
              </span>
            )}

            <MinimizeButton
              isMinimized={isMinimized}
              onToggle={() => setIsMinimized((prev) => !prev)}
            />
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="px-6 pb-6">
          {requests.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3 max-h-100 overflow-y-auto pr-1 custom-scrollbar">
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAccept={() => onAccept(request.id)}
                  onReject={() => onReject(request.id)}
                  isLoading={loadingId === request.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}