import { useQuery } from "@tanstack/react-query";
import { checkAvailability } from "../api/bookingApi";

export const useAvailability = (date, time, partySize, options = {}) => {
  const { enabled = true, ...restOptions } = options;
  
  return useQuery({
    queryKey: ["availability", date, time, partySize],
    queryFn: () => checkAvailability(date, time, partySize).then(r => r.data),
    enabled: enabled && !!date && !!partySize,
    ...restOptions,
  });
};
